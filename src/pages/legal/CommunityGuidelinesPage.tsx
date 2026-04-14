import LegalLayout from '../../components/layout/LegalLayout'

export default function CommunityGuidelinesPage() {
  return (
    <LegalLayout title="Community Guidelines" effectiveDate="April 1, 2026">
      <p className="text-sm leading-relaxed text-zinc-400 mb-6">
        Apex is built on the premise that meaningful connections start with mutual respect. These guidelines define the behavior we expect from every member of our community — not because we enjoy rules, but because the quality of your experience depends on everyone upholding them. These guidelines supplement our Terms of Service, which remain legally binding.
      </p>
      <div className="flex flex-col gap-8 text-zinc-400 [&_h3]:text-white [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-2 [&_h4]:text-zinc-200 [&_h4]:font-semibold [&_h4]:text-sm [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:leading-relaxed [&_li]:mt-1">

          {/* Be Real */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">1</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Be Real</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Authenticity is the foundation of every connection made on Apex. You agree to represent yourself honestly and accurately at all times.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No fake profiles:</strong> Use only photos of yourself. Do not use edited images that materially misrepresent your appearance, outdated photos (more than two years old), or photos that include other people as your primary photo.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No catfishing:</strong> Do not pretend to be someone you are not, whether through photos, fabricated credentials, false claims about your background, or impersonation of a real person.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No impersonation:</strong> Do not impersonate Apex staff, moderators, celebrities, public figures, or any other real or fictional person. Creating parody accounts that are not clearly labeled as such is also prohibited.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Honest credentials:</strong> If you include your college, employer, GPA, or other verifiable credentials on your profile, they must be accurate. Fabricating academic or professional credentials is a violation of these guidelines and our Terms of Service.
                </li>
              </ul>
            </div>
          </section>

          {/* Respect Everyone */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">2</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Respect Everyone</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Every person on Apex deserves to feel safe, valued, and respected. We enforce a zero-tolerance policy for disrespectful and harmful behavior.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Zero tolerance for harassment:</strong> Do not send threatening, intimidating, or persistently unwanted messages. If someone does not respond or asks you to stop, respect that. Continuing to contact someone who has declined your interest or blocked you is prohibited.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No hate speech:</strong> Content that dehumanizes, demeans, or attacks individuals or groups based on race, ethnicity, national origin, religion, gender identity, sexual orientation, disability, age, or any other protected characteristic is strictly prohibited. This includes slurs, derogatory language, and symbols associated with hate groups.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No discrimination:</strong> Do not publicly discriminate against potential matches based on protected characteristics (e.g., stating "No [racial group] or [religious group]" in your profile). Personal preferences in private are yours — publicly discriminatory statements are not permitted on this platform.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No body shaming or personal attacks:</strong> Treat every person with the dignity and courtesy you would want extended to yourself, regardless of whether you are interested in them romantically.
                </li>
              </ul>
            </div>
          </section>

          {/* Keep It Safe */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">3</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Keep It Safe</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Apex is a space for genuine connection, not exploitation. The following behaviors are strictly prohibited and may result in immediate termination and referral to law enforcement.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No soliciting money or financial assistance:</strong> Do not ask other users for money, loans, gifts, cryptocurrency, gift cards, or financial investment of any kind. Romance scams will result in permanent bans and may be reported to relevant authorities.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No commercial sexual solicitation:</strong> Advertising or soliciting escort services, prostitution, paid companionship, or any form of commercial sexual activity is strictly prohibited. Such conduct violates our Terms of Service and may constitute a criminal offense.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No non-consensual explicit content:</strong> Do not send sexually explicit images, videos, or messages to any user without their prior, explicit, and ongoing consent. Sending unsolicited explicit content ("cyberflashing") is prohibited and may violate applicable law.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No exploitation of minors:</strong> Any content that sexualizes, exploits, or endangers individuals under 18 is absolutely prohibited and will be reported to the National Center for Missing & Exploited Children (NCMEC) and law enforcement.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Meeting safely in person:</strong> If you arrange to meet someone in person, always meet in a public place first. Tell a trusted friend or family member where you are going. Trust your instincts.
                </li>
              </ul>
            </div>
          </section>

          {/* Protect Privacy */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">4</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Protect Privacy</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                What happens in a private conversation on Apex should stay there. We take privacy seriously and expect our community to do the same.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No sharing screenshots:</strong> Do not screenshot or record private conversations and share them publicly or with third parties without the explicit consent of all parties involved.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No doxxing:</strong> Do not reveal, publish, or threaten to reveal another user's personal information — including real name, address, phone number, employer, or location — without their consent. This applies whether the information was obtained through the platform or through external research.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Respect data you receive:</strong> Information shared with you by other users (photos, personal disclosures, contact details) is shared in the context of a personal connection. Do not use it for any other purpose, share it further, or retain it beyond the connection.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No harvesting data:</strong> You may not scrape, collect, or use any automated means to collect personal information from user profiles.
                </li>
              </ul>
            </div>
          </section>

          {/* Report Problems */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">5</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Report Problems</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                If you encounter behavior that violates these guidelines, please report it. Reporting helps us protect everyone in the community.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  Use the in-app report button on any profile or conversation to flag a concern. You can report a profile, a specific message, or a pattern of behavior.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  Our trust and safety team reviews all reports within 48 hours. Urgent safety concerns (threats of violence, child safety issues) are escalated immediately.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  For serious concerns, you may also contact us directly at legal@apexapp.io.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  Reports are confidential. The user you report will not be notified that you specifically reported them.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  You will not face any negative consequences for making a good-faith report. Retaliating against a user for reporting behavior is itself a violation of these guidelines.
                </li>
              </ul>
            </div>
          </section>

          {/* Consequences */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-red-600">6</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Consequences</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                We take violations of these guidelines seriously. The consequences for violations are tiered based on severity and frequency, but we reserve the right to skip steps for severe violations:
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 bg-amber-50 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-amber-700 flex-shrink-0 mt-0.5">Warning</span>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    For first-time, minor violations, you will receive a formal warning explaining the violation and the expected correction. Continued violations escalate consequences.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-orange-50 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-orange-700 flex-shrink-0 mt-0.5">Suspension</span>
                  <p className="text-sm text-orange-800 leading-relaxed">
                    Repeated or more serious violations may result in a temporary suspension of your account (ranging from 24 hours to 30 days), during which you will not be able to access the Service.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-red-50 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-red-700 flex-shrink-0 mt-0.5">Permanent Ban</span>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Severe or repeat violations will result in permanent termination of your account. Banned users may not create new accounts. Attempting to circumvent a ban is itself a violation.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-gray-900 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-white flex-shrink-0 mt-0.5">Law Enforcement</span>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    Conduct involving illegal activity — including threats of violence, sexual exploitation of minors, fraud, or stalking — will be reported to appropriate law enforcement authorities. Apex will cooperate fully with any resulting investigation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Minor Protection */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">7</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Minor Protection</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Apex is exclusively for adults 18 years of age and older. We comply fully with the Children's Online Privacy Protection Act (COPPA) and its 2025 amendments, which became effective April 22, 2026.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Age verification required:</strong> We verify your age before collecting any personal information. Users who misrepresent their age are permanently banned and may be reported to law enforcement.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Zero tolerance for minor contact:</strong> Any user found attempting to contact, solicit, or engage with a person under 18 — whether through Apex or via contact information shared on Apex — will be permanently banned and referred to law enforcement and the National Center for Missing & Exploited Children (NCMEC).
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Report suspected minors:</strong> If you believe another user may be under 18, report them immediately using the in-app report feature. Our Trust & Safety team prioritizes these reports.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No data collection on minors:</strong> Apex does not knowingly collect personal information from users under 18. If we discover such data was collected, we delete it immediately.
                </li>
              </ul>
            </div>
          </section>

          {/* Consent and Recording */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">8</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Consent and Recording</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Private conversations are private. You agree to the following recording and consent standards while using Apex.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No recording without consent:</strong> Do not record, screenshot, or otherwise capture voice, video, or written conversations with other users without their explicit verbal or written consent. Many states criminalize recording conversations without all-party consent.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No distribution of recordings:</strong> Sharing recordings of conversations — even with consent to record — requires separate consent to share. Distributing private communications to third parties, social media, or public platforms without consent is prohibited and potentially illegal.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Immediate ban for violations:</strong> Recording and distributing private conversations without consent constitutes a serious violation. This results in immediate permanent ban and potential reporting to law enforcement under applicable wiretapping and privacy statutes.
                </li>
              </ul>
            </div>
          </section>

          {/* Financial Safety */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">9</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Financial Safety and Romance Scam Prevention</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Americans lost over $1 billion to romance scams in 2024. Apex takes financial safety seriously and complies with the Romance Scam Prevention Act. If anyone you spoke with on Apex is subsequently banned for fraud, we will notify you.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Never send money:</strong> Do not send money, cryptocurrency, gift cards, wire transfers, or any financial assistance to anyone you have not met in person and independently verified. Legitimate connections do not ask for money.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Red flags to watch for:</strong> Requests to move communication off Apex quickly; claims of being overseas or in a crisis requiring money; inability or refusal to meet in person or on a live video call; stories that seem designed to create urgency or sympathy.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Fraud ban notifications:</strong> Per the Romance Scam Prevention Act, Apex notifies users when someone they communicated with is banned for fraud. This notification includes guidance on protecting yourself and relevant safety resources.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Report scams immediately:</strong> If you suspect you have been targeted by a romance scam, report the profile in-app immediately and file a report with the FTC at ReportFraud.ftc.gov. Contact your bank or financial institution if you have already transferred funds.
                </li>
              </ul>
            </div>
          </section>

          {/* Catfishing */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">10</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Catfishing and Identity Fraud</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Apex's video selfie verification and AI-powered detection systems are designed to catch identity fraud. Confirmed catfishing is treated as fraud, not a minor violation.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No stolen identity:</strong> Using photographs, video, or biographical information belonging to another real person is identity fraud. This applies to celebrities, public figures, acquaintances, and private individuals alike.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No fabricated identities:</strong> Constructing a false persona — combining elements of multiple real people, or inventing credentials, occupations, or life histories — is prohibited regardless of whether real photographs are used.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Detection technology:</strong> Apex uses reverse image search, facial analysis, and behavioral pattern detection to identify catfishing. These systems operate continuously, not just at registration.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Consequences:</strong> Confirmed catfishing results in permanent ban, possible reporting to law enforcement under applicable fraud and identity theft statutes, and — where another person's identity was used — notification to the impersonated party if identifiable.
                </li>
              </ul>
            </div>
          </section>

          {/* Deepfakes */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">11</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Deepfakes and AI-Generated Content</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The generation and distribution of AI-synthesized media — "deepfakes" — is a rapidly evolving area of law. Apex adopts a zero-tolerance position in advance of legislation, because the harms are clear regardless of current legal status.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No AI-generated profile photos:</strong> Using artificially generated images or video of any person — real or synthetic — as profile content is prohibited. Your photos must be genuine photographs of you.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No explicit deepfakes:</strong> Generating, distributing, or requesting sexually explicit deepfakes of any person — including other users, public figures, or entirely fictional individuals — is absolutely prohibited. The DEFIANCE Act (2024) makes non-consensual intimate deepfakes a federal civil cause of action. Several states have enacted criminal statutes.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Immediate permanent ban:</strong> Any confirmed use of deepfake technology to deceive, harass, or create explicit content involving any person will result in immediate permanent ban and referral to law enforcement.
                </li>
              </ul>
            </div>
          </section>

          {/* Mental Health */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">12</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Mental Health and Crisis Protocol</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Dating can be emotionally demanding, and Apex takes user wellbeing seriously. If you or someone you're connected with is in distress, please use the following resources.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Crisis resources:</strong> If someone expresses intent to harm themselves or others, do not ignore it. Text or call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line). For immediate danger, call 911.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>In-app crisis reporting:</strong> Use the in-app report button and select the "Crisis / Safety Concern" category. Apex's Trust & Safety team treats these reports as highest priority. We are trained to triage crisis situations.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No weaponizing mental health:</strong> Using someone's mental health disclosures against them — as blackmail, mockery, or manipulation — is a serious violation that results in immediate ban.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Self-care reminder:</strong> Apex is a tool for connection, not a measure of your worth. If using the app is causing distress, take a break. Your wellbeing matters more than any match.
                </li>
              </ul>
            </div>
          </section>

          {/* Harassment Expansion */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">13</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Harassment and Unsolicited Explicit Content</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Our existing harassment policy covers the basics. This section addresses specific conduct that has become prevalent on dating platforms and warrants explicit prohibition.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Unsolicited explicit images ("cyberflashing"):</strong> Sending unsolicited sexually explicit images is now a criminal offense in multiple states including California, Texas, and New York. Apex implements automated detection for explicit images. Any unsolicited explicit image sent through Apex results in immediate suspension.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Persistent contact after rejection:</strong> Continuing to contact someone after they have declined, blocked, or unmatched with you constitutes harassment. If this occurs off-platform using contact information obtained via Apex, it may constitute criminal stalking.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Coordinated harassment:</strong> Organizing or encouraging others to harass a specific user — whether through Apex or external platforms — is prohibited and will result in permanent ban for all parties involved.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Threats:</strong> Any message that a reasonable person would interpret as a threat of physical violence, sexual violence, or harm to property will be reported to law enforcement. We do not warn first. We act immediately.
                </li>
              </ul>
            </div>
          </section>

          {/* Commercial Solicitation */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">14</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Commercial Solicitation</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Apex is a personal connection platform, not a marketplace or promotional channel. Commercial use of the platform violates our Terms of Service.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No product or service promotion:</strong> Using Apex to promote, advertise, or sell any product, service, course, or subscription — including link-in-bio promotions — is prohibited.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No adult content platforms:</strong> Directing users to OnlyFans, Fansly, or similar platforms is prohibited. Soliciting or advertising escort services, paid companionship, or any commercial sexual service results in immediate ban and may be referred to law enforcement.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No MLM or financial schemes:</strong> Soliciting other users to join multi-level marketing organizations, investment schemes, or cryptocurrency ventures is prohibited.
                </li>
              </ul>
            </div>
          </section>

          {/* Political Content */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-700">15</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Political Content</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Apex respects users' political views as personal matters. At the same time, organized political activity is not permitted on the platform.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No mass political messaging:</strong> Sending unsolicited political campaign messages, fundraising requests, or voter mobilization appeals to other users is prohibited.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>No influence operations:</strong> Creating fake profiles or coordinated inauthentic behavior to advance political messaging or manipulate discourse — as defined by applicable election law — is prohibited and will be referred to the relevant authorities.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Personal political expression:</strong> Sharing your genuine political views in your profile or in conversations is permitted within the bounds of our Respect Everyone policy. The line is between authentic self-expression and organized political campaigning.
                </li>
              </ul>
            </div>
          </section>

          {/* Safe Meeting Protocol */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-emerald-700">16</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 pt-1">Safe Meeting Protocol</h3>
            </div>
            <div className="pl-11">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Meeting someone in person for the first time is an exciting step — and one that warrants basic safety precautions. We strongly encourage the following practices.
              </p>
              <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Meet in public first:</strong> Always choose a well-populated public location for your first meeting — a coffee shop, restaurant, or public park. Avoid private residences, remote locations, or places you are unfamiliar with.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Tell someone you trust:</strong> Before any first meeting, tell a friend or family member who you are meeting, where you are going, and when you expect to return. Share the person's Apex profile if possible.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Protect your address:</strong> Do not share your home address, work address, or daily routine with someone you have not yet met in person and built trust with over time.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Your own transportation:</strong> Arrange your own transportation to and from your first meeting so you maintain full control over your ability to leave.
                </li>
                <li className="text-sm text-gray-700 leading-relaxed">
                  <strong>Trust your instincts:</strong> If something feels wrong before or during a meeting, it is always acceptable to leave or cancel. Apex's goal is meaningful connection — not connection at any cost.
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">Questions?</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              If you have questions about these Community Guidelines or want to report a concern, reach out to our team:
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-4">
              <p className="text-sm text-gray-700 font-semibold">Apex Trust & Safety</p>
              <p className="text-sm text-gray-600 mt-1">legal@apexapp.io</p>
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
