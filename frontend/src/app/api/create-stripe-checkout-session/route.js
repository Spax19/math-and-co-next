import Stripe from "stripe";
import { admin } from "../../../firebase/firebaseAdmin"; // Import Admin SDK

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Export a POST function to handle POST requests to this route
export async function POST(request) {
  console.log(
    "API Route (App Router): create-stripe-checkout-session POST handler started"
  );

  const { cartItems, shippingDetails, userId, userEmail } =
    await request.json(); // Parse JSON body
  console.log("Request body received:", {
    cartItems,
    shippingDetails,
    userId,
    userEmail,
  });

  // 1. Verify Firebase ID Token (Security Critical)
  const authHeader = request.headers.get("authorization"); // Get header using .get()
  console.log("Auth Header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized: No token provided or malformed header");
    return new Response(
      JSON.stringify({ message: "Unauthorized: No token provided." }),
      { status: 401 }
    );
  }
  const idToken = authHeader.split("Bearer ")[1];
  console.log("ID Token extracted:", idToken ? "Present" : "Missing");

  try {
    console.log("Attempting to verify ID token...");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(
      "ID Token verified. Decoded UID:",
      decodedToken.uid,
      "Expected UID:",
      userId
    );

    if (decodedToken.uid !== userId || decodedToken.email !== userEmail) {
      console.log("Forbidden: Token does not match user details.");
      return new Response(
        JSON.stringify({ message: "Forbidden: Token does not match user." }),
        { status: 403 }
      );
    }
    console.log("User identity confirmed.");
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return new Response(
      JSON.stringify({ message: "Forbidden: Invalid or expired token." }),
      { status: 403 }
    );
  }

  // 2. Server-side calculation of total amount (prevents client-side tampering)
  console.log("Mapping cart items to line items...");
  const lineItems = cartItems.map((item) => {
    const unitAmount = Math.round(item.price * 100);

    let imageUrl = item.image_url;
    if (
      !imageUrl ||
      (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))
    ) {
      imageUrl = "https://placehold.co/100x100/aabbcc/ffffff?text=No+Image";
    }

    return {
      price_data: {
        currency: "zar",
        product_data: {
          name: item.name,
          images: [imageUrl],
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
  console.log("Line items created:", lineItems);

  if (lineItems.length === 0) {
    console.log("Cart is empty after mapping, returning 400");
    return new Response(JSON.stringify({ message: "Cart is empty." }), {
      status: 400,
    });
  }

  try {
    // --- UPDATED: Use the Admin SDK's Firestore instance ---
    console.log(
      "Saving cart and shipping details to Firestore using Admin SDK..."
    );
    const firestore = admin.firestore(); // Get Firestore instance from Admin SDK
    const sessionRef = await firestore
      .collection("stripe-checkout-sessions")
      .add({
        userId,
        userEmail,
        cartItems,
        shippingDetails,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
      });
    console.log("Firestore document created with ID:", sessionRef.id);
    // --- END UPDATED ---

    console.log("Attempting to create Stripe Checkout session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get(
        "origin"
      )}/main/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/main/checkout`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        checkoutSessionId: sessionRef.id,
      },
      shipping_address_collection: {
        allowed_countries: ["ZA"],
      },
    });
    console.log("Stripe session created. Session ID:", session.id);

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    // Return a proper error response to the client
    return new Response(
      JSON.stringify({
        message: error.message || "Error creating checkout session.",
      }),
      { status: 500 }
    );
  }
}
