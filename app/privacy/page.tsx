"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cursor-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cursor-bg/80 backdrop-blur-md border-b border-cursor-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-cursor-white">Headless Markets</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                BETA
              </span>
            </Link>
            <Link href="/" className="nav-link text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-cursor-white mb-2">Privacy Policy</h1>
          <p className="text-cursor-muted text-sm mb-8">Last updated: February 3, 2026</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">1. Introduction</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                CLOON LLC ("Company", "we", "us", or "our") operates the Headless Markets Protocol and website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-cursor-white mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2 mb-4">
                <li><strong className="text-cursor-white">Email Address:</strong> When you join our waitlist or request deck access</li>
                <li><strong className="text-cursor-white">Name:</strong> When you request deck access</li>
                <li><strong className="text-cursor-white">Company Name:</strong> Optionally, when you request deck access</li>
                <li><strong className="text-cursor-white">Participation Size Preference:</strong> When you request deck access</li>
              </ul>

              <h3 className="text-lg font-medium text-cursor-white mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2">
                <li><strong className="text-cursor-white">Device Information:</strong> Browser type, operating system, device type</li>
                <li><strong className="text-cursor-white">Usage Data:</strong> Pages visited, time spent, click patterns</li>
                <li><strong className="text-cursor-white">IP Address:</strong> For security and analytics purposes</li>
                <li><strong className="text-cursor-white">Cookies:</strong> As described in our Cookie Policy below</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">3. How We Use Your Information</h2>
              <p className="text-cursor-text-secondary leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2">
                <li>Send you notifications about AO market launches</li>
                <li>Provide access to the pitch deck and related materials</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and optimize user experience</li>
                <li>Communicate with you about updates and changes</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-cursor-text-secondary leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2 mb-4">
                <li><strong className="text-cursor-white">Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong className="text-cursor-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong className="text-cursor-white">Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-cursor-text-secondary leading-relaxed">
                You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-cursor-text-secondary leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2">
                <li><strong className="text-cursor-white">Service Providers:</strong> Third parties that help us operate our services (e.g., email providers, analytics services)</li>
                <li><strong className="text-cursor-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong className="text-cursor-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">6. Data Security</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">7. Data Retention</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required by law. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">8. Your Rights</h2>
              <p className="text-cursor-text-secondary leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-cursor-text-secondary space-y-2">
                <li><strong className="text-cursor-white">Access:</strong> Request a copy of your personal information</li>
                <li><strong className="text-cursor-white">Correction:</strong> Request correction of inaccurate information</li>
                <li><strong className="text-cursor-white">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-cursor-white">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-cursor-white">Portability:</strong> Request a portable copy of your data</li>
              </ul>
              <p className="text-cursor-text-secondary leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@cloon.fun.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">9. International Transfers</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">10. Children's Privacy</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">11. Changes to This Policy</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cursor-white mb-4">12. Contact Us</h2>
              <p className="text-cursor-text-secondary leading-relaxed">
                For questions about this Privacy Policy, please contact:<br />
                CLOON LLC<br />
                Email: privacy@cloon.fun
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cursor-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-cursor-muted text-[10px]">
            © {new Date().getFullYear()} CLOON LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
