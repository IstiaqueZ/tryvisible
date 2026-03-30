import { Check, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Starter",
    tier: "tier_1",
    price: 29,
    features: [
      "50 Keyword Searches / month",
      "10 Deep Audits / month",
      "3 Projects",
      "AI Monitor (burns credits)",
      "To-Do List",
    ],
  },
  {
    name: "Growth",
    tier: "tier_2",
    price: 99,
    popular: true,
    features: [
      "250 Keyword Searches / month",
      "50 Deep Audits / month",
      "10 Projects",
      "AI Monitor (burns credits)",
      "To-Do List",
      "Priority Support",
    ],
  },
  {
    name: "Scale",
    tier: "tier_3",
    price: 299,
    features: [
      "1,000 Keyword Searches / month",
      "200 Deep Audits / month",
      "Unlimited Projects",
      "AI Monitor (burns credits)",
      "To-Do List",
      "Priority Support",
      "Dedicated Account Manager",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectPlan = (tier: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // TODO: Stripe checkout
    console.log("Selected plan:", tier);
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Nav */}
      <nav className="border-b border-sidebar-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Eye className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-secondary-foreground">Visible</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-secondary-foreground">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that fits your AI visibility needs</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative border bg-card p-8 transition-all hover:shadow-lg ${
                plan.popular ? "border-primary shadow-[0_0_30px_hsl(146_75%_51%/0.1)]" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-card-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-card-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectPlan(plan.tier)}
                className="mt-8 w-full font-semibold"
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
