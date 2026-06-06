import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[webhook] Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectDB();

      await Order.create({
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email || "unknown@email.com",
        productSlug: session.metadata?.slug || "unknown",
        amountTotal: session.amount_total || 0,
        currency: session.currency || "usd",
        paymentStatus: session.payment_status,
      });

      console.log(`[webhook] Order created for session: ${session.id}`);
    } catch (dbError) {
      console.error("[webhook] Database error:", dbError);
      return NextResponse.json(
        { error: "Database error while saving order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
