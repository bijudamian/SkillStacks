import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceAssistant from "@/components/VoiceAssistant";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillStacks — Premium Action Playbooks",
  description:
    "Stop watching tutorials. Start executing. Premium action playbooks that transform knowledge into results — investing, fitness, YouTube automation, and more.",
  keywords: [
    "action playbooks",
    "digital products",
    "investing guide",
    "fitness blueprint",
    "youtube automation",
    "skillstacks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-dark text-white antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <VoiceAssistant />
      </body>
    </html>
  );
}
