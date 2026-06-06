import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { products } from "@/data/products";
import AudioPlayer from "./AudioPlayer";

export default async function ListenPage({ params }: { params: { sessionId: string } }) {
  await connectDB();

  const order = await Order.findOne({ stripeSessionId: params.sessionId }).lean();

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-4">Unauthorized</h1>
          <p className="text-text-secondary">We couldn&apos;t verify your purchase.</p>
        </div>
      </div>
    );
  }

  const product = products.find((p) => p.slug === order.productSlug);

  if (!product || !product.contentSnippet) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-surface border border-white/5 p-8 rounded-3xl shadow-2xl">
        <div className="aspect-square bg-white/5 rounded-2xl mb-8 overflow-hidden relative border border-white/10">
          <Image 
            src={product.coverImage} 
            alt={product.title} 
            fill
            className="object-cover opacity-80"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">{product.title}</h1>
        <p className="text-text-secondary text-center mb-8">{product.tagline}</p>

        <AudioPlayer content={product.contentSnippet} />
      </div>
    </div>
  );
}
