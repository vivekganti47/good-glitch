import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: January 2025</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using services provided by theYaan Studio ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Services</h2>
            <p className="leading-relaxed">
              theYaan Studio develops AI-powered products and services for Healthcare, Education, and Government sectors. Our products include but are not limited to SENTRA, AXIOM, PRAXIS, theYaan Learning, GUIDE, DISHA, and SEVA. Each product may have additional terms specific to its use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <p className="leading-relaxed mb-4">When using our services, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Provide accurate and complete information when required</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use services only for lawful purposes</li>
              <li>Not interfere with or disrupt the integrity of our services</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Healthcare Product Terms</h2>
            <p className="leading-relaxed">
              Our healthcare products (SENTRA, AXIOM, PRAXIS) are designed to assist healthcare professionals and are not intended to replace professional medical judgment. Users must be qualified healthcare providers or authorized caregivers. These products comply with applicable healthcare regulations including HIPAA and India's DPDP Act.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Education Product Terms</h2>
            <p className="leading-relaxed">
              Our education products (theYaan Learning, GUIDE) are designed to supplement, not replace, traditional education. Content is aligned with CBSE curriculum and other Indian educational standards. Parents/guardians must consent to minors using our educational services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Government Product Terms</h2>
            <p className="leading-relaxed">
              Our government products (DISHA, SEVA) are developed in partnership with government departments and are subject to government procurement regulations and data handling requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, features, and functionality of our services are owned by theYaan Studio and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, theYaan Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you for our services in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our services. Continued use after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
            <p className="leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-4">
              <a href="mailto:legal@theyaan.studio" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                legal@theyaan.studio
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
