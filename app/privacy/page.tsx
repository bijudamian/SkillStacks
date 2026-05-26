import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SkillStacks",
  description: "Privacy Policy for SkillStacks.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you purchase an Action Playbook, we collect necessary information to process your transaction and deliver the product. This includes your email address and payment information, which is securely processed by Stripe.
          </p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information solely to deliver the digital products you have purchased, provide customer support, and communicate important updates regarding your purchase.
          </p>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. We do not store your full credit card details on our servers; they are securely handled by our payment processor.
          </p>
        </div>
      </div>
    </div>
  );
}
