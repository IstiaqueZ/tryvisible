import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

const RequestDemo = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-2xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">Request a Demo</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          See how Visible can help your business dominate AI search results. Fill out the form and our team will reach out within 24 hours.
        </p>
        <form className="mt-12 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary">Full Name</label>
              <Input placeholder="Jane Smith" className="h-12 border-2 border-secondary/20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary">Work Email</label>
              <Input placeholder="jane@company.com" className="h-12 border-2 border-secondary/20" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary">Company Website</label>
            <Input placeholder="company.com" className="h-12 border-2 border-secondary/20" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary">Message (optional)</label>
            <Textarea placeholder="Tell us about your AEO goals..." className="min-h-[120px] border-2 border-secondary/20" />
          </div>
          <Button className="h-12 w-full border-2 border-primary bg-primary font-bold text-secondary hover:bg-primary/90">
            Request Demo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default RequestDemo;
