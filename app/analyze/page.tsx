import type { Metadata } from "next";
import ResumeScanner from "./ResumeScanner";

export const metadata: Metadata = {
  title: "AI Career Scanner — SkillStacks",
  description: "Upload your resume or bio and let AI find your perfect playbook match.",
};

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm animate-pulse">
            Gemini 1.5 Pro Powered
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Career Profile <span className="text-primary">Scanner</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto">
            Paste your resume, LinkedIn bio, or current skills below. Our AI will analyze your profile and identify the single playbook with the highest ROI for your career right now.
          </p>
        </header>

        <ResumeScanner />
      </div>
    </div>
  );
}
