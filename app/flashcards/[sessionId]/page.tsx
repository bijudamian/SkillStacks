import { products } from "@/data/products";
import FlashcardDeck from "./FlashcardDeck";

interface FlashcardPageProps {
  params: { sessionId: string };
}

export default async function FlashcardPage({ params }: FlashcardPageProps) {
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
    console.error("[flashcards] Error retrieving session:", error);
  }

  // Fallback if Stripe retrieval fails or not configured
  if (!productSlug) {
    productSlug = products[0].slug;
    productTitle = products[0].title;
  }

  return <FlashcardDeck productTitle={productTitle} productSlug={productSlug} />;
}
