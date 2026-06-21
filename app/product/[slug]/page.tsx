import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";
import LiveVisitorCount from "@/components/LiveVisitorCount";
import ReadingTime from "@/components/ReadingTime";
import { products } from "@/data/products";
import type { IProduct } from "@/types";

interface ProductPageProps {
  params: { slug: string };
}

function getProduct(slug: string): IProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} — SkillStacks`,
    description: product.tagline,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const formattedPrice =
    product.currency === "inr"
      ? `₹${(product.price / 100).toFixed(0)}`
      : `$${(product.price / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Cover Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={product.coverImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
                  {product.category}
                </span>
                <ReadingTime product={product} />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {product.title}
                </h1>
                <p className="text-text-secondary text-lg mt-4 leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">
                  {formattedPrice}
                </span>
                <span className="text-text-secondary text-sm">
                  one-time payment
                </span>
              </div>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed">
                {product.description}
              </p>

              {/* Buy Button & Live Count */}
              <div id="buy-section" className="space-y-4">
                <LiveVisitorCount />
                <BuyButton
                  slug={product.slug}
                  price={product.price}
                  currency={product.currency}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="py-16 sm:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* What You'll Learn */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📚</span>
                </span>
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-4">
                {product.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-accent flex-shrink-0 mt-0.5 text-lg">
                      ✅
                    </span>
                    <span className="text-text-secondary text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools Included */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🛠️</span>
                </span>
                Tools Included
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="bg-surface border border-white/10 text-text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:border-primary/30 hover:text-primary transition-all duration-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Mistakes to Avoid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🚫</span>
                </span>
                Mistakes You&apos;ll Avoid
              </h2>
              <ul className="space-y-4">
                {product.mistakesToAvoid.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0 mt-0.5 text-lg">
                      ❌
                    </span>
                    <span className="text-text-secondary text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 30-Day Action Plan Teaser */}
      <section className="py-16 sm:py-24 bg-surface/20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-surface rounded-2xl border border-white/5 p-8 sm:p-12">
            <span className="text-4xl mb-4 block">🗓️</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              30-Day Action Plan Included
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
              Every playbook includes a detailed 30-day action plan that breaks
              down exactly what to do each week. No guessing, no analysis
              paralysis — just follow the steps and watch your progress compound.
            </p>
            <BuyButton
              slug={product.slug}
              price={product.price}
              currency={product.currency}
            />
          </div>
        </div>
      </section>

      {/* Mobile Sticky Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-xl border-t border-white/10 p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-white font-bold text-sm line-clamp-1">
              {product.title}
            </p>
            <p className="text-accent font-black text-lg">{formattedPrice}</p>
          </div>
          <a
            href="#buy-section"
            className="bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
