import { Check, ArrowRight, Eye, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS, TierKey } from "@/lib/stripe-config";
import { useState } from "react";

const plans: { tier: TierKey; popular?: boolean; features: string[] }[] = [
  {
    tier: "tier_1",
    features: [
      "50 Keyword Searches / month",
      "10 Deep Audits / month",
      "3 Projects",
      "AI Monitor (burns credits)",
      "To-Do List",
    ],
  },
  {
    tier: "tier_2",
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
    tier: "tier_3",
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
  const { user, session, subscription } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSelectPlan = async (tier: TierKey) => {
    if (!user || !session) {
      navigate("/auth");
      return;
    }
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: STRIPE_TIERS[tier].price_id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Portal error:", err);
    }
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
          <div className="flex items-center gap-3">
            {subscription.subscribed && (
              <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                <Settings className="h-4 w-4 mr-1" /> Manage Subscription
              </Button>
            )}
            {user && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-secondary-foreground">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that fits your AI visibility needs</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const tierData = STRIPE_TIERS[plan.tier];
            const isCurrentPlan = subscription.plan_tier === plan.tier && subscription.subscribed;

            return (
              <div
                key={plan.tier}
                className={`relative border bg-card p-8 transition-all hover:shadow-lg ${
                  isCurrentPlan
                    ? "border-primary shadow-[0_0_30px_hsl(146_75%_51%/0.15)]"
                    : plan.popular
                    ? "border-primary shadow-[0_0_30px_hsl(146_75%_51%/0.1)]"
                    : "border-border"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Your Plan
                  </div>
                )}
                {!isCurrentPlan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-card-foreground">{tierData.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-card-foreground">${tierData.price}</span>
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
                  onClick={() => isCurrentPlan ? handleManageSubscription() : handleSelectPlan(plan.tier)}
                  className="mt-8 w-full font-semibold"
                  variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={loadingTier === plan.tier}
                >
                  {loadingTier === plan.tier ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    <>Manage Plan <Settings className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Get Started <ArrowRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
