"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export default function StreakCounter() {
  const [streak, setStreak] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const STORAGE_KEY_STREAK = "skillstacks_streak_count";
    const STORAGE_KEY_LAST_VISIT = "skillstacks_last_visit_date";

    const getTodayStr = () => new Date().toDateString();
    
    // helper to get the date string for "yesterday"
    const getYesterdayStr = () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toDateString();
    };

    const todayStr = getTodayStr();
    const yesterdayStr = getYesterdayStr();
    
    const lastVisitStr = localStorage.getItem(STORAGE_KEY_LAST_VISIT);
    let currentStreak = parseInt(localStorage.getItem(STORAGE_KEY_STREAK) || "0");

    if (!lastVisitStr) {
      // First ever visit
      currentStreak = 1;
    } else {
      if (lastVisitStr === todayStr) {
        // Already visited today, do nothing to the streak
      } else if (lastVisitStr === yesterdayStr) {
        // Visited yesterday, increment!
        currentStreak += 1;
      } else {
        // Missed a day or more, reset streak
        currentStreak = 1;
      }
    }

    // Save state
    localStorage.setItem(STORAGE_KEY_LAST_VISIT, todayStr);
    localStorage.setItem(STORAGE_KEY_STREAK, currentStreak.toString());
    setStreak(currentStreak);

  }, []);

  if (!mounted || streak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 bg-surface border border-white/10 px-3 py-1.5 rounded-full" title={\`\${streak} day streak!\`}>
      <Flame className={\`w-4 h-4 \${streak > 2 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-orange-400'}\`} />
      <span className="text-sm font-bold text-white">{streak}</span>
    </div>
  );
}
