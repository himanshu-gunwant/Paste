import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Paste",
  description: "Privacy policy and Google user data disclosures for paste.himanshugunwant.com.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 18, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-enter delay-1">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Paste</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-white/10 space-y-2">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <Shield className="h-5 w-5" />
          <span className="text-xs font-mono uppercase tracking-wider">Legal & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Last updated: {lastUpdated} · Effective date: {lastUpdated}
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            1. Overview & Scope
          </h2>
          <p>
            Paste (<span className="text-foreground font-mono text-xs">paste.himanshugunwant.com</span>) is a personal, open-source code-sharing and pastebin application created and maintained by Himanshu Gunwant (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p>
            This Privacy Policy explains what information we collect when you use our service, how that information is used, how it is stored, and your rights regarding your data. We are committed to transparency, minimal data collection, and safeguarding your personal privacy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <p>We only collect the minimum information required to operate and secure Paste:</p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong className="text-foreground">Authentication & Account Information:</strong> If you choose to create an account or sign in with third-party providers (such as Google or GitHub), we collect basic profile details permitted by you, including your name, email address, profile picture URL, and third-party user ID. We use this strictly to authenticate your identity and associate your pastes with your account.
            </li>
            <li>
              <strong className="text-foreground">Paste Content & Snippet Metadata:</strong> Any code, text, title, tags, syntax selection, expiration settings, and custom visibility settings (Public, Unlisted, or Private) that you submit. For password-protected pastes, passwords are verified using Argon2id cryptographic hashing; plaintext passwords are never stored.
            </li>
            <li>
              <strong className="text-foreground">Technical & Usage Logs:</strong> For security, abuse prevention, and rate limiting, our servers log standard technical metadata such as client IP address, browser user-agent header, and request timestamps. IP addresses may be hashed and stored temporarily to enforce rate limits and prevent spam/DDoS abuse.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>We use the collected information solely for the following operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>To provide, maintain, and deliver the core code-sharing features of Paste.</li>
            <li>To authenticate users and manage active user sessions.</li>
            <li>To enforce user-selected paste visibility and expiration/destruction timers.</li>
            <li>To detect, prevent, and mitigate security threats, malicious bot activity, spam, and violations of our Terms of Service.</li>
          </ul>
        </section>

        {/* Section 4 - Crucial for Google OAuth Approval */}
        <section className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <span>4. Google OAuth &amp; Google API User Data Policy Compliance</span>
          </h2>
          <p className="font-medium text-foreground">
            Paste adheres strictly to the Google API Services User Data Policy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-foreground">Limited Use Disclosure:</strong> Paste&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </li>
            <li>
              <strong className="text-foreground">No Sale of Personal Data:</strong> We never sell, rent, lease, or trade your personal information or Google user data to any third party for any reason.
            </li>
            <li>
              <strong className="text-foreground">No Advertising or Marketing:</strong> Google user data is never used or transferred for serving advertisements, retargeting, or promotional purposes.
            </li>
            <li>
              <strong className="text-foreground">No AI Model Training:</strong> We do not use or transfer your Google user data or private pastes to train generalized artificial intelligence or machine learning models.
            </li>
            <li>
              <strong className="text-foreground">Scopes Requested:</strong> When you sign in with Google, Paste requests only standard, non-sensitive identity scopes (<code className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono text-zinc-200">openid</code>, <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono text-zinc-200">email</code>, and <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono text-zinc-200">profile</code>) solely to identify you and log you in.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            5. Data Sharing &amp; Disclosure
          </h2>
          <p>
            We do not share your private personal data with third parties except in the following limited circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>
              <strong className="text-foreground">User-Directed Public Sharing:</strong> If you explicitly mark a paste as &quot;Public&quot;, that paste content is published publicly and viewable by any visitor to the site. If you mark a paste as &quot;Unlisted&quot;, it is accessible to anyone who possesses the direct link or share token.
            </li>
            <li>
              <strong className="text-foreground">Hosting Infrastructure:</strong> We utilize trusted cloud hosting infrastructure and databases to serve the application under standard confidentiality agreements.
            </li>
            <li>
              <strong className="text-foreground">Legal Requirements:</strong> If required by valid law, legal process, or court order, we may disclose information to comply with lawful requests.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            6. Data Security &amp; Retention
          </h2>
          <p>
            We apply industry-standard security practices to protect your data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>All communication between your browser and Paste is encrypted in transit using Transport Layer Security (TLS/HTTPS).</li>
            <li>Passwords and sensitive tokens are hashed using modern, memory-hard Argon2id algorithms.</li>
            <li>Pastes configured with expiration limits or &quot;Burn after read&quot; options are purged automatically from our database upon trigger.</li>
            <li>Anonymous pastes and temporary rate-limit logs are expired periodically.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            7. Your Rights &amp; Data Deletion
          </h2>
          <p>
            You have full control over your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>You can delete any paste you have created at any time directly through the application interface.</li>
            <li>You can view and terminate active login sessions in your account settings.</li>
            <li>
              You can request permanent deletion of your account and all associated data at any time by contacting us directly at{" "}
              <a
                href="mailto:contact@himanshugunwant.com"
                className="text-foreground underline underline-offset-2 hover:text-white"
              >
                contact@himanshugunwant.com
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            8. Changes to this Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect improvements or changes in our operational or legal requirements. When updates occur, the &quot;Last updated&quot; date at the top of this page will be revised.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            9. Contact Information
          </h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or how your personal data is handled, please contact:
          </p>
          <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] space-y-1 text-xs sm:text-sm font-mono text-zinc-300">
            <div><strong className="text-foreground">Developer:</strong> Himanshu Gunwant</div>
            <div><strong className="text-foreground">Website:</strong> <a href="https://himanshugunwant.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">https://himanshugunwant.com</a></div>
            <div><strong className="text-foreground">Application:</strong> <a href="https://paste.himanshugunwant.com" className="text-emerald-400 hover:underline">https://paste.himanshugunwant.com</a></div>
            <div><strong className="text-foreground">Email:</strong> <a href="mailto:contact@himanshugunwant.com" className="text-emerald-400 hover:underline">contact@himanshugunwant.com</a></div>
          </div>
        </section>
      </div>
    </div>
  );
}
