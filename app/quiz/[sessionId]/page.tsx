import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { products } from "@/data/products";
import QuizEngine from "./QuizEngine";

export default async function QuizPage({ params }: { params: { sessionId: string } }) {
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

  if (!product) {
    return notFound();
  }

  // Pre-determined questions based on category for MVP
  const questions: Record<string, string> = {
    investing: "Explain the concept of a 3-fund portfolio and why it is recommended for beginners instead of picking individual stocks.",
    fitness: "Why is tracking your Total Daily Energy Expenditure (TDEE) more important than doing 2 hours of cardio every day for fat loss?",
    youtube: "Describe the workflow of a faceless YouTube automation channel and explain why consistency is crucial for the algorithm."
  };

  const question = questions[product.category] || "What is the most valuable lesson you learned from this playbook?";

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm">
            Knowledge Check
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{product.title}</h1>
          <p className="text-text-secondary text-lg">
            Let&apos;s verify what you&apos;ve learned. Answer the question below to complete your playbook.
          </p>
        </header>

        <QuizEngine sessionId={params.sessionId} question={question} />
      </div>
    </div>
  );
}
