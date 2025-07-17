import Stripe from "stripe";
import nodemailer from "nodemailer"; // Your existing nodemailer setup
import handlebars from "handlebars"; // Import handlebars
import path from "path"; // Node.js built-in module for path manipulation
import fs from "fs/promises"; // Node.js built-in module for file system operations (async)
import { NextResponse } from "next/server"; // Import NextResponse for App Router responses

// Initialize Stripe with your SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Nodemailer Transporter (reuse your existing one)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send templated email
async function sendTemplatedEmail(toEmail, subject, templatePath, data) {
    console.log("Attempting to read template from:", templatePath);
  try {
    const templateSource = await fs.readFile(templatePath, "utf8");
    const template = handlebars.compile(templateSource);
    const htmlContent = template(data);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email sent successfully to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
    return { success: false, error: error.message };
  }
}

// Define the POST handler for your webhook
export async function POST(req) {
  let event;
  const signature = req.headers.get("stripe-signature"); // Use .get() for headers in Request object

  try {
    // Get the raw body using req.text()
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Checkout Session Completed:", session.id);

      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || "Valued Customer";
      const orderNumber = session.id;
      const totalAmount = (session.amount_total / 100).toFixed(2);

      let lineItems = [];
      try {
        const items = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
        });
        lineItems = items.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          price: (item.amount_total / 100).toFixed(2),
        }));
      } catch (error) {
        console.error("Error fetching line items:", error);
      }

      if (customerEmail) {
        // Use path.join to ensure correct path resolution for Vercel deployment as well
        const emailTemplatePath = path.join(
          process.cwd(), // This evaluates to C:\xampp\htdocs\math-and-co-next\frontend
          "src", // Adds \src
          "lib", // Adds \lib
          "email_templates", // Adds \email_templates
          "order_confirmation.html" // Adds \order_confirmation.html
        );

        const emailData = {
          customerName: customerName,
          orderNumber: orderNumber,
          totalAmount: totalAmount,
          items: lineItems,
          // IMPORTANT: Replace with your actual domain for the order link
          orderLink: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}`,
          currentYear: new Date().getFullYear(),
        };

        const emailResult = await sendTemplatedEmail(
          customerEmail,
          `Your Order Confirmation from Your Company Name #${orderNumber}`,
          emailTemplatePath,
          emailData
        );

        if (!emailResult.success) {
          console.error("Failed to send order confirmation email.");
        }
      } else {
        console.warn(
          `No email found for session ${session.id}. Cannot send confirmation.`
        );
      }

      // --- Your existing logic for updating your database ---
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 OK response to Stripe
  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}

// IMPORTANT: No `config` export for bodyParser in App Router
