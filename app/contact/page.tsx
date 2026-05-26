import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — SkillStacks",
  description: "Get in touch with the SkillStacks team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">
          Contact Us
        </h1>
        <div className="bg-surface rounded-2xl border border-white/5 p-8 sm:p-12">
          <p className="text-text-secondary leading-relaxed mb-8">
            Have questions about our playbooks or need support with your purchase? We&apos;re here to help. Reach out to us using the information below.
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Email Support</h2>
              <p className="text-text-secondary">support@skillstacks.com</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Response Time</h2>
              <p className="text-text-secondary">We aim to respond to all inquiries within 24 hours during business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
