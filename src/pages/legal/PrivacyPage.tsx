import LegalLayout from '../../components/layout/LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="April 1, 2026">
      <div className="flex flex-col gap-8 text-zinc-400 [&_h3]:text-white [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-2 [&_h4]:text-zinc-200 [&_h4]:font-semibold [&_h4]:text-sm [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:leading-relaxed [&_li]:mt-1">

          {/* 1. Introduction */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">1. Introduction</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Apex Technologies Inc. ("Apex," "we," "us," or "our") operates the Apex dating platform, including our mobile application and website (collectively, the "Service"). We are committed to protecting your privacy and being transparent about how we handle your personal information.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              This Privacy Policy explains what information we collect, how we use it, how we share it, your rights with respect to it, and how we protect it. This Policy applies to all users of the Service and is incorporated into our Terms of Service. By using the Service, you consent to the data practices described in this Policy. If you do not agree, please discontinue use of the Service.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">2. Information We Collect</h3>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Account Information</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  When you register for Apex, we collect your name, email address, date of birth, password (stored as a one-way hash), profile photos, biographical information ("bio"), and personal prompts. This information is necessary to create and maintain your account.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Profile Data</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  To help facilitate meaningful connections, we collect information you voluntarily provide about yourself, including: educational background (college, major, GPA, SAT/ACT scores), current and past employment (role, company), current city and region, work location, intended future relocation, relationship goals, lifestyle preferences (religion, height, drinking, smoking, cannabis use, views on children, political views), sexual orientation, and interests and values. You control what you include on your profile.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Usage Data</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We automatically collect data about how you interact with the Service, including: profiles you view, connection requests sent and received, messages sent and received, session timestamps, feature usage patterns, device information (device type, operating system, browser type), IP address, and crash logs. This data is used to improve the Service and to power our matching algorithm.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Location Data</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  With your permission, we may collect precise GPS location data to enhance matching and discovery features. You may also provide your city or region manually. You can revoke location permission at any time through your device settings.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Communications</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Messages sent between users through the Apex platform are stored on our servers in encrypted form. We may review communications when required for safety investigations, legal compliance, or abuse reporting. We do not sell message content.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Payment Information</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Premium subscription payments are processed by Stripe, Inc., a PCI-DSS compliant payment processor. Apex does not store full card numbers, CVV codes, or other sensitive payment card data. We receive and store only a tokenized reference and limited billing details (e.g., last four digits, expiration date, billing zip code) provided by Stripe.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Identity Verification</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If you choose to verify your identity, we collect a copy of your government-issued ID. This document is processed solely to confirm your identity and age. It is encrypted at rest, never shown to other users, and handled in accordance with applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">3. How We Use Your Information</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Matching and Discovery:</strong> To power our proprietary compatibility algorithm, generate curated profile recommendations, and enable the Discover, Search, and connection features.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Service Operation:</strong> To create and maintain your account, authenticate your identity, facilitate messaging, and provide customer support.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Personalization:</strong> To customize the Service to your preferences, optimize your experience, and surface content most relevant to you.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Communications:</strong> To send transactional emails (account verification, password reset, connection notifications) and, where you have opted in, marketing communications about new features, promotions, or events.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Safety and Trust:</strong> To investigate reports of abuse, enforce our Terms of Service and Community Guidelines, verify identity, detect and prevent fraud, and protect the safety of our users.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Analytics and Improvement:</strong> To analyze usage patterns, diagnose technical issues, conduct research, and improve the features, performance, and usability of the Service.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and governmental requests, and to enforce our legal rights.
              </li>
            </ul>
          </section>

          {/* 4. Information Sharing */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">4. Information Sharing</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">We share your personal information only in the circumstances described below:</p>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">With Other Apex Users</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your public profile information — including your name, photos, bio, prompts, educational background, professional details, and interests — is visible to other Apex members. You control the level of detail displayed on your profile through your privacy settings.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">With Service Providers</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We share data with trusted third-party vendors who assist us in operating the Service, subject to confidentiality obligations. These include: Railway (cloud infrastructure and hosting), Neon (database services), Cloudinary (media storage and delivery), Stripe (payment processing), and SMTP email service providers. These vendors are prohibited from using your information for their own marketing purposes.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">For Legal Reasons</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We may disclose your information if we believe in good faith that disclosure is necessary to comply with applicable law, respond to a valid legal process (subpoena, court order, or government request), enforce our Terms of Service, protect the rights, property, or safety of Apex, our users, or the public.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Business Transfers</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  In connection with any merger, acquisition, financing, reorganization, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity. We will notify you via email or in-app notice of any such change and any choices you may have.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-purple-900 mb-1">We Do Not Sell Your Data</p>
                <p className="text-sm text-purple-800 leading-relaxed">
                  Apex does not sell, rent, or trade your personal data to third parties for their marketing or advertising purposes. This commitment applies to all users, including California residents exercising rights under the California Consumer Privacy Act (CCPA).
                </p>
              </div>
            </div>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">5. Data Retention</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We retain your personal information for as long as your account is active or as needed to provide you with the Service.
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Account Deletion:</strong> After you delete your account, your profile will be removed from public view within 24 hours. We retain your data for up to 90 days after deletion for safety, fraud prevention, and to comply with legal obligations, after which it is permanently deleted.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Message Logs:</strong> Message metadata and content may be retained for up to 2 years after account deletion for fraud prevention and to respond to legal requests.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Legal Holds:</strong> We may retain information longer when required to do so by law, court order, or ongoing legal proceedings.
              </li>
            </ul>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">6. Your Rights</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2 mb-3">
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Deletion:</strong> Request deletion of your personal data, subject to certain legal exceptions.</li>
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Portability:</strong> Request a machine-readable export of your data.</li>
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Opt-Out of Marketing:</strong> Unsubscribe from marketing emails at any time via the unsubscribe link in any email or through your account settings.</li>
              <li className="text-sm text-gray-700 leading-relaxed"><strong>Restriction:</strong> Request that we restrict processing of your data in certain circumstances.</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>California Residents (CCPA):</strong> You have the right to know what personal information we collect, to delete it, to opt out of its "sale" (Apex does not sell personal data), and to non-discrimination for exercising your rights.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>EU/UK Residents (GDPR/UK GDPR):</strong> You have rights of access, rectification, erasure, restriction of processing, data portability, and the right to object to certain processing. You also have the right to lodge a complaint with your local data protection authority.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              To exercise any of these rights, please contact us at <strong>privacy@apexapp.io</strong>. We will respond to your request within 30 days.
            </p>
          </section>

          {/* 7. Security */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">7. Security</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2 mb-3">
              <li className="text-sm text-gray-700 leading-relaxed">TLS (Transport Layer Security) encryption for all data transmitted between your device and our servers</li>
              <li className="text-sm text-gray-700 leading-relaxed">AES-256 encryption for sensitive data stored at rest</li>
              <li className="text-sm text-gray-700 leading-relaxed">Authentication via JWT tokens stored in httpOnly, Secure, SameSite cookies (not localStorage), resistant to XSS attacks</li>
              <li className="text-sm text-gray-700 leading-relaxed">Rate limiting and brute-force protection on authentication endpoints</li>
              <li className="text-sm text-gray-700 leading-relaxed">Regular security audits and vulnerability assessments</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security. You use the Service at your own risk.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">8. Children's Privacy</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Service is strictly intended for users who are 18 years of age or older. Apex does not knowingly collect, solicit, or retain personal information from anyone under the age of 18. If we become aware that a user is under 18, we will immediately terminate that user's account, delete their data, and take appropriate action. If you believe a minor has created an account on Apex, please contact us immediately at legal@apexapp.io.
            </p>
          </section>

          {/* 9. Cookies & Tracking */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">9. Cookies &amp; Tracking Technologies</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Apex uses authentication cookies to maintain your session securely. Specifically, we use httpOnly cookies to store your authentication token — this design prevents JavaScript-based access to your session token and protects against common web attacks.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We do not deploy third-party advertising trackers, cross-site tracking pixels, or behavioral advertising technologies. Any analytics we use are limited to anonymized or aggregated session data for product improvement purposes.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              You can control or disable cookies through your browser settings; however, disabling authentication cookies will prevent you from logging in.
            </p>
          </section>

          {/* 10. International Transfers */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">10. International Data Transfers</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Apex is based in the United States and the Service is operated from infrastructure located in the United States. If you access the Service from outside the United States, your personal information will be transferred to and processed in the United States, where data protection laws may differ from those in your home country. By using the Service, you expressly consent to the transfer, processing, and storage of your personal information in the United States in accordance with this Privacy Policy. Where required by applicable law, we implement appropriate safeguards for such international transfers.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">11. Changes to This Policy</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email to the address associated with your account and/or via a prominent notice within the Service. We encourage you to review this Policy periodically. The "Last Updated" date at the top of this page indicates when this Policy was last revised. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated Policy.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">12. Contact Us</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              If you have questions, concerns, or requests relating to this Privacy Policy or our data practices, please reach out to us:
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-4">
              <p className="text-sm text-gray-700 font-semibold">Apex Technologies Inc.</p>
              <p className="text-sm text-gray-600 mt-1">Privacy inquiries: privacy@apexapp.io</p>
              <p className="text-sm text-gray-600 mt-0.5">Legal inquiries: legal@apexapp.io</p>
            </div>
          </section>

        <div className="mt-10 pt-6 border-t border-white/8">
          <p className="text-xs text-zinc-600 text-center">
            &copy; {new Date().getFullYear()} Apex Technologies Inc. All rights reserved.
          </p>
        </div>
      </div>
    </LegalLayout>
  )
}
