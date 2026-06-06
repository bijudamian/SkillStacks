"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardDeck({ productTitle, productSlug }: { productTitle: string, productSlug: string }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    async function generateCards() {
      try {
        const res = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productSlug }),
        });

        if (!res.ok) throw new Error("Failed to generate cards");

        const data = await res.json();
        setCards(data.flashcards);
      } catch (err) {
        console.error(err);
        setError("Unable to generate flashcards. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    generateCards();
  }, [productSlug]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }, 150); // wait for flip back before changing content
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }, 150);
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold text-white">Generating your Flashcards...</h2>
        <p className="text-text-secondary text-center max-w-md">
          Our AI is reading the {productTitle} playbook to create a custom study deck for you.
        </p>
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white text-center">{error || "No cards generated"}</h2>
        <Link href="/" className="text-primary hover:text-white transition-colors">Return Home</Link>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-4 text-center">
        <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-accent" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white mb-2">Deck Completed!</h2>
          <p className="text-text-secondary text-lg">You&apos;ve reviewed all key concepts for {productTitle}.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-surface border border-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" /> Review Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 perspective-1000">
      
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">{productTitle} Flashcards</h1>
        <p className="text-text-secondary font-mono">Card {currentIndex + 1} of {cards.length}</p>
      </div>

      {/* The 3D Flip Card Container */}
      <div 
        className="w-full max-w-lg h-96 relative cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <div 
          className={`w-full h-full transition-all duration-500 rounded-3xl ${isFlipped ? "rotate-y-180" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 bg-surface border-2 border-white/10 rounded-3xl p-8 flex items-center justify-center text-center shadow-2xl backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <span className="uppercase tracking-widest text-primary/50 text-sm font-bold block mb-6">Question</span>
              <p className="text-3xl font-medium text-white leading-snug">{cards[currentIndex].front}</p>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-text-secondary/50 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Tap to flip
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-primary/10 border-2 border-primary/30 rounded-3xl p-8 flex items-center justify-center text-center shadow-2xl backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div>
              <span className="uppercase tracking-widest text-primary text-sm font-bold block mb-6">Answer</span>
              <p className="text-2xl font-medium text-white leading-relaxed">{cards[currentIndex].back}</p>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-primary/50 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Tap to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-12">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-full bg-surface border border-white/5 hover:border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-primary scale-125" : i < currentIndex ? "bg-primary/40" : "bg-white/10"}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
