import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Link from "next/link";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-white/5 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-5 bg-surface hover:bg-surface/80 transition-colors">
        <span className="text-white font-medium text-sm sm:text-base pr-4">
          {question}
        </span>
        <svg
          className="w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-5 pb-5 pt-3 bg-surface/50">
        <p className="text-text-secondary text-sm leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}

export default function HomePage() {
  const faqs = [
    {
      question: "What exactly is an Action Playbook?",
      answer:
        "An Action Playbook is a step-by-step PDF guide designed for execution, not just learning. Each playbook includes specific actions, tools, templates, and timelines so you can implement immediately — no fluff, no theory overload.",
    },
    {
      question: "How do I access my playbook after purchase?",
      answer:
        "Immediately after payment, you'll be redirected to a download page where you can download your PDF. You'll also have the link available for future access. It's instant — no waiting.",
    },
    {
      question: "Are these playbooks for beginners?",
      answer:
        "Absolutely. Every playbook is written assuming zero prior knowledge. We start from the fundamentals and build up to advanced strategies, with clear explanations at every step.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Due to the digital nature of our products, we don't offer refunds once the PDF has been downloaded. However, if you're unsatisfied, reach out to us and we'll work something out.",
    },
    {
      question: "Will more playbooks be added?",
      answer:
        "Yes! We're actively working on playbooks for freelancing, personal finance, and productivity. Join our mailing list to be the first to know when new playbooks drop.",
    },
  ];

  return (
    <>
      {/* ========== HERO ========== */}
      <section
        id="hero"
        className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">
              New Playbooks Available
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            Stop Learning.
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
              Start Executing.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Premium action playbooks that transform knowledge into results.
            Each guide is a step-by-step system — not another course you&apos;ll never finish.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#products"
              className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              Browse Playbooks →
            </Link>
            <Link
              href="#features"
              className="text-text-secondary hover:text-white font-medium px-8 py-4 rounded-xl text-lg transition-colors border border-white/10 hover:border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SOCIAL PROOF ========== */}
      <section className="border-y border-white/5 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">500+</p>
              <p className="text-text-secondary text-xs sm:text-sm mt-1">Happy Learners</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">3</p>
              <p className="text-text-secondary text-xs sm:text-sm mt-1">Action Playbooks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">Instant</p>
              <p className="text-text-secondary text-xs sm:text-sm mt-1">PDF Download</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS GRID ========== */}
      <section id="products" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Our Action Playbooks
            </h2>
            <p className="text-text-secondary mt-4 max-w-xl mx-auto">
              Each playbook is a complete action system — not generic advice.
              Pick one and start executing today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-20 sm:py-28 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Why SkillStacks?
            </h2>
            <p className="text-text-secondary mt-4 max-w-xl mx-auto">
              We&apos;re not another course platform. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface rounded-2xl border border-white/5 p-8 text-center group hover:border-primary/20 transition-all duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                Action-First Approach
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                No fluff, no filler. Every page is designed to move you from
                &quot;I know this&quot; to &quot;I&apos;ve done this.&quot; Execute from day one.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface rounded-2xl border border-white/5 p-8 text-center group hover:border-secondary/20 transition-all duration-500">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                Complete Systems
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Tools, templates, checklists, and exact steps — everything you
                need in one PDF. No hunting for missing pieces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface rounded-2xl border border-white/5 p-8 text-center group hover:border-accent/20 transition-all duration-500">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                Instant Access
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Pay once, download immediately. No subscriptions, no
                drip-feeding content. The full playbook is yours forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary mt-4">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Stop Watching
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              and Start Doing?
            </span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto">
            Pick a playbook. Follow the steps. See real results. It&apos;s that simple.
          </p>
          <div className="mt-10">
            <Link
              href="#products"
              className="inline-flex bg-accent hover:bg-accent/90 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              Get Your Playbook Now →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
