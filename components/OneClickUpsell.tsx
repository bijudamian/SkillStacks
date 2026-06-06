"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { IProduct } from "@/types";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OneClickUpsell({ purchasedSlug }: { purchasedSlug: string }) {
  const [upsellProduct, setUpsellProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Find a product the user didn't just buy
    const availableUpsells = products.filter(p => p.slug !== purchasedSlug);
    if (availableUpsells.length > 0) {
      // Pick a random one
      const randomUpsell = availableUpsells[Math.floor(Math.random() * availableUpsells.length)];
      setUpsellProduct(randomUpsell);
    }
  }, [purchasedSlug]);

  const handleClaimOffer = async () => {
    if (!upsellProduct) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: upsellProduct.priceId,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!upsellProduct) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-gradient-to-br from-red-500/10 via-surface to-dark border-2 border-red-500/30 rounded-3xl p-1 shadow-2xl relative overflow-hidden">
      {/* Urgency Ribbon */}
      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black px-8 py-1.5 uppercase tracking-widest transform translate-x-[25%] translate-y-[50%] rotate-45 shadow-lg">
        One Time Offer
      </div>

      <div className="bg-dark/80 backdrop-blur-xl rounded-[22px] p-6 sm:p-10 border border-white/5">
        <div className="flex flex-col items-center text-center mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
            WAIT! Your Order Is <span className="text-red-500 underline decoration-red-500/30">Not Complete</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl">
            As a new customer, you qualify for an exclusive <strong>50% discount</strong> on our most highly requested complementary playbook. This page will never be shown again.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={upsellProduct.coverImage}
              alt={upsellProduct.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white leading-tight">{upsellProduct.title}</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center h-full space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary">Unlock the exact systems to master {upsellProduct.title.toLowerCase()} instantly.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary">Save months of painful trial and error.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-xl text-text-secondary line-through font-medium">$99</span>
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Save 50%</span>
              </div>
              
              <button
                onClick={handleClaimOffer}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Claim 50% Off Now"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
              
              <button className="w-full text-center text-xs text-text-secondary/50 hover:text-text-secondary mt-4 uppercase tracking-wider underline underline-offset-4">
                No thanks, I will pay full price later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
