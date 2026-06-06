"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, ArrowRight, Target } from "lucide-react";

interface AnalysisResult {
  recommendedSlug: string;
  analysis: string;
  whyThisPlaybook: string;
}

export default function ResumeScanner() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze profile");
      }

      setResult(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="bg-surface border border-primary/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="mb-8 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-background border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Profile Strengths
            </h3>
            <p className="text-text-secondary leading-relaxed">{result.analysis}</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <h3 className="text-primary font-bold mb-2">The Missing Link:</h3>
            <p className="text-text-secondary leading-relaxed text-white/90">{result.whyThisPlaybook}</p>
          </div>
        </div>

        <Link
          href={`/product/${result.recommendedSlug}`}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 text-lg"
        >
          View Recommended Playbook <ArrowRight className="w-5 h-5" />
        </Link>
        
        <button
          onClick={() => setResult(null)}
          className="w-full mt-4 text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
        >
          Scan another profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
      <form onSubmit={handleScan} className="space-y-6 relative z-10">
        <div>
          <label htmlFor="resume" className="block text-white font-bold mb-2">
            Your Profile (Text)
          </label>
          <textarea
            id="resume"
            required
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume, LinkedIn 'About' section, or just type out what you do and what you want to achieve..."
            rows={10}
            className="w-full bg-background border border-white/10 rounded-xl p-4 text-white focus:border-primary/50 outline-none transition-colors resize-none placeholder:text-white/20"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={!resume.trim() || loading}
          className="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-primary">Scanning profile data...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2 group-hover:text-primary transition-colors">
              <Sparkles className="w-5 h-5" /> Analyze My Career
            </span>
          )}
          
          {/* Scanning Animation */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),1)] animate-[scan_2s_ease-in-out_infinite]" />
          )}
        </button>
      </form>
    </div>
  );
}
