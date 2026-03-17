"use client";

import { useState } from "react";

interface BuyButtonProps {
  slug: string;
  price: number;
  currency: "usd" | "inr";
}

export default function BuyButton({ slug, price, currency }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedPrice =
    currency === "inr"
      ? `₹${(price / 100).toFixed(0)}`
      : `$${(price / 100).toFixed(2)}`;

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            🛒 Buy Now — {formattedPrice}
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <p className="text-text-secondary text-xs text-center">
        Secure checkout powered by Stripe • Instant PDF download
      </p>
    </div>
  );
}
