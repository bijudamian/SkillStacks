import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { products as fallbackProducts } from "@/data/products";
import type { IProduct } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body as { slug: string };

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    let product: IProduct | null = null;

    try {
      await connectDB();
      const dbProduct = await Product.findOne({ slug }).lean();
      if (dbProduct) {
        product = dbProduct as unknown as IProduct;
      }
    } catch {
      console.error("[checkout] MongoDB lookup failed, using fallback data");
    }

    if (!product) {
      const fallback = fallbackProducts.find((p) => p.slug === slug);
      if (fallback) {
        product = fallback;
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.title,
              description: product.tagline,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${slug}`,
      metadata: {
        slug: product.slug,
        productTitle: product.title,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
