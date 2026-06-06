"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Target, Zap, Clock, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { products } from "@/data/products";

interface RoadmapStep {
  phase: string;
  playbookSlug: string;
  reasoning: string;
}

interface RoadmapResult {
  title: string;
  summary: string;
  steps: RoadmapStep[];
}

export default function RoadmapPage() {
  const [goal, setGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [timeCommitment, setTimeCommitment] = useState("1-2 hours / week");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RoadmapResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, skillLevel, timeCommitment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate roadmap");
      }

      setResult(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {!result && !loading && (
          <div className="bg-surface border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Get Your Custom Skill Roadmap
              </h1>
              <p className="text-text-secondary text-lg">
                Tell us your goals, and our AI will build a personalized step-by-step curriculum using our premium playbooks.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Target className="w-4 h-4 text-primary" />
                  What is your primary goal?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Start a business, build an audience, lose weight"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Zap className="w-4 h-4 text-accent" />
                  Current Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-colors"
                >
                  <option>Beginner (Starting from scratch)</option>
                  <option>Intermediate (I know the basics)</option>
                  <option>Advanced (Looking to scale)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Clock className="w-4 h-4 text-secondary" />
                  Time Commitment
                </label>
                <select
                  value={timeCommitment}
                  onChange={(e) => setTimeCommitment(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-colors"
                >
                  <option>1-2 hours / week</option>
                  <option>5 hours / week</option>
                  <option>10+ hours / week</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={!goal.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                Generate My Roadmap <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="w-20 h-20 bg-surface border border-white/10 rounded-full flex items-center justify-center relative">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing your profile...</h2>
              <p className="text-text-secondary">Building your optimal learning path.</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold mb-6">
                <CheckCircle2 className="w-4 h-4" /> Roadmap Generated
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-6">
                {result.title}
              </h1>
              <p className="text-xl text-text-secondary">
                {result.summary}
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-white/5" />

              <div className="space-y-12">
                {result.steps.map((step, idx) => {
                  const product = products.find(p => p.slug === step.playbookSlug);
                  
                  return (
                    <div key={idx} className="relative pl-16 md:pl-24 group">
                      {/* Timeline Dot */}
                      <div className="absolute left-4 md:left-6 top-6 w-5 h-5 rounded-full bg-background border-4 border-primary z-10 -translate-x-1/2 group-hover:scale-125 transition-transform" />
                      
                      <div className="bg-surface border border-white/5 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors">
                        <span className="text-sm font-bold tracking-wider text-primary uppercase mb-2 block">
                          {step.phase}
                        </span>
                        
                        {product ? (
                          <div className="mt-4 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <h3 className="text-2xl font-bold text-white">{product.title}</h3>
                              <p className="text-text-secondary leading-relaxed">
                                {step.reasoning}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center md:items-start justify-end md:justify-start">
                              <Link
                                href={`/product/${product.slug}`}
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 hover:border-primary/50 group/btn"
                              >
                                View Playbook 
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <h3 className="text-xl font-bold text-white mb-2">Unknown Step</h3>
                            <p className="text-text-secondary">{step.reasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center pt-8">
              <button 
                onClick={() => setResult(null)}
                className="text-text-secondary hover:text-white transition-colors underline underline-offset-4"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
