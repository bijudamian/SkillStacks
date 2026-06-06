"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2, Copy, CheckCircle2 } from "lucide-react";

export default function GeneratorPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !audience) return;

    setLoading(true);
    setError("");
    setMarkdown("");

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setMarkdown(data.markdown);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">AI Playbook Generator</h1>
            <p className="text-text-secondary">Instantly draft new products using Gemini AI.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface border border-white/5 p-6 rounded-2xl">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Playbook Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Email Marketing for SaaS"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bootstrapped Founders"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none"
                    required
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading || !topic || !audience}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generate Draft
                </button>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-white/5 rounded-2xl flex flex-col h-[600px]">
              <div className="border-b border-white/10 p-4 flex items-center justify-between">
                <h3 className="text-white font-semibold">Markdown Output</h3>
                {markdown && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-auto p-6 prose prose-invert max-w-none">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Gemini is writing your playbook...</p>
                  </div>
                ) : markdown ? (
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary border-2 border-dashed border-white/5 rounded-xl">
                    <p>Enter a topic and generate to see the draft here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
