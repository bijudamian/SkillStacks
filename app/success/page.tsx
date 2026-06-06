import Link from "next/link";
import type { Metadata } from "next";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Payment Successful — SkillStacks",
  description: "Your playbook is ready to download.",
};

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  let productTitle = "Your Playbook";
  let productSlug = "";
  let pdfUrl = "";

  if (sessionId) {
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

        if (productSlug) {
          const product = getProductBySlug(productSlug);
          if (product) {
            pdfUrl = product.pdfUrl;
          }
        }
      }
    } catch (error) {
      console.error("[success] Error retrieving session:", error);
    }
  }

  if (!pdfUrl && productSlug) {
    pdfUrl = `/pdfs/${productSlug}.pdf`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              className="w-12 h-12 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-text-secondary text-lg mb-2">
          Thank you for purchasing
        </p>
        <p className="text-primary font-bold text-xl mb-8">{productTitle}</p>

        <div className="bg-surface rounded-2xl border border-white/5 p-8 space-y-6">
          <p className="text-text-secondary text-sm">
            Your playbook is ready for download. Click the button below to get
            your PDF.
          </p>

          {/* Download Button */}
          {pdfUrl && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={pdfUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                📥 Download PDF
              </a>

              <Link
                href={`/tutor/${sessionId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                Chat with AI Tutor
              </Link>
            </div>
          )}

          {!pdfUrl && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                Unable to determine the download link. Please contact support
                with your session ID: <code className="text-xs">{sessionId}</code>
              </p>
            </div>
          )}
        </div>

        {/* Back to Store */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            🏠 Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
