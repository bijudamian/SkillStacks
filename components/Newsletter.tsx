"use client";

import { useState } from "react";
import { FadeIn } from "./FadeIn";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thanks for subscribing! Keep an eye on your inbox.");
      setEmail("");
    } catch (error: unknown) {
      const err = error as Error;
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-surface/50 border-t border-white/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Join the Inner Circle
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Get exclusive strategies, early access to new playbooks, and behind-the-scenes insights sent straight to your inbox. No spam.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto relative">
            <div className="flex items-center bg-surface border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder:text-text-secondary/50 outline-none"
                required
                disabled={status === "loading" || status === "success"}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-4 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {message && (
              <p
                className={`mt-3 text-sm font-medium ${
                  status === "error" ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
