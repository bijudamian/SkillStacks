"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react";

interface QuizResult {
  score: number;
  feedback: string;
  passed: boolean;
}

export default function QuizEngine({ sessionId, question }: { sessionId: string; question: string }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer, question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to grade quiz");
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
      <div className={`bg-surface border p-8 rounded-3xl ${result.passed ? "border-green-500/30" : "border-red-500/30"}`}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {result.passed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {result.passed ? "You Passed!" : "Needs Improvement"}
          </h2>
          <p className="text-5xl font-black mt-4 mb-2" style={{ color: result.passed ? "#4ade80" : "#f87171" }}>
            {result.score}%
          </p>
        </div>

        <div className="bg-background border border-white/5 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-2">Instructor Feedback:</h3>
          <p className="text-text-secondary leading-relaxed">{result.feedback}</p>
        </div>

        {!result.passed && (
          <button
            onClick={() => setResult(null)}
            className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
        Q: {question}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here in detail..."
            rows={6}
            className="w-full bg-background border border-white/10 rounded-xl p-4 text-white focus:border-primary/50 outline-none transition-colors resize-none"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={!answer.trim() || loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Grading...
            </>
          ) : (
            <>
              Submit Answer <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
