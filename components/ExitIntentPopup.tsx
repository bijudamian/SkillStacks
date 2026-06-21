"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if they've already seen it
    const stored = localStorage.getItem("skillstacks_exit_intent_seen");
    if (stored) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // If the mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem("skillstacks_exit_intent_seen", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasTriggered]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />
      <div className="relative w-full max-w-lg bg-surface border-2 border-primary/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-4 text-text-secondary hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Wait! Before You Go...
          </h2>
          
          <p className="text-lg text-text-secondary">
            Take an extra <span className="text-white font-bold bg-primary/20 px-2 py-0.5 rounded">10% OFF</span> your first playbook. Don&apos;t let your competition get ahead of you.
          </p>

          <div className="w-full bg-dark rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <span className="text-text-secondary font-medium">Use Code:</span>
            <span className="font-mono font-bold text-xl text-primary tracking-widest border-b-2 border-primary border-dashed">
              EXECUTE10
            </span>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)]"
          >
            Claim My 10% Off Now
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors underline underline-offset-4"
          >
            No thanks, I&apos;ll pass on this one-time offer
          </button>
        </div>
      </div>
    </div>
  );
}
