import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => (
  <div className="h-full overflow-y-auto p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: 10 July 2026 · Compliant with the Australian Privacy Act 1988</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">1. About This Policy</h2>
          <p>EarlyYearsOS Pty Ltd ("we", "us", "our") is committed to protecting the privacy of children, families, educators, and centre operators who use our platform. This policy explains how we collect, use, store, and disclose personal information in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2. Information We Collect</h2>
          <p className="mb-2">We collect the following categories of personal information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Centre operators and staff:</strong> Name, email, phone, role, qualifications, Working With Children Check (WWCC) numbers, professional development records.</li>
            <li><strong>Children:</strong> Name, date of birth, enrolment details, medical conditions, allergies, immunisation records, learning observations, developmental assessments, photographs (when uploaded by educators).</li>
            <li><strong>Families:</strong> Parent/guardian names, contact details, emergency contacts, custody arrangements, Child Care Subsidy (CCS) reference numbers.</li>
            <li><strong>Usage data:</strong> Login times, feature usage, device information (collected automatically for service improvement).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">3. Sensitive Information</h2>
          <p>We recognise that information about children's health (medical conditions, allergies, medication records), cultural background, disability status, and family circumstances constitutes <strong>sensitive information</strong> under the Privacy Act. We only collect sensitive information when it is directly necessary for the safety and wellbeing of children in care, and with explicit consent from parents/guardians.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">4. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate the centre management platform and provide the Service</li>
            <li>To support educators in documenting children's learning (observations, learning stories, portfolios)</li>
            <li>To manage compliance with the National Quality Framework (NQF) and Education and Care Services National Regulations</li>
            <li>To communicate with families about their child's care and development</li>
            <li>To generate AI-assisted documentation drafts (processed ephemerally — not stored by our AI provider)</li>
            <li>To process payments and manage subscriptions</li>
            <li>To improve the Service through anonymised, aggregated analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">5. AI Processing</h2>
          <p>When you use AI features (e.g., learning story generation, observation enhancement), the text you provide is sent to a third-party AI service (Google Gemini) for processing. This data is processed in real-time and is <strong>not stored</strong> by the AI provider after the response is generated. We do not send children's full names, medical details, or photographs to AI services. AI-generated content must be reviewed and approved by a qualified educator before being added to official records.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">6. Data Storage and Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Data is stored on secure Australian-region servers (Supabase, hosted on AWS ap-southeast-2)</li>
            <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Access is controlled through role-based permissions (Admin, Director, Educator)</li>
            <li>We maintain audit logs of data access and modifications</li>
            <li>Regular security assessments and penetration testing are conducted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">7. Disclosure of Information</h2>
          <p className="mb-2">We will only disclose personal information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>To authorised staff within the same centre (based on their role permissions)</li>
            <li>To parents/guardians regarding their own child's information</li>
            <li>To regulatory authorities (ACECQA, state regulatory bodies) when legally required</li>
            <li>To our service providers who assist in operating the platform (under strict contractual obligations)</li>
            <li>When required by law, including mandatory reporting obligations under child protection legislation</li>
          </ul>
          <p className="mt-2">We <strong>never</strong> sell personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">8. Children's Privacy</h2>
          <p>We take additional precautions with children's information. Photographs of children are only accessible to the child's enrolled centre and authorised family members. Children's data is never used for marketing purposes. Parents/guardians may request deletion of their child's photographs and observations at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">9. Your Rights</h2>
          <p className="mb-2">Under the Australian Privacy Principles, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Access</strong> your personal information held by us</li>
            <li><strong>Correct</strong> any inaccurate or outdated information</li>
            <li><strong>Request deletion</strong> of your personal information (subject to regulatory retention requirements)</li>
            <li><strong>Export</strong> your data in standard formats (CSV, PDF)</li>
            <li><strong>Withdraw consent</strong> for collection of sensitive information</li>
            <li><strong>Complain</strong> if you believe your privacy has been breached</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">10. Data Retention</h2>
          <p>We retain children's records for a minimum of 3 years after the child's last attendance, as required by the Education and Care Services National Regulations (Reg 183). Staff qualification and training records are retained for 3 years after employment ends. Financial records are retained for 7 years as required by the Australian Taxation Office. After these periods, data is securely deleted.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">11. Data Breach Response</h2>
          <p>In the event of an eligible data breach (as defined under the Notifiable Data Breaches scheme), we will notify affected individuals and the Office of the Australian Information Commissioner (OAIC) as soon as practicable, and no later than 30 days after becoming aware of the breach.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-3">12. Contact and Complaints</h2>
          <p>For privacy enquiries or to exercise your rights, contact our Privacy Officer at <strong>privacy@earlyyearsos.com</strong>.</p>
          <p className="mt-2">If you are unsatisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <strong>www.oaic.gov.au</strong>.</p>
        </section>
      </div>
    </div>
  </div>
);
