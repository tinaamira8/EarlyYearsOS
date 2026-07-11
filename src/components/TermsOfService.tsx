import React from 'react';
import { FileText } from 'lucide-react';

export const TermsOfService: React.FC = () => (
  <div className="h-full overflow-y-auto p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last updated: 10 July 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the EarlyYearsOS platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an early childhood education and care (ECEC) service, you represent that you have authority to bind that organisation to these Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2. Description of Service</h2>
          <p>EarlyYearsOS is a cloud-based centre management platform for early childhood education services operating in Australia. The Service includes tools for documentation, compliance tracking, staff management, family communication, and curriculum planning aligned with the National Quality Framework (NQF) and the Early Years Learning Framework (EYLF) V2.0.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">3. User Accounts</h2>
          <p>You must provide accurate, complete registration information. You are responsible for safeguarding your password and all activity under your account. You must notify us immediately of any unauthorised access. Each user must have their own individual account — shared accounts are not permitted due to regulatory audit requirements.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">4. Acceptable Use</h2>
          <p>You agree to use the Service only for lawful purposes related to early childhood education management. You must not: (a) upload content that violates any law or regulation; (b) attempt to gain unauthorised access to other accounts or systems; (c) use the Service to store or transmit malicious code; (d) interfere with the Service's performance or availability.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">5. Data Ownership</h2>
          <p>You retain all rights to your data. We do not claim ownership of any content you upload, create, or store through the Service. You grant us a limited licence to host, store, and process your data solely for the purpose of operating and improving the Service. Upon termination, you may export all your data in standard formats (CSV, PDF).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">6. AI-Generated Content</h2>
          <p>The Service uses artificial intelligence to assist with documentation such as learning stories, observations, and reports. AI-generated content is provided as a draft only. You are solely responsible for reviewing, editing, and approving all AI-generated content before it becomes part of your centre's official documentation. AI suggestions do not constitute professional educational advice.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">7. Subscription and Payment</h2>
          <p>Access to the Service requires a paid subscription. Fees are billed monthly or annually as selected at signup. Prices may change with 30 days' written notice. Refunds are available within the first 14 days of a new subscription. All amounts are in Australian Dollars (AUD) and include GST where applicable.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">8. Service Availability</h2>
          <p>We target 99.9% uptime but do not guarantee uninterrupted access. Planned maintenance will be communicated at least 48 hours in advance. We are not liable for interruptions caused by factors beyond our reasonable control.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by Australian law, EarlyYearsOS shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">10. Termination</h2>
          <p>Either party may terminate the agreement with 30 days' written notice. We may suspend your account immediately for breach of these Terms. Upon termination, you will have 90 days to export your data before it is permanently deleted.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">11. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Queensland, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Queensland.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">12. Contact</h2>
          <p>For questions about these Terms, contact us at <strong>legal@earlyyearsos.com</strong>.</p>
        </section>
      </div>
    </div>
  </div>
);
