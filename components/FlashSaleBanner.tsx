"use client";

import { useState, useEffect } from "react";
import { Timer, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = "skillstacks_flashsale_endtime";
    
    // Check if user dismissed banner
    const isDismissed = localStorage.getItem("skillstacks_flashsale_dismissed");
    if (isDismissed) return;

    let endTime = localStorage.getItem(STORAGE_KEY);
    
    if (!endTime) {
      // 24 hours from right now
      const newEndTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = parseInt(endTime!) - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsVisible(true);
      } else {
        // Timer expired
        setTimeLeft(null);
        setIsVisible(false);
        // Optionally reset for continuous urgency
        // localStorage.removeItem(STORAGE_KEY);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem("skillstacks_flashsale_dismissed", "true");
  };

  if (!isVisible || !timeLeft) return null;

  return (
    <div className="bg-primary text-white py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-medium">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">🔥</span>
          <span>Flash Sale Ends In:</span>
        </div>
        
        <div className="flex items-center gap-2 font-mono font-bold bg-black/20 px-3 py-1 rounded-lg">
          <Timer className="w-4 h-4" />
          <span>{String(timeLeft.hours).padStart(2, "0")}:</span>
          <span>{String(timeLeft.minutes).padStart(2, "0")}:</span>
          <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline">Use code <span className="font-bold bg-white text-primary px-2 py-0.5 rounded uppercase">ACTION50</span> at checkout!</span>
          <Link href="/" className="flex items-center gap-1 font-bold underline decoration-2 underline-offset-4 hover:text-white/80 transition-colors">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button 
          onClick={dismissBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors hidden sm:block"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
