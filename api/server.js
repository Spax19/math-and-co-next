const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();
const multer = require("multer");
const session = require("express-session");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51NsvdBGbLYLqyH5oQCPkpDiKa17ttuqkyX2UWAPbHEcQ3lqNjK6v4D2CRxK1rTfG9LETQNduiE5144TTHQwDhENy00LvUAPhq5"
);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const port = 5174;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "math-and-co-2",
});

//Database Connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
});
app.listen(port, () => {
  console.log(`listening on port ${port} `);
});

app.get("/", (req, res) => {
  return res.redirect("https://math-and-co-next-efj8.vercel.app/");
});

// Multer for file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "/tmp", "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: multer.memoryStorage(), // Store files in RAM (no filesystem writes)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});


// Route to create a PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // The amount to charge (in cents)
      currency: "usd", // Change to your preferred currency
    });
    res.send({
      clientSecret: paymentIntent.client_secret, // Send the clientSecret to the frontend
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

const bcrypt = require("bcrypt");

//POST Route for User Registration
app.post("/register", async (req, res) => {
  const { username, email, password, userType } = req.body;
  const status = "inactive";

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  // Check if email already exists
  const emailCheck = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (emailCheck.length > 0) {
    return res.status(409).json({ message: "Email already in use" });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Generate a unique verification token
  const verificationToken = crypto.randomBytes(32).toString("hex"); // Random 32-byte token

  // Insert the user data into the database with the token
  const sql = `INSERT INTO users (username, email, password, userType, verification_token, is_verified, status)
                 VALUES (?, ?, ?, ?, ?, FALSE, 'inactive')`; // is_verified is false initially

  db.query(
    sql,
    [username, email, hashedPassword, userType, verificationToken],
    (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res
          .status(500)
          .send({ message: "Registration failed. Please try again." });
      }

      // Send the verification email
      const verificationLink = `http://localhost:5174/verify-email?token=${verificationToken}`;

      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // Or use your own SMTP service
        auth: {
          user: "kmotsepe807@gmail.com", // Your email address
          pass: "nffu dqvm ovhx frfx", // Your email password (consider using OAuth2 for production)
        },
        tls: {
          rejectUnauthorized: false, // Disables TLS certificate verification (useful in dev environments)
        },
      });

      // Send email with verification link
      const mailOptions = {
        from: "kmotsepe807@gmail.com",
        to: email,
        subject: "Email Verification",
        text: `Hello ${username},\n\nPlease verify your email by clicking the following link:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending verification email:", err);
          return res
            .status(500)
            .send({ message: "Error sending verification email.", err });
        }
        res.status(200).send({
          success: true,
          message:
            "Registration successful! A verification email has been sent.",
        });
      });
    }
  );
});
app.get("/verify-email", (req, res) => {
  const { token } = req.query;

  // Check if the token is valid
  const sql = `SELECT * FROM users WHERE verification_token = ?`;

  db.query(sql, [token], (err, result) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(500).send({ message: "Error verifying email." });
    }

    if (result.length === 0) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    const user = result[0];

    // If the token is valid, update the user's is_verified and status
    const updateSql = `
        UPDATE users 
        SET is_verified = TRUE, status = 'active' 
        WHERE id = ?
      `;

    db.query(updateSql, [user.id], (err, updateResult) => {
      if (err) {
        console.error("Error updating user status:", err);
        return res.status(500).send({ message: "Error verifying email." });
      }

      // Return a success response with a message and status
      return res.redirect("http://localhost:3000/");
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = result[0];

    // Return specific error messages with consistent structure
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
        errorType: "unverified_email",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active.",
        errorType: "inactive_account",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
        errorType: "invalid_password",
      });
    }

    // Log login attempt
    const logSql = "INSERT INTO login_logs (user_id, time) VALUES (?, NOW())";
    db.query(logSql, [user.id], (logErr) => {
      if (logErr) console.error("Login log error:", logErr);
    });

    // Successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      userType: user.userType,
    });
  });
});

// POST route for event submission
app.post("/add_event", upload.single("image"), (req, res) => {
  const { name, time, location, phoneNo, email, date, active, description } =
    req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (
    !name ||
    !date ||
    !description ||
    !time ||
    !location ||
    !email ||
    !phoneNo ||
    !imagePath
  ) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO events (name, description, location, date, phoneNo, email, image, time, active ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      name,
      description,
      location,
      date,
      phoneNo,
      email,
      imagePath,
      time,
      active,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send({ error: "Database error", details: err });
      }
      res.status(200).send({
        message: "Event added successfully",
        eventId: result.insertId,
      });
    }
  );
});

// POST Route for Distributor submission
app.post("/add_distributor", upload.single("image"), (req, res) => {
  const { name, contacts, address } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!name || !contacts || !address || !imagePath) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO distributors (name, contacts, address, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, contacts, address, imagePath], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    res.status(200).json({
      message: "Distributor added successfully",
      distributor: {
        id: result.insertId,
        name,
        contacts,
        address,
        image: imagePath,
      },
    });
  });
});

//POST Route fro Product upload
app.post("/add_product", upload.single("image"), (req, res) => {
  const { name, boxes, bottles, stockCheck } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!name || !boxes || !bottles || !stockCheck || !imagePath) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO stock (name, boxes, bottles, stockCheck, image) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, boxes, bottles, stockCheck, imagePath],
    (err, result) => {
      if (err) {
        return res.status(500).send({ error: "Database error", details: err });
      }
      res.status(200).send({
        message: "Product Stock Added Successfully",
        eventId: result.insertId,
      });
    }
  );
});

// POST Route for Adding of Products
app.post(
  "/add_wine",
  upload.fields([
    { name: "image", maxCount: 1 }, // Only 1 image allowed
    { name: "caseImage", maxCount: 1 }, // Only 1 image allowed
    { name: "foodImages", maxCount: 5 }, // Up to 5 food images allowed
  ]),
  (req, res) => {
    // Extract data from req.body and file fields
    const {
      name,
      making,
      storage,
      servings,
      foodPairs,
      price,
      origin,
      description,
      taste,
      casePrice,
    } = req.body;

    const wineImagePath =
      req.files && req.files["image"] ? req.files["image"][0].filename : null;
    const caseImagePath =
      req.files && req.files["caseImage"]
        ? req.files["caseImage"][0].filename
        : null;
    const foodImages =
      req.files && req.files["foodImages"]
        ? req.files["foodImages"].map((file) => file.filename)
        : [];

    // Validate required fields
    if (!wineImagePath) {
      return res.status(400).send({ error: "Please provide a wine image." });
    }

    if (!caseImagePath) {
      return res.status(400).send({ error: "Please provide a case image." });
    }

    if (
      !name ||
      !making ||
      !storage ||
      !price ||
      !description ||
      foodImages.length === 0 ||
      !origin ||
      !taste ||
      !servings ||
      !foodPairs
    ) {
      return res
        .status(400)
        .send({ error: "All fields except images are required." });
    }

    // SQL query to insert data into the database
    const sql =
      "INSERT INTO wines (name, making, storage, price, servings, foodPairs, origin, description, taste, image, foodImages, caseImage, casePrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      sql,
      [
        name,
        making,
        storage,
        price,
        servings,
        foodPairs,
        origin,
        description,
        taste,
        wineImagePath, // Wine image file path
        JSON.stringify(foodImages),
        caseImagePath, // Case image file path
        casePrice,
      ],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(500)
            .send({ error: "Database error", details: err });
        }
        console.log("Wine added:", result);
        res.status(200).send({
          message: "Wine Added Successfully",
          eventId: result.insertId,
        });
      }
    );
  }
);

// GET route for fetching events
app.get("/get_users", (req, res) => {
  const sql = "SELECT * FROM users"; // Adjust the table name if necessary
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ error: "Database error", details: err });
    }
    res.status(200).json(results); // Send the users data as JSON
  });
});

// Use session middleware
app.use(
  session({
    secret: "your-secret-key", // Change to a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Endpoint to track visits, increment only once per session
app.post("/track-visit", (req, res) => {
  if (!req.session.visited) {
    // If the user hasn't been counted in this session
    req.session.visited = true;

    // Increment the visit count in the database
    const sql = "UPDATE visit_count SET count = count + 1 WHERE id = 1";

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error updating visit count:", err);
        return res.status(500).send("Error updating visit count");
      }
      res.status(200).send("Visit tracked");
    });
  } else {
    // User has already been counted this session
    res.status(200).send("Visit already counted for this session");
  }
});

// To get the number of visits (optional)
app.get("/get-visits", (req, res) => {
  const sql = "SELECT count FROM visit_count WHERE id = 1";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving visit count:", err);
      return res.status(500).send("Error retrieving visit count");
    }
    res.status(200).send(result[0]);
  });
});

// Endpoint to get users who have created accounts (and are active/verified)
app.get("/users", (req, res) => {
  const sql =
    'SELECT * FROM users WHERE status = "active" AND is_verified = TRUE';

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving users:", err);
      return res.status(500).send("Error retrieving users");
    }
    res.status(200).json(results); // Send the list of users as JSON
  });
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.post("/add_event", async (req, res) => {
//     const { name, email, location, description, date, phoneNo, time } = req.body;

//     try {

//         const sql = "INSERT INTO events (`name`, `email`, `location`, `date`, `description`, `phoneNo`, `time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//         const values = [name, email, location, date, phoneNo, description, time];

//         db.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error adding event:", err);
//                 return res.status(500).json({ message: "An unexpected error occurred while adding the event." });
//             }
//             res.json({ success: "Event added successfully" });
//         });

//     } catch (err) {
//         console.error("Error adding event:", err);
//         res.status(500).json({ message: "An unexpected error occurred while processing the request." });
//     }
// });

// GET route for fetching login logs
app.get("/get_user_logs/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT id, time FROM login_logs WHERE user_id = ? ORDER BY time DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(200).json(results);
  });
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM events";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/get_users", (req, res) => {
  const sql = "SELECT * FROM users"; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

app.get("/get_events", (req, res) => {
  const sql = "SELECT * FROM events"; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

// Route to delete a user
app.delete("/delete_user/:userId", (req, res) => {
  const { userId } = req.params;

  const deleteLogsQuery = "DELETE FROM login_logs WHERE user_id = ?";
  const deleteUserQuery = "DELETE FROM users WHERE id = ?";

  db.query(deleteLogsQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting logs:", err);
      return res
        .status(500)
        .json({ message: "Error deleting logs", details: err });
    }
    console.log("Deleted login logs:", result.affectedRows);

    db.query(deleteUserQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res
          .status(500)
          .json({ message: "Error deleting user", details: err });
      }
      console.log("Deleted user count:", result.affectedRows);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "User not found or already deleted." });
      }
      res.status(200).json({ message: "User deleted successfully" });
    });
  });
});

// Route to deactivate a user
app.put("/deactivate_user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = "UPDATE users SET status = 'inactive' WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error deactivating user:", err);
      return res
        .status(500)
        .json({ message: "Error deactivating user", details: err });
    }
    console.log("Updated rows:", result.affectedRows);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already inactive." });
    }
    res.status(200).json({ message: "User deactivated successfully" });
  });
});

app.get("/get_distributors", (req, res) => {
  const sql = "SELECT * FROM distributors"; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

app.get("/get_dsitributors", (req, res) => {
  const sql = "SELECT * FROM distributors"; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

app.get("/get_product", (req, res) => {
  const sql = "SELECT * FROM stock"; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

app.get("/get_wine", (req, res) => {
  const sql = "SELECT * FROM wines"; // Fetch all wines
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

// DELETE endpoint to delete a product
app.delete("/delete_product/:id", (req, res) => {
  const { id } = req.params; // Get the distributor ID from the URL parameters

  const sql = "DELETE FROM stock WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    // If no rows are affected, it means the distributor was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
});

app.delete("/delete_wine/:id", (req, res) => {
  const { id } = req.params; // Get the wine ID from the URL parameters
  const { name } = req.query; // Get the wine name from the query parameters

  console.log("Received name from frontend:", name); // Debugging log
  console.log("Wine ID from params:", id); // Debugging log

  // Fetch the wine details from the database
  const selectSql = "SELECT name, image, foodImages FROM wines WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Wine not found" });
    }

    const wine = result[0];

    // Log the wine name from the database to compare with the incoming `name`
    console.log("Wine name from database:", wine.name);

    // Check if the entered name matches the wine's name in the database
    if (wine.name !== name) {
      console.log("Names do not match, aborting deletion"); // Debugging log
      return res.status(400).json({ message: "Wine name does not match" });
    }

    // Retrieve the file paths for the image and food images
    const imagePath = wine.image
      ? path.join(__dirname, "uploads", wine.image)
      : null;
    const foodImagePaths = wine.foodImages ? JSON.parse(wine.foodImages) : [];

    // Delete the wine from the database
    const deleteSql = "DELETE FROM wines WHERE id = ?";
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Wine not found" });
      }

      // If a main image exists, delete it from the server
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // If food images exist, delete them from the server
      foodImagePaths.forEach((foodImage) => {
        const foodImagePath = path.join(__dirname, "uploads", foodImage);
        if (fs.existsSync(foodImagePath)) {
          fs.unlinkSync(foodImagePath);
        }
      });

      return res.status(200).json({ message: "Wine deleted successfully" });
    });
  });
});

// PUT endpoint to edit a product
app.put("/edit_product/:id", upload.single("image"), (req, res) => {
  const productId = req.params.id; // Get the product ID from the URL
  const { name, boxes, bottles, stockCheck } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!name || !boxes || !bottles || stockCheck === undefined) {
    return res.status(400).send({ error: "All fields are required" });
  }

  // Prepare the SQL query
  let sql = "UPDATE stock SET name = ?, boxes = ?, bottles = ?, stockCheck = ?";
  const values = [name, boxes, bottles, stockCheck];

  // If a new image is uploaded, include it in the update
  if (imagePath) {
    sql += ", image = ?";
    values.push(imagePath);
  }

  sql += " WHERE id = ?";
  values.push(productId); // Ensure we update the correct product by ID

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err); // Log the error for debugging
      return res.status(500).send({ error: "Database error", details: err });
    }

    // Check if the product was updated
    if (result.affectedRows > 0) {
      res.status(200).send({
        message: "Product updated successfully",
        updatedId: productId,
      });
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  });
});

app.put(
  "/edit_wine/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "foodImages", maxCount: 10 },
  ]),
  (req, res) => {
    const productId = req.params.id; // Get the product ID from the URL
    const {
      name,
      making,
      storage,
      price,
      servings,
      foodPairs,
      origin,
      description,
      taste,
    } = req.body;

    // Get image and food images from the request
    const imagePath = req.files["image"]
      ? req.files["image"][0].filename
      : null;
    const foodImagePaths = req.files["foodImages"]
      ? req.files["foodImages"].map((file) => file.filename)
      : [];

    // Check if required fields are provided
    if (
      !name ||
      !making ||
      !storage ||
      !price ||
      !servings ||
      !foodPairs ||
      !origin ||
      !description ||
      !taste
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Prepare the SQL query for updating wine
    let sql =
      "UPDATE wines SET name = ?, making = ?, storage = ?, price = ?, servings = ?, foodPairs = ?, origin = ?, description = ?, taste = ?";
    const values = [
      name,
      making,
      storage,
      price,
      servings,
      foodPairs,
      origin,
      description,
      taste,
    ];

    // If a new image is uploaded, include it in the update
    if (imagePath) {
      sql += ", image = ?";
      values.push(imagePath);
    }

    // If food images are uploaded, include them in the update
    if (foodImagePaths.length > 0) {
      sql += ", foodImages = ?";
      values.push(JSON.stringify(foodImagePaths)); // Store the food images as a JSON array
    }

    sql += " WHERE id = ?";
    values.push(productId); // Ensure we update the correct product by ID

    // Execute the SQL query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating product:", err); // Log the error for debugging
        return res.status(500).send({ error: "Database error", details: err });
      }

      // Check if the product was updated
      if (result.affectedRows > 0) {
        res
          .status(200)
          .send({ message: "Wine updated successfully", updatedId: productId });
      } else {
        res.status(404).send({ error: "Wine not found" });
      }
    });
  }
);

// Edit Distributor Endpoint
app.put("/edit_distributor/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, contacts, address } = req.body;
  const image = req.file ? req.file.filename : null; // Optional image

  // Get the current distributor details before updating
  const selectQuery = "SELECT * FROM distributors WHERE id = ?";
  db.query(selectQuery, [id], (err, result) => {
    if (err || result.length === 0) {
      console.error("Distributor not found:", err);
      return res.status(404).json({ message: "Distributor not found" });
    }

    const distributor = result[0];

    // If there's a new image, delete the old one
    if (image && distributor.image) {
      fs.unlinkSync(path.join(__dirname, "uploads", distributor.image));
    }

    const updateQuery = `
            UPDATE distributors
            SET name = ?, contacts = ?, address = ?, image = ?
            WHERE id = ?`;

    db.query(
      updateQuery,
      [name, contacts, address, image || distributor.image, id],
      (err, result) => {
        if (err) {
          console.error("Error updating distributor:", err);
          return res
            .status(500)
            .json({ message: "Error updating distributor" });
        }

        return res.status(200).json({
          id,
          name,
          contacts,
          address,
          image: image || distributor.image,
        });
      }
    );
  });
});

// Delete Distributor Endpoint
app.delete("/delete_distributor/:id", (req, res) => {
  const { id } = req.params;

  // Get the distributor's details to check if an image exists
  const selectQuery = "SELECT * FROM distributors WHERE id = ?";
  db.query(selectQuery, [id], (err, result) => {
    if (err || result.length === 0) {
      console.error("Distributor not found:", err);
      return res.status(404).json({ message: "Distributor not found" });
    }

    const distributor = result[0];

    // If the distributor has an image, delete it from the server
    if (distributor.image) {
      const imagePath = path.join(__dirname, "uploads", distributor.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the distributor from the database
    const deleteQuery = "DELETE FROM distributors WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting distributor:", err);
        return res.status(500).json({ message: "Error deleting distributor" });
      }

      return res
        .status(200)
        .json({ message: "Distributor deleted successfully" });
    });
  });
});

// app.js or routes/distributors.js
app.delete("/delete_distributor/:id", (req, res) => {
  const { id } = req.params; // Get the distributor ID from the URL parameters

  const sql = "DELETE FROM distributors WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    // If no rows are affected, it means the distributor was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    return res
      .status(200)
      .json({ message: "Distributor deleted successfully" });
  });
});

app.get("/get_all_events", (req, res) => {
  const sql = "SELECT * FROM events WHERE active = 0 "; // Fetch all users
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result); // Return all users
  });
});

app.put("/update_event_status/:id", async (req, res) => {
  const eventId = req.params.id;
  const { active } = req.body;

  try {
    // Update the toy (event) in the toy box (database)
    await db.query("UPDATE events SET active = ? WHERE id = ?", [
      active,
      eventId,
    ]);
    res.status(200).send("Event status updated");
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).send("Error updating event status");
  }
});

app.put("/deactivate_account/:id", async (req, res) => {
  const eventId = req.params.id;
  const { active } = req.body;

  try {
    // Update the toy (event) in the toy box (database)
    await db.query(
      "UPDATE users SET status = `inactive` WHERE id = ? AND userType = `admin`",
      [active, eventId]
    );
    res.status(200).send("Event status updated");
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).send("Error updating event status");
  }
});

// API endpoint to get the total number of user accounts
app.get("/get_total_users", (req, res) => {
  const query = "SELECT COUNT(*) AS totalUsers FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Failed to fetch total users" });
    }

    // Send the total number of users as a response
    const totalUsers = results[0].totalUsers;
    res.status(200).json({ totalUsers });
  });
});

app.put("/edit_event/:id", async (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE events SET name=?, email=?, location=?, description=?, time=?, phoneNo=?, email=?, date=? WHERE id=?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.location,
    req.body.description,
    req.body.phoneNo,
    req.body.date,
    req.body.time,
    id,
  ];
  try {
    // Update the toy (event) in the toy box (database)
    await db.query("sql");
    res.status(200).send("Event updated");
  } catch (error) {
    console.error("Error updating event: ", error);
    res.status(500).send("Error updating event.");
  }
});

app.delete("/delete_distributor/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM distributors WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Distributor updated successfully" });
  });
});
