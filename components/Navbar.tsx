"use client";

import { useState } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">
              SkillStacks <span className="text-primary">⚡</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/roadmap"
              className="text-text-secondary hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Zap className="w-4 h-4" /> Roadmaps
            </Link>
            <button
              onClick={() => scrollToSection("hero")}
              className="text-text-secondary hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-text-secondary hover:text-white transition-colors text-sm font-medium"
            >
              Playbooks
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-text-secondary hover:text-white transition-colors text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Browse Playbooks
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 transition-transform hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-3 bg-dark/95 backdrop-blur-xl border-t border-white/5">
          <button
            onClick={() => scrollToSection("hero")}
            className="block w-full text-left text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="block w-full text-left text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
          >
            Playbooks
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="block w-full text-left text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="w-full bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Browse Playbooks
          </button>
        </div>
      </div>
    </nav>
  );
}
