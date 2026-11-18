import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Paste",
  description: "Terms of Service and Acceptable Use Policy for paste.himanshugunwant.com.",
};

export default function TermsOfServicePage() {
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
          <FileText className="h-5 w-5" />
          <span className="text-xs font-mono uppercase tracking-wider">Legal & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Last updated: {lastUpdated} · Effective date: {lastUpdated}
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Paste (<span className="text-foreground font-mono text-xs">paste.himanshugunwant.com</span>), whether as an anonymous visitor or a registered account holder, you agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
          <p>
            If you do not agree to these terms, please do not use the application.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            Paste is a personal, open-source code-sharing, snippet management, and pastebin application developed and operated by Himanshu Gunwant (&quot;developer&quot;, &quot;we&quot;, &quot;us&quot;). The platform allows users to create, store, format, view, and share text snippets and code files under various privacy, expiration, and password settings.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            3. Account Registration &amp; Authentication
          </h2>
          <p>
            Certain features of Paste (such as managing pastes, personal collections, creating API tokens, or updating profiles) require an account. You may register using an email and password or sign in using supported third-party identity providers (such as Google or GitHub).
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breach.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            4. Acceptable Use Policy
          </h2>
          <p>
            You agree to use Paste only for lawful purposes in accordance with these Terms. You agree <strong className="text-foreground">NOT</strong> to use Paste to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>Upload, publish, or distribute malware, viruses, trojans, ransomware, or malicious exploit payloads intended to harm or compromise systems.</li>
            <li>Distribute stolen credentials, authentication tokens, compromised database dumps, or sensitive personal identifiable information (PII) without authorization (doxxing).</li>
            <li>Host phishing landing pages, scam sites, or fraudulent content.</li>
            <li>Post spam, bulk automated advertisements, unsolicited promotions, or commercial link-farming schemes.</li>
            <li>Engage in harassment, hate speech, defamation, threats of violence, or illegal material.</li>
            <li>Interfere with, disrupt, or place an unreasonable load on our infrastructure, servers, or networks (including denial-of-service attempts or bypassing rate limits).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            5. User Content &amp; Intellectual Property
          </h2>
          <p>
            <strong className="text-foreground">Ownership:</strong> You retain all intellectual property rights, copyright, and ownership in the code, text, and content you submit to Paste. We claim no ownership over your submissions.
          </p>
          <p>
            <strong className="text-foreground">License Grant:</strong> By submitting content to Paste, you grant us a worldwide, non-exclusive, royalty-free license solely to host, store, display, format, and transmit your content as necessary to operate the service in accordance with the visibility settings you choose (Public, Unlisted, or Private).
          </p>
          <p>
            <strong className="text-foreground">Responsibility:</strong> You represent and warrant that you own or have the necessary rights, licenses, or permissions to post the content you submit.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            6. Moderation &amp; Content Removal
          </h2>
          <p>
            We reserve the right (but have no obligation) to review, flag, refuse, or remove any paste or user account that violates these Terms, our Acceptable Use Policy, or applicable law, without prior notice. Abuse reports submitted by users or third parties are reviewed by our moderation system.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            7. Disclaimer of Warranties (&quot;AS IS&quot;)
          </h2>
          <p className="text-zinc-300">
            PASTE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED AVAILABILITY.
          </p>
          <p>
            As a personal project provided free of charge, we do not guarantee that the service will be error-free, secure, or available at all times. You are advised to maintain independent backups of all critical code or documentation.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p className="text-zinc-300">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE DEVELOPER (HIMANSHU GUNWANT) BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE PASTE.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            9. Changes to Terms
          </h2>
          <p>
            We may revise these Terms of Service periodically. Changes take effect upon posting to this page. Continued use of Paste after changes become effective constitutes your acceptance of the revised Terms.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            10. Contact Information
          </h2>
          <p>
            If you have questions, inquiries, or notices regarding these Terms of Service, please contact:
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
