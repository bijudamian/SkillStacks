import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-black text-white tracking-tight">
                SkillStacks <span className="text-primary">⚡</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Premium action playbooks that transform knowledge into results.
              Stop watching tutorials — start doing.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#products"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  All Playbooks
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Why SkillStacks?
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-text-secondary text-sm text-center">
            © 2024 SkillStacks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
