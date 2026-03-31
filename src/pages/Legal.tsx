import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const legalPages: Record<string, { title: string; content: string[] }> = {
  terms: {
    title: "Terms of Service",
    content: [
      "Welcome to Visible. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.",
      "Visible provides AI visibility monitoring and analytics tools on a subscription basis. Your use of the platform is subject to the plan you subscribe to, including any usage limits on keyword searches, deep audits, and monitoring features.",
      "You are responsible for maintaining the confidentiality of your account credentials. You agree not to share, transfer, or sublicense your account access without prior written consent.",
      "Visible reserves the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable notice of material changes to these terms.",
      "Our platform is provided 'as is' without warranties of any kind, express or implied. Visible shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.",
      "These terms are governed by the laws of the jurisdiction in which Visible operates. Any disputes shall be resolved through binding arbitration.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    content: [
      "Visible is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.",
      "We collect information you provide directly, such as your name, email address, and website domain. We also collect usage data including search queries, audit requests, and platform interactions to improve our services.",
      "We use your data to deliver and improve our services, process payments, send service-related communications, and provide customer support. We do not sell your personal data to third parties.",
      "We implement industry-standard security measures to protect your data, including encryption in transit and at rest, access controls, and regular security audits.",
      "You have the right to access, correct, or delete your personal data at any time. You may also request a copy of your data or opt out of non-essential communications.",
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our platform.",
    ],
  },
  dpa: {
    title: "Data Processing Agreement",
    content: [
      "This Data Processing Agreement (DPA) supplements our Terms of Service and applies to all processing of personal data by Visible on behalf of our customers.",
      "Visible processes personal data solely for the purpose of providing our AI visibility monitoring and analytics services as described in your subscription agreement.",
      "We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, access controls, and regular testing.",
      "Visible will not engage sub-processors without prior written consent. A current list of sub-processors is available upon request.",
      "In the event of a personal data breach, Visible will notify affected customers without undue delay and provide all information necessary to comply with applicable data protection laws.",
      "Upon termination of services, Visible will delete or return all personal data within 30 days, unless retention is required by applicable law.",
    ],
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    content: [
      "This Acceptable Use Policy outlines the permitted and prohibited uses of the Visible platform to ensure a safe and fair experience for all users.",
      "You may not use Visible to conduct any illegal activities, including but not limited to unauthorized data collection, hacking, or violating intellectual property rights.",
      "Automated scraping, excessive API calls beyond your plan limits, or any activity that degrades service performance for other users is strictly prohibited.",
      "You may not use the platform to harass, defame, or harm any individual or organization. Content that promotes hate speech, violence, or discrimination is not permitted.",
      "Visible reserves the right to suspend or terminate accounts that violate this policy without notice. Repeated violations may result in permanent account closure.",
      "If you believe a user is violating this policy, please report it to support@tryvisible.com and we will investigate promptly.",
    ],
  },
};

const LegalPage = ({ slug }: { slug: string }) => {
  const page = legalPages[slug];
  if (!page) return null;

  return (
    <div className="min-h-screen bg-background text-secondary">
      <LandingNavbar />
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">{page.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: March 31, 2026</p>
          <div className="mt-10 space-y-6">
            {page.content.map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export const Terms = () => <LegalPage slug="terms" />;
export const Privacy = () => <LegalPage slug="privacy" />;
export const DPA = () => <LegalPage slug="dpa" />;
export const AcceptableUse = () => <LegalPage slug="acceptable-use" />;
