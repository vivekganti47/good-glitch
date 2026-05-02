import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold text-white">
                the<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Yaan</span>
              </span>
            </Link>
            <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              theYaan Studio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our products and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">We may collect information about you in a variety of ways:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Personal Data:</strong> Name, email address, phone number, and other contact information you provide voluntarily.</li>
              <li><strong className="text-slate-300">Usage Data:</strong> Information about how you access and use our services, including device information, browser type, and IP address.</li>
              <li><strong className="text-slate-300">Health Data:</strong> For healthcare products like SENTRA and AXIOM, we may collect health-related data with explicit consent and in compliance with applicable regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Provide, operate, and maintain our services</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Communicate with you about updates, support, and promotional materials</li>
              <li>Process transactions and send related information</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Protection</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. For healthcare products, we comply with HIPAA (for US operations) and DPDP Act (for India operations) requirements, utilizing edge computing and privacy-first architecture to minimize data exposure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
            <p className="leading-relaxed">
              We do not sell your personal information. We may share data with trusted service providers who assist in operating our services, subject to confidentiality agreements. We may also disclose information when required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p className="leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-4">
              <a href="mailto:privacy@theyaan.studio" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                privacy@theyaan.studio
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} theYaan Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
