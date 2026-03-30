import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tier mapping
const TIER_MAP: Record<string, { tier: string; keyword_credits: number; deep_audit_credits: number }> = {
  prod_UDrSSJtAPll18T: { tier: "tier_1", keyword_credits: 50, deep_audit_credits: 10 },
  prod_UDrSgaqUoAwkLt: { tier: "tier_2", keyword_credits: 250, deep_audit_credits: 50 },
  prod_UDrUXhbiwqJZIo: { tier: "tier_3", keyword_credits: 1000, deep_audit_credits: 200 },
  // Yearly products map to the same tiers
  prod_UFCo9tZ1IKjM06: { tier: "tier_1", keyword_credits: 50, deep_audit_credits: 10 },
  prod_UFCp3MQRi50qoE: { tier: "tier_2", keyword_credits: 250, deep_audit_credits: 50 },
  prod_UFCpHCBG2qg1MW: { tier: "tier_3", keyword_credits: 1000, deep_audit_credits: 200 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Unauthorized");

    const user = userData.user;
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });

    if (customers.data.length === 0) {
      // No Stripe customer - not subscribed
      // Ensure subscription row exists with inactive state
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          status: "incomplete",
          keyword_credits: 0,
          deep_audit_credits: 0,
        });
      }

      return new Response(
        JSON.stringify({ subscribed: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let tierInfo = TIER_MAP["prod_UDrSSJtAPll18T"]; // default

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      const endTs = subscription.current_period_end;
      if (endTs && !isNaN(endTs)) {
        subscriptionEnd = new Date(endTs * 1000).toISOString();
      }
      productId = subscription.items.data[0].price.product as string;
      tierInfo = TIER_MAP[productId] || tierInfo;
    }

    // Upsert subscription in our DB
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSub) {
      // Only reset credits when the plan tier changes or status changes to active from non-active
      const planChanged = existingSub.plan_tier !== tierInfo.tier;
      const justActivated = existingSub.status !== "active" && hasActiveSub;
      const shouldResetCredits = planChanged || justActivated;

      const updateData: Record<string, any> = {
        status: hasActiveSub ? "active" : "canceled",
        plan_tier: tierInfo.tier,
        stripe_customer_id: customerId,
        stripe_subscription_id: hasActiveSub ? subscriptions.data[0].id : null,
        current_period_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      };

      if (shouldResetCredits) {
        updateData.keyword_credits = hasActiveSub ? tierInfo.keyword_credits : 0;
        updateData.deep_audit_credits = hasActiveSub ? tierInfo.deep_audit_credits : 0;
      } else if (!hasActiveSub) {
        updateData.keyword_credits = 0;
        updateData.deep_audit_credits = 0;
      }

      await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("id", existingSub.id);
    } else {
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        status: hasActiveSub ? "active" : "incomplete",
        plan_tier: tierInfo.tier as any,
        stripe_customer_id: customerId,
        stripe_subscription_id: hasActiveSub ? subscriptions.data[0].id : null,
        current_period_end: subscriptionEnd,
        keyword_credits: hasActiveSub ? tierInfo.keyword_credits : 0,
        deep_audit_credits: hasActiveSub ? tierInfo.deep_audit_credits : 0,
      });
    }

    return new Response(
      JSON.stringify({
        subscribed: hasActiveSub,
        product_id: productId,
        plan_tier: tierInfo.tier,
        subscription_end: subscriptionEnd,
        keyword_credits: hasActiveSub ? tierInfo.keyword_credits : 0,
        deep_audit_credits: hasActiveSub ? tierInfo.deep_audit_credits : 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("check-subscription error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
