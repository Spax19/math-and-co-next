// file: app/api/checkout_sessions/route.js

import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const cartItems = await request.json();

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "zar",
        product_data: {
          name: item.name,
          images: [item.image_url],
        },
        unit_amount: item.price * 100, // Price in cents
      },
      quantity: item.quantity || 1,
    }));

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      // 👇 CORRECTED URLS
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/main/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`, // Redirects to homepage on cancel
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    // Log the full error for better debugging
    console.error("Error creating checkout session:", err);
    // Provide a more informative error response
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
