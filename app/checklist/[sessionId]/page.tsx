import { products } from "@/data/products";
import ChecklistClient from "./ChecklistClient";

interface ChecklistPageProps {
  params: { sessionId: string };
}

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { sessionId } = params;

  let productTitle = "Playbook";
  let productSlug = "";

  try {
    const Stripe = (await import("stripe")).default;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (stripeSecretKey) {
      const stripeInstance = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
      });

      const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

      if (session.metadata) {
        productTitle = session.metadata.productTitle || productTitle;
        productSlug = session.metadata.slug || "";
      }
    }
  } catch (error) {
    console.error("[checklist] Error retrieving session:", error);
  }

  // Fallback if Stripe retrieval fails or not configured
  if (!productSlug) {
    productSlug = products[0].slug;
    productTitle = products[0].title;
  }

  return <ChecklistClient productTitle={productTitle} productSlug={productSlug} />;
}
