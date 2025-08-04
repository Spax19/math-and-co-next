import Stripe from "stripe";
import { admin } from "../../../firebase/firebaseAdmin"; // Firebase Admin SDK
import nodemailer from "nodemailer"; // Import Nodemailer

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Get Firestore instance from Firebase Admin SDK
const adminDb = admin.firestore();

// --- NEW: Nodemailer transporter setup ---
// You will need to set up an email service account.
// Here is an example using SendGrid's free tier.
// You must store your API key in an environment variable.
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "NEXT_PUBLIC_FIREBASE_API_KEY", // This is the literal string "apikey" for SendGrid
    pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
  },
});

// Alternatively, for a basic Gmail setup (less secure but works for testing):
/*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use an App Password, not your regular password
    }
});
*/

// --- END NEW ---

export async function POST(request) {
  console.log(
    "--- API Route (App Router): verify-stripe-payment POST handler started ---"
  );

  const { sessionId, userId } = await request.json();
  console.log("Request body received:", { sessionId, userId });

  // 1. Verify Firebase ID Token (Security Critical)
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ message: "Unauthorized: No token provided." }),
      { status: 401 }
    );
  }
  const idToken = authHeader.split("Bearer ")[1];
  let userEmail;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.uid !== userId) {
      return new Response(
        JSON.stringify({ message: "Forbidden: Token does not match user." }),
        { status: 403 }
      );
    }
    userEmail = decodedToken.email;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return new Response(
      JSON.stringify({ message: "Forbidden: Invalid or expired token." }),
      { status: 403 }
    );
  }

  try {
    // 2. Retrieve Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ message: "Payment not successful." }),
        { status: 400 }
      );
    }

    // 3. Fetch cart items and shipping details from Firestore
    const checkoutSessionId = session.metadata?.checkoutSessionId;
    if (!checkoutSessionId) {
      return new Response(
        JSON.stringify({ message: "Order data link missing." }),
        { status: 400 }
      );
    }

    const tempOrderDocRef = adminDb
      .collection("stripe-checkout-sessions")
      .doc(checkoutSessionId);
    const tempOrderSnap = await tempOrderDocRef.get();
    if (!tempOrderSnap.exists) {
      return new Response(
        JSON.stringify({ message: "Order data not found." }),
        { status: 404 }
      );
    }

    const orderDataFromFirestore = tempOrderSnap.data();
    const cartItems = orderDataFromFirestore.cartItems;
    const sessionShippingDetails = orderDataFromFirestore.shippingDetails;

    const totalAmount = session.amount_total / 100;

    // 4. Get user's profile for additional details
    const userDocRef = adminDb.collection("users").doc(userId);
    const userSnap = await userDocRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};

    // 5. Save Final Order to Firestore's 'orders' collection
    const ordersCollectionRef = adminDb.collection("orders");
    const newOrderRef = ordersCollectionRef.doc();

    const finalOrderData = {
      orderId: newOrderRef.id,
      userId: userId,
      userEmail: userEmail,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image_url,
      })),
      totalAmount: totalAmount,
      currency: "ZAR",
      shippingAddress: {
        fullName:
          session.customer_details?.name ||
          sessionShippingDetails.fullName ||
          userData.displayName ||
          "",
        email:
          session.customer_details?.email ||
          sessionShippingDetails.email ||
          userData.email ||
          "",
        phone: sessionShippingDetails.phone || userData.phone || "",
        addressLine1:
          session.customer_details?.address?.line1 ||
          sessionShippingDetails.addressLine1 ||
          userData.address?.line1 ||
          "",
        addressLine2:
          session.customer_details?.address?.line2 ||
          sessionShippingDetails.addressLine2 ||
          userData.address?.line2 ||
          "",
        city:
          session.customer_details?.address?.city ||
          sessionShippingDetails.city ||
          userData.address?.city ||
          "",
        state:
          session.customer_details?.address?.state ||
          sessionShippingDetails.state ||
          userData.address?.state ||
          "",
        zipCode:
          session.customer_details?.address?.postal_code ||
          sessionShippingDetails.zipCode ||
          userData.address?.zipCode ||
          "",
        country:
          session.customer_details?.address?.country ||
          sessionShippingDetails.country ||
          userData.address?.country ||
          "ZA",
      },
      orderDate: admin.firestore.FieldValue.serverTimestamp(),
      deliveryDate: null,
      status: "Processing",
      paymentStatus: "Paid",
      stripeSessionId: sessionId,
      stripePaymentIntentId: session.payment_intent,
    };

    await newOrderRef.set(finalOrderData);
    console.log("Order saved to Firestore with ID:", newOrderRef.id);

    // 6. Clear User's Cart in Firestore
    const userCartDocRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("cart")
      .doc("currentCart");
    await userCartDocRef.delete();
    console.log("User cart cleared.");

    // --- UPDATED: Send confirmation email directly with Nodemailer ---
    const recipientEmail = finalOrderData.shippingAddress.email || userEmail;
    console.log("Sending confirmation email to:", recipientEmail);

    const mailOptions = {
      from: `Math&Co. <${process.env.SENDER_EMAIL}>`, // Use a verified sender email
      to: recipientEmail,
      subject: `Order Confirmation - Your Order #${newOrderRef.id}`,
      html: `
        <p>Dear ${finalOrderData.shippingAddress.fullName || userEmail},</p>
        <p>Thank you for your purchase! Your order <strong>#${
          newOrderRef.id
        }</strong> has been successfully placed.</p>
        <h3>Order Details:</h3>
        <ul>
          ${cartItems
            .map(
              (item) =>
                `<li>${item.name} (Qty: ${item.quantity}) - R${(
                  item.price * item.quantity
                ).toFixed(2)}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total Amount:</strong> R${totalAmount.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong><br/>
        ${finalOrderData.shippingAddress.fullName}<br/>
        ${finalOrderData.shippingAddress.addressLine1}<br/>
        ${
          finalOrderData.shippingAddress.addressLine2
            ? finalOrderData.shippingAddress.addressLine2 + "<br/>"
            : ""
        }
        ${finalOrderData.shippingAddress.city}, ${
        finalOrderData.shippingAddress.state
      } ${finalOrderData.shippingAddress.zipCode}<br/>
        ${finalOrderData.shippingAddress.country}
        </p>
        <p>We will notify you once your order has been shipped. You can track your order status on your profile page.</p>
        <p>Thank you for shopping with us!</p>
        <p>The Math&Co. Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully via Nodemailer.");
    // --- END UPDATED ---

    // 7. Clean up the temporary document
    await tempOrderDocRef.delete();
    console.log("Temporary Firestore document deleted successfully.");

    return new Response(
      JSON.stringify({
        message: "Payment verified and order saved.",
        orderId: newOrderRef.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "--- CRITICAL ERROR in verify-stripe-payment handler ---",
      error
    );
    return new Response(
      JSON.stringify({
        message:
          error.message || "Internal server error during payment verification.",
      }),
      { status: 500 }
    );
  }
}
