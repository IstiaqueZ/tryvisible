import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const Integrations = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">Integrations</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Visible connects with the tools you already use to streamline your AEO workflow.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { name: "Google Search Console", desc: "Compare traditional SEO data with your AI visibility metrics side by side." },
            { name: "Slack", desc: "Get real-time notifications when your AI visibility changes or competitors overtake you." },
            { name: "Zapier", desc: "Connect Visible to 5,000+ apps and automate your AEO workflows." },
            { name: "API Access", desc: "Build custom integrations with our RESTful API. Available on Agency plans." },
          ].map((item) => (
            <div key={item.name} className="border-2 border-secondary p-6">
              <h3 className="font-display text-lg font-bold text-secondary">{item.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default Integrations;
