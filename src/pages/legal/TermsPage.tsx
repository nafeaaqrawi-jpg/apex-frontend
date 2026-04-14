import LegalLayout from '../../components/layout/LegalLayout'

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" effectiveDate="April 1, 2026">
      <div className="flex flex-col gap-8 text-zinc-400 [&_h3]:text-white [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-2 [&_h4]:text-zinc-200 [&_h4]:font-semibold [&_h4]:text-sm [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:leading-relaxed [&_li]:mt-1">

          {/* 1. Acceptance of Terms */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              By accessing or using the Apex platform, mobile application, website, or any related services (collectively, the "Service"), you agree to be legally bound by these Terms of Service ("Terms"), our Privacy Policy, and our Community Guidelines, all of which are incorporated herein by reference. These Terms constitute a binding legal agreement between you and Apex Technologies Inc. ("Apex," "we," "us," or "our").
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              IF YOU DO NOT AGREE TO THESE TERMS IN THEIR ENTIRETY, YOU ARE NOT AUTHORIZED TO ACCESS OR USE THE SERVICE AND MUST IMMEDIATELY CEASE ALL USE.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your continued use of the Service following any modification to these Terms constitutes your acceptance of such modifications. If you have any questions about these Terms, please contact us at legal@apexapp.io before using the Service.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">2. Eligibility</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              To use the Service, you must satisfy all of the following eligibility requirements:
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2 mb-3">
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Age:</strong> You must be at least 18 years of age. By creating an account, you represent and warrant that you are 18 or older. Apex reserves the right to request proof of age at any time and to terminate accounts of users found to be under 18 without notice.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Legal Capacity:</strong> You must have the legal capacity to enter into a binding contract under the laws of your jurisdiction. If you are entering into these Terms on behalf of a business or organization, you represent that you have the authority to bind that entity.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Criminal Background:</strong> You must not be a registered sex offender in any jurisdiction. Apex reserves the right to conduct background checks or require identity verification at any time and to terminate access for users who fail such checks.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Not Prohibited:</strong> Your use of the Service must not be prohibited by applicable law, and you must not have been previously banned from the Service by Apex.
              </li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed">
              Apex reserves the right to verify your identity and eligibility at any time using third-party verification services. Failure to cooperate with verification requests may result in account suspension or termination.
            </p>
          </section>

          {/* 3. Account Responsibilities */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">3. Account Responsibilities</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              When you create an account on Apex, you accept the following responsibilities:
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2 mb-3">
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Accuracy:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. Providing false information, including misrepresenting your identity, age, or educational background, is a material breach of these Terms.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account, whether or not you authorized such activity. You must notify Apex immediately at legal@apexapp.io upon becoming aware of any unauthorized use of your account.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>One Account Per Person:</strong> You may maintain only one active account. Creating multiple accounts is prohibited and may result in termination of all associated accounts. Accounts are non-transferable.
              </li>
              <li className="text-sm text-gray-700 leading-relaxed">
                <strong>Account Ownership:</strong> Your account is for personal, non-commercial use only. You may not sell, transfer, or license your account to any third party.
              </li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed">
              Apex will not be liable for any loss or damage arising from your failure to maintain account security or from your failure to comply with these responsibilities.
            </p>
          </section>

          {/* 4. Prohibited Conduct */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">4. Prohibited Conduct</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              You agree that you will NOT use the Service to engage in any of the following conduct. Violation of these prohibitions may result in immediate account termination, reporting to law enforcement, and/or civil or criminal liability:
            </p>
            <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
              <li className="text-sm text-gray-700 leading-relaxed">Harass, bully, intimidate, stalk, threaten, or abuse any user or third party</li>
              <li className="text-sm text-gray-700 leading-relaxed">Impersonate any person or entity, including Apex employees, or falsely represent your affiliation with any organization</li>
              <li className="text-sm text-gray-700 leading-relaxed">Create fake, fraudulent, or misleading profiles; use photos that are not your own; misrepresent your identity, age, location, or professional credentials</li>
              <li className="text-sm text-gray-700 leading-relaxed">Send unsolicited explicit, sexual, or graphic content to other users without prior consent</li>
              <li className="text-sm text-gray-700 leading-relaxed">Solicit money, financial assistance, investment, or gifts from other users</li>
              <li className="text-sm text-gray-700 leading-relaxed">Engage in spam, including sending repetitive, unsolicited messages to multiple users</li>
              <li className="text-sm text-gray-700 leading-relaxed">Advertise, promote, or solicit commercial services, escort services, prostitution, or any form of sex work</li>
              <li className="text-sm text-gray-700 leading-relaxed">Collect or harvest personal data of other users, including email addresses, phone numbers, or location information</li>
              <li className="text-sm text-gray-700 leading-relaxed">Use automated scripts, bots, scrapers, crawlers, or any other automated means to access, query, or interact with the Service</li>
              <li className="text-sm text-gray-700 leading-relaxed">Attempt to reverse-engineer, decompile, disassemble, or derive the source code of any part of the Service</li>
              <li className="text-sm text-gray-700 leading-relaxed">Circumvent, disable, or otherwise interfere with any security or safety features of the Service</li>
              <li className="text-sm text-gray-700 leading-relaxed">Post content that constitutes hate speech or discriminates against individuals based on race, ethnicity, national origin, religion, gender, sexual orientation, disability, or any other protected characteristic</li>
              <li className="text-sm text-gray-700 leading-relaxed">Use the Service for any commercial purpose without the prior written consent of Apex</li>
              <li className="text-sm text-gray-700 leading-relaxed">Violate any applicable local, state, national, or international law or regulation</li>
            </ul>
          </section>

          {/* 5. Content You Post */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">5. Content You Post</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>Ownership:</strong> You retain ownership of all content you submit, post, or transmit through the Service ("User Content"), including photos, text, prompts, and other materials. By posting User Content, you grant Apex a worldwide, non-exclusive, royalty-free, sublicensable, perpetual, and irrevocable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such User Content in connection with operating and improving the Service.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>Your Representations:</strong> By posting User Content, you represent and warrant that: (i) you own or have the necessary rights and licenses to post such content; (ii) the content does not infringe, misappropriate, or violate any third-party intellectual property rights, privacy rights, or any other rights; (iii) the content is accurate and not misleading; and (iv) the content does not violate these Terms or any applicable law.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>Content Moderation:</strong> Apex reserves the right, but not the obligation, to review, monitor, remove, or modify any User Content at our sole discretion, without notice, and for any reason, including if we determine that such content violates these Terms, our Community Guidelines, or applicable law.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>No Compensation:</strong> Apex does not pay you for User Content. You acknowledge that you will receive no compensation for any User Content you post.
            </p>
          </section>

          {/* 6. Privacy */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">6. Privacy</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy, available at apexapp.io/privacy, explains how we collect, use, store, share, and protect your personal information. By using the Service, you consent to our collection and use of your personal information as described in the Privacy Policy, which is incorporated into these Terms by reference. You acknowledge that by providing personal information, you consent to the transfer and processing of that information in the United States and potentially other countries, as further described in the Privacy Policy.
            </p>
          </section>

          {/* 7. Intellectual Property */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">7. Intellectual Property</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              All right, title, and interest in and to the Service, including the Apex name, logo, trademarks, design elements, source code, algorithms, user interface, and all other intellectual property, are and will remain the exclusive property of Apex Technologies Inc. and its licensors. These rights are protected by United States and international intellectual property laws.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              No license or right to use any Apex intellectual property is granted to you except as expressly stated in these Terms. You agree not to use, reproduce, distribute, modify, create derivative works from, or reverse-engineer any part of the Service or Apex's intellectual property without the prior written permission of Apex.
            </p>
          </section>

          {/* 8. Disclaimers */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">8. Disclaimers</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 uppercase font-medium">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, APEX DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 uppercase font-medium">
              APEX DOES NOT CONDUCT COMPREHENSIVE CRIMINAL BACKGROUND CHECKS ON ALL USERS. WHILE WE TAKE SAFETY SERIOUSLY, APEX CANNOT GUARANTEE THE ACCURACY OF INFORMATION THAT USERS PROVIDE ABOUT THEMSELVES. YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS, BOTH ONLINE AND OFFLINE.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed font-semibold">
              IMPORTANT SAFETY NOTICE: WHEN MEETING SOMEONE FROM APEX IN PERSON FOR THE FIRST TIME, ALWAYS MEET IN A PUBLIC PLACE. TELL A FRIEND OR FAMILY MEMBER WHERE YOU ARE GOING AND WHO YOU ARE MEETING. TRUST YOUR INSTINCTS — IF SOMETHING FEELS WRONG, LEAVE IMMEDIATELY.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">9. Limitation of Liability</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 uppercase font-medium">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL APEX TECHNOLOGIES INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, USE, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed uppercase font-medium">
              OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) ONE HUNDRED DOLLARS ($100) OR (B) THE TOTAL AMOUNTS PAID BY YOU TO APEX IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE OF THE CLAIM.
            </p>
          </section>

          {/* 10. Indemnification */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">10. Indemnification</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Apex Technologies Inc. and its officers, directors, employees, contractors, agents, licensors, successors, and assigns from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to: (i) your access to or use of the Service; (ii) your User Content; (iii) your violation of these Terms; (iv) your violation of any third-party right, including any intellectual property, privacy, or property right; or (v) any claim that your User Content caused damage to a third party. This indemnification obligation survives the termination of these Terms and your use of the Service.
            </p>
          </section>

          {/* 11. Dispute Resolution & Arbitration */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">11. Dispute Resolution & Arbitration</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 uppercase font-medium">
              PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>Binding Arbitration:</strong> Except for disputes that qualify for small claims court, all disputes, claims, or controversies arising out of or relating to these Terms or the Service (collectively, "Disputes") shall be resolved exclusively through final and binding arbitration, rather than in court. By agreeing to arbitration, you and Apex are each waiving the right to a trial by jury.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 uppercase font-medium">
              CLASS ACTION WAIVER: YOU AND APEX AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. ALL ARBITRATIONS SHALL PROCEED ON AN INDIVIDUAL BASIS ONLY.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Arbitration Rules:</strong> Arbitration shall be administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules, as amended by these Terms. The seat of arbitration shall be the State of Delaware. The arbitration shall be conducted in English. The arbitrator's decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">12. Governing Law</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. To the extent any dispute is not subject to arbitration under Section 11, you consent to the exclusive personal jurisdiction and venue of the state and federal courts located in the State of Delaware for the resolution of such disputes.
            </p>
          </section>

          {/* 13. Termination */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">13. Termination</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Apex reserves the right, at its sole discretion, to suspend, restrict, or permanently terminate your access to the Service at any time, for any reason or no reason, with or without notice, including but not limited to violation of these Terms, harmful or illegal conduct, or prolonged inactivity.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              You may delete your account at any time through the app settings or by contacting legal@apexapp.io. Upon account deletion, your profile will be removed from public view. Certain data may be retained for up to 90 days for safety, fraud prevention, and legal compliance purposes as described in our Privacy Policy.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Upon any termination of these Terms, all licenses granted to you hereunder terminate immediately, and you must cease all use of the Service. Sections 5, 7, 8, 9, 10, 11, and 12 shall survive termination.
            </p>
          </section>

          {/* 14. Modifications */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">14. Modifications to Terms</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Apex reserves the right to modify, amend, or replace these Terms at any time. When we make material changes, we will notify you by posting the updated Terms on the Service and updating the "Last Updated" date at the top of this page. We may also notify you via email or an in-app notification. Your continued use of the Service after any such modifications constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service immediately.
            </p>
          </section>

          {/* 15. Contact */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">15. Contact Information</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-4">
              <p className="text-sm text-gray-700 font-semibold">Apex Technologies Inc.</p>
              <p className="text-sm text-gray-600 mt-1">Legal inquiries: legal@apexapp.io</p>
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
