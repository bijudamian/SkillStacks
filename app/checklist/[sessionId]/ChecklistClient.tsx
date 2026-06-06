"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Circle, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export default function ChecklistClient({ productTitle, productSlug }: { productTitle: string, productSlug: string }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadChecklist() {
      const storageKey = `skillstacks_checklist_${productSlug}`;
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        setItems(JSON.parse(savedData));
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/checklist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productSlug }),
        });

        if (!res.ok) throw new Error("Failed to generate checklist");

        const data = await res.json();
        setItems(data.checklist);
        localStorage.setItem(storageKey, JSON.stringify(data.checklist));
      } catch (err) {
        console.error(err);
        setError("Unable to generate action checklist. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadChecklist();
  }, [productSlug]);

  const toggleItem = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setItems(newItems);
    localStorage.setItem(`skillstacks_checklist_${productSlug}`, JSON.stringify(newItems));

    // Check completion
    if (newItems.every(i => i.isCompleted)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const resetChecklist = () => {
    const resetItems = items.map(item => ({ ...item, isCompleted: false }));
    setItems(resetItems);
    localStorage.setItem(`skillstacks_checklist_${productSlug}`, JSON.stringify(resetItems));
    setShowConfetti(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold text-white">Drafting your Action Plan...</h2>
        <p className="text-text-secondary text-center max-w-md">
          Our AI is building a step-by-step execution checklist for {productTitle}.
        </p>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white text-center">{error || "No checklist generated"}</h2>
        <Link href="/" className="text-primary hover:text-white transition-colors">Return Home</Link>
      </div>
    );
  }

  const completedCount = items.filter(i => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 max-w-3xl mx-auto w-full">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="w-full text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 text-accent rounded-full mb-2">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Execution Checklist
        </h1>
        <p className="text-text-secondary text-lg">
          Take action on your {productTitle} playbook.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface border border-white/5 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex justify-between items-end mb-3">
          <span className="text-text-secondary font-medium">Progress</span>
          <span className="text-2xl font-black text-white">{progressPercent}%</span>
        </div>
        <div className="w-full h-4 bg-dark rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="w-full space-y-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
              item.isCompleted 
                ? "bg-accent/10 border-accent/30 opacity-70" 
                : "bg-surface border-white/10 hover:border-primary/50 hover:-translate-y-0.5"
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {item.isCompleted ? (
                <CheckCircle className="w-6 h-6 text-accent" />
              ) : (
                <Circle className="w-6 h-6 text-text-secondary" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/50 block mb-1">
                Step {index + 1}
              </span>
              <p className={`text-lg ${item.isCompleted ? "text-text-secondary line-through" : "text-white"}`}>
                {item.text}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-12 w-full max-w-sm">
        <button 
          onClick={resetChecklist}
          className="flex-1 flex items-center justify-center gap-2 bg-surface hover:bg-white/5 text-white py-4 rounded-xl transition-colors font-medium border border-white/10"
        >
          <RefreshCw className="w-5 h-5" /> Reset
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition-all shadow-xl font-medium"
        >
          Back to Store
        </Link>
      </div>

    </div>
  );
}
