import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ChatInterface from "./ChatInterface";
import { products } from "@/data/products";

export default async function TutorPage({ params }: { params: { sessionId: string } }) {
  await connectDB();

  const order = await Order.findOne({ stripeSessionId: params.sessionId }).lean();

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-4">Unauthorized</h1>
          <p className="text-text-secondary">We couldn&apos;t verify your purchase. Please check your link.</p>
        </div>
      </div>
    );
  }

  // Find the product details
  const product = products.find((p) => p.slug === order.productSlug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-white/5 bg-surface p-4 text-center">
        <h1 className="text-xl font-bold text-white">
          AI Tutor: <span className="text-primary">{product.title}</span>
        </h1>
        <p className="text-sm text-text-secondary">Ask any question about your playbook.</p>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <ChatInterface sessionId={params.sessionId} productTitle={product.title} />
      </main>
    </div>
  );
}
