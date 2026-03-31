import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Building2, Megaphone, Rocket } from "lucide-react";

const useCases = [
  {
    icon: Building2,
    title: "For Local Businesses",
    description: "Dominate local AI searches and capture high-intent customers before your competitors do.",
    details: [
      "Track how AI recommends local services in your area",
      "Monitor competitor citations across ChatGPT, Gemini, and Perplexity",
      "Get actionable steps to improve your AI visibility",
      "Capture customers who ask AI 'best [service] near me'",
    ],
  },
  {
    icon: Megaphone,
    title: "For Marketing Agencies",
    description: "Offer AEO as a premium service and differentiate your agency with cutting-edge AI visibility reports.",
    details: [
      "White-label PDF reporting for client presentations",
      "Manage multiple client projects from one dashboard",
      "Automated weekly monitoring with anomaly alerts",
      "API access for custom integrations and workflows",
    ],
  },
  {
    icon: Rocket,
    title: "For SaaS & Startups",
    description: "Ensure your product is the one AI recommends when users ask for solutions in your category.",
    details: [
      "Track your Share of Model against competitors",
      "Reverse-engineer why competitors get cited over you",
      "Build authority in AI training data sources",
      "Monitor brand sentiment across AI platforms",
    ],
  },
];

const UseCases = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">
          Use Cases
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          See how businesses like yours use Visible to dominate AI search results.
        </p>
        <div className="mt-12 space-y-8">
          {useCases.map((uc) => (
            <div key={uc.title} className="border-2 border-secondary p-8">
              <div className="flex items-center gap-3 mb-4">
                <uc.icon className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-secondary">{uc.title}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{uc.description}</p>
              <ul className="space-y-2">
                {uc.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default UseCases;
