"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function LiveVisitorCount() {
  const [visitors, setVisitors] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial random visitors between 25 and 85
    let currentVisitors = Math.floor(Math.random() * 60) + 25;
    setVisitors(currentVisitors);

    // Fluctuate every 4-8 seconds
    const interval = setInterval(() => {
      // Fluctuate by -2 to +3
      const change = Math.floor(Math.random() * 6) - 2;
      currentVisitors += change;
      
      // Keep it within bounds
      if (currentVisitors < 15) currentVisitors = 15;
      if (currentVisitors > 120) currentVisitors = 120;
      
      setVisitors(currentVisitors);
    }, Math.random() * 4000 + 4000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full mb-6">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </div>
      <span className="text-sm font-medium text-red-400 flex items-center gap-1.5">
        <Users className="w-4 h-4" />
        <strong>{visitors}</strong> people are viewing this right now
      </span>
    </div>
  );
}
