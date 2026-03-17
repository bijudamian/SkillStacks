import Link from "next/link";
import Image from "next/image";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
}

const categoryColors: Record<string, string> = {
  investing: "bg-green-500/10 text-green-400 border-green-500/20",
  fitness: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  productivity: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  youtube: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice =
    product.currency === "inr"
      ? `₹${(product.price / 100).toFixed(0)}`
      : `$${(product.price / 100).toFixed(2)}`;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative bg-surface rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
        {/* Cover Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                categoryColors[product.category] || "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-text-secondary text-sm mt-2 line-clamp-2">
              {product.tagline}
            </p>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-black text-white">
              {formattedPrice}
            </span>
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-all duration-300">
              View Playbook →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
