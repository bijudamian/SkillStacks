import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SkillStacks",
  description: "Terms of Service for SkillStacks.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">
          Terms of Service
        </h1>
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and purchasing from SkillStacks, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Digital Products</h2>
          <p>
            Our products are digital downloads (PDFs). Due to the nature of digital goods, all sales are final once the product has been downloaded, unless otherwise stated.
          </p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            All playbooks, content, and materials provided by SkillStacks are protected by copyright. You may not resell, distribute, or share our products without explicit permission.
          </p>
        </div>
      </div>
    </div>
  );
}
