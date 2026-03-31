import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Calendar, Search, BarChart3, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

const tierLabels: Record<string, string> = {
  tier_1: "Starter",
  tier_2: "Pro",
  tier_3: "Enterprise",
};

const Transactions = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();

  const handleManageBilling = async () => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/customer-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <Eye className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">Visible</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">Account & Billing</h1>

        {/* Current Plan */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription.subscribed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge className="bg-primary/20 text-primary border-0">
                    {tierLabels[subscription.plan_tier || ""] || subscription.plan_tier}
                  </Badge>
                </div>
                {subscription.subscription_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current period ends</span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(subscription.subscription_end).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">No active subscription</p>
                <Button onClick={() => navigate("/pricing")}>Choose a Plan</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits */}
        {subscription.subscribed && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Credits Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border p-4 text-center">
                  <Search className="h-5 w-5 text-primary mx-auto mb-2" />
                  <span className="font-display text-2xl font-bold block">{subscription.keyword_credits}</span>
                  <span className="text-xs text-muted-foreground">Keyword Credits</span>
                </div>
                <div className="border border-border p-4 text-center">
                  <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
                  <span className="font-display text-2xl font-bold block">{subscription.deep_audit_credits}</span>
                  <span className="text-xs text-muted-foreground">Deep Audit Credits</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manage Billing */}
        {subscription.subscribed && (
          <div className="flex gap-3">
            <Button onClick={handleManageBilling} variant="outline" className="flex-1">
              Manage Billing & Invoices
            </Button>
            <Button onClick={() => navigate("/pricing")} className="flex-1">
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
