import Stripe from "stripe";
import { admin } from "../../../firebase/firebaseAdmin"; // Firebase Admin SDK

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Get Firestore instance from Firebase Admin SDK
const adminDb = admin.firestore(); // Use this for all Firestore operations in this file

export async function POST(request) {
  console.log(
    "--- API Route (App Router): verify-stripe-payment POST handler started ---"
  );

  const { sessionId, userId } = await request.json();
  console.log("Request body received:", { sessionId, userId });

  // 1. Verify Firebase ID Token (Security Critical)
  const authHeader = request.headers.get("authorization");
  console.log("Auth Header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized: No token provided or malformed header");
    return new Response(
      JSON.stringify({ message: "Unauthorized: No token provided." }),
      { status: 401 }
    );
  }
  const idToken = authHeader.split("Bearer ")[1];
  console.log(
    "ID Token extracted (first 20 chars):",
    idToken ? idToken.substring(0, 20) + "..." : "Missing"
  );

  let userEmail; // Declare userEmail here to be accessible later

  try {
    console.log("Attempting to verify ID token with Firebase Admin SDK...");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(
      "ID Token verified. Decoded UID:",
      decodedToken.uid,
      "Expected UID:",
      userId
    );

    if (decodedToken.uid !== userId) {
      console.log("Forbidden: Token UID does not match provided userId.");
      return new Response(
        JSON.stringify({ message: "Forbidden: Token does not match user." }),
        { status: 403 }
      );
    }
    userEmail = decodedToken.email; // Get email from decoded token
    console.log("User identity confirmed. User Email:", userEmail);
  } catch (error) {
    console.error(
      "Error verifying Firebase ID token in verify-stripe-payment:",
      error
    );
    return new Response(
      JSON.stringify({ message: "Forbidden: Invalid or expired token." }),
      { status: 403 }
    );
  }

  try {
    // 2. Retrieve Stripe Checkout Session
    console.log("Retrieving Stripe Checkout Session for ID:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data", "customer_details"], // Expand line items and customer details
    });
    console.log(
      "Stripe Session retrieved. Payment status:",
      session.payment_status
    );
    console.log("Stripe Session Customer Details:", session.customer_details);
    console.log("Stripe Session Metadata:", session.metadata); // Log metadata to inspect

    if (session.payment_status !== "paid") {
      console.log("Payment status is not paid:", session.payment_status);
      return new Response(
        JSON.stringify({ message: "Payment not successful." }),
        { status: 400 }
      );
    }

    // --- NEW: Get cart items and shipping details from session metadata ---
    let cartItems = [];
    let sessionShippingDetails = {};

    if (session.metadata?.cartItems) {
      try {
        cartItems = JSON.parse(session.metadata.cartItems);
        console.log("Cart items parsed from metadata:", cartItems);
      } catch (e) {
        console.error("Error parsing cartItems from metadata:", e);
        return new Response(
          JSON.stringify({
            message: "Failed to parse cart items from payment session.",
          }),
          { status: 500 }
        );
      }
    } else {
      console.log("No cartItems found in session metadata.");
      // Fallback: If metadata not available, you might still try to fetch from Firestore
      // However, the goal here is to avoid that race condition.
      // For now, we return an error if cartItems are not in metadata.
      return new Response(
        JSON.stringify({
          message:
            "Cart items missing from payment session metadata. Cannot save order.",
        }),
        { status: 400 }
      );
    }

    if (session.metadata?.shippingDetails) {
      try {
        sessionShippingDetails = JSON.parse(session.metadata.shippingDetails);
        console.log(
          "Shipping details parsed from metadata:",
          sessionShippingDetails
        );
      } catch (e) {
        console.error("Error parsing shippingDetails from metadata:", e);
        return new Response(
          JSON.stringify({
            message: "Failed to parse shipping details from payment session.",
          }),
          { status: 500 }
        );
      }
    }
    // --- END NEW ---

    const totalAmount = session.amount_total / 100; // Convert cents back to Rands

    // 4. Get user's profile for additional details (e.g., phone if not in Stripe session)
    console.log("Fetching user profile from Firestore for UID:", userId);
    const userDocRef = adminDb.collection("users").doc(userId);
    const userSnap = await userDocRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};
    console.log("User data fetched from Firestore:", userData);

    // 5. Save Order to Firestore (using Admin SDK)
    console.log("Attempting to save order to Firestore...");
    const ordersCollectionRef = adminDb.collection("orders");
    const newOrderRef = ordersCollectionRef.doc(); // Let Firestore generate a new ID

    const orderData = {
      orderId: newOrderRef.id,
      userId: userId,
      userEmail: userEmail,
      items: cartItems.map((item) => ({
        // Use cartItems from metadata
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image_url,
      })),
      totalAmount: totalAmount,
      currency: "ZAR",
      shippingAddress: {
        // Prioritize Stripe's collected address, then metadata, then user profile
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
      orderDate: admin.firestore.FieldValue.serverTimestamp(), // Admin SDK server timestamp
      deliveryDate: null, // To be set later, or estimated
      status: "Processing", // Initial status
      paymentStatus: "Paid",
      stripeSessionId: sessionId,
      stripePaymentIntentId: session.payment_intent, // Important for refunds/tracking
    };

    await newOrderRef.set(orderData); // Admin SDK uses .set()
    console.log("Order saved to Firestore with ID:", newOrderRef.id);

    // 6. Clear User's Cart in Firestore (using Admin SDK)
    console.log("Attempting to clear user cart in Firestore...");
    const userCartDocRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("cart")
      .doc("currentCart");
    await userCartDocRef.delete(); // Admin SDK uses .delete()
    console.log("User cart cleared.");

    // 7. Trigger Confirmation Email (via Firebase Extension) (using Admin SDK)
    console.log("Attempting to trigger confirmation email...");
    const mailCollectionRef = adminDb.collection("mail");
    await mailCollectionRef.add({
      // Admin SDK uses .add() for new document with auto-ID
      to: [userEmail],
      message: {
        subject: `Order Confirmation - Your Order #${newOrderRef.id}`,
        html: `
          <p>Dear ${orderData.shippingAddress.fullName || userEmail},</p>
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
          ${orderData.shippingAddress.fullName}<br/>
          ${orderData.shippingAddress.addressLine1}<br/>
          ${
            orderData.shippingAddress.addressLine2
              ? orderData.shippingAddress.addressLine2 + "<br/>"
              : ""
          }
          ${orderData.shippingAddress.city}, ${
          orderData.shippingAddress.state
        } ${orderData.shippingAddress.zipCode}<br/>
          ${orderData.shippingAddress.country}
          </p>
          <p>We will notify you once your order has been shipped. You can track your order status on your profile page.</p>
          <p>Thank you for shopping with us!</p>
          <p>The Math&Co. Team</p>
        `,
      },
    });
    console.log("Confirmation email trigger document created.");

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
