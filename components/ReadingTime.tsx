"use client";

import { Clock } from "lucide-react";
import { IProduct } from "@/types";

export default function ReadingTime({ product }: { product: IProduct }) {
  // Estimate reading time based on description and what you learn array
  const wordCount = product.description.split(" ").length + product.whatYouLearn.join(" ").split(" ").length + 300; // adding 300 words for base content
  
  // Average reading speed is ~200-250 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex items-center gap-1.5 text-text-secondary bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm font-medium w-fit">
      <Clock className="w-4 h-4 text-accent" />
      <span>{readingTimeMinutes} min read</span>
    </div>
  );
}
