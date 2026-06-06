"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

export default function AudioPlayer({ content }: { content: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(content);
      u.rate = 0.9; // Slightly slower for better comprehension
      
      u.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      setSpeechSynthesis(synth);
      setUtterance(u);
    }
  }, [content]);

  const togglePlayPause = () => {
    if (!speechSynthesis || !utterance) return;

    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.cancel(); // Reset
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 text-text-secondary text-sm">
        <span>Web Speech Engine</span>
        <Volume2 className="w-4 h-4" />
      </div>

      {/* Progress Bar (Visual only for MVP) */}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-primary transition-all duration-300 ${isPlaying && !isPaused ? "w-full ease-linear duration-[30000ms]" : "w-0"}`} 
        />
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handleStop}
          disabled={!isPlaying}
          className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-white disabled:opacity-50 transition-colors"
        >
          <Square className="w-5 h-5" fill="currentColor" />
        </button>

        <button 
          onClick={togglePlayPause}
          className="w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-xl shadow-primary/30"
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-8 h-8" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          )}
        </button>

        {/* Placeholder for future speeds/settings */}
        <div className="w-12 h-12 flex items-center justify-center text-text-secondary">
          1x
        </div>
      </div>
    </div>
  );
}
