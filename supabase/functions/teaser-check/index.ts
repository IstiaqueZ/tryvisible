import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, keyword } = await req.json();
    if (!domain || !keyword) {
      return new Response(JSON.stringify({ error: "domain and keyword are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check IP usage
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check/update teaser usage
    const { data: usage } = await supabase
      .from("teaser_usage")
      .select("*")
      .eq("ip_address", ip)
      .maybeSingle();

    if (usage && usage.usage_count >= 5) {
      return new Response(
        JSON.stringify({ error: "limit_reached", message: "Free check limit reached. Sign up to continue." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (usage) {
      await supabase
        .from("teaser_usage")
        .update({ usage_count: usage.usage_count + 1, updated_at: new Date().toISOString() })
        .eq("id", usage.id);
    } else {
      await supabase.from("teaser_usage").insert({ ip_address: ip, usage_count: 1 });
    }

    // Call Perplexity
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are an AI visibility analyst. The user wants to know if the domain "${domain}" is visible when someone searches for "${keyword}" using AI search engines. Analyze whether this domain appears in AI search results for this keyword. Return a JSON object with these fields:
- visible: boolean (is the domain mentioned/cited?)
- competitors: string[] (top 3 competitor domains that ARE mentioned instead)
- improvements_count: number (estimated number of improvements the domain could make, between 5-20)
- summary: string (1-2 sentence summary of the findings)

Return ONLY valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: `Is ${domain} visible when searching for "${keyword}" in AI search engines? Who are the competitors that show up instead?`,
          },
        ],
        temperature: 0.1,
      }),
    });

    const perplexityData = await perplexityRes.json();
    const content = perplexityData.choices?.[0]?.message?.content || "";
    const citations = perplexityData.citations || [];

    // Try to parse JSON from the response
    let result;
    try {
      // Remove markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        visible: false,
        competitors: ["Unknown"],
        improvements_count: 10,
        summary: content.slice(0, 200),
      };
    }

    return new Response(
      JSON.stringify({
        visible: result.visible || false,
        competitors: result.competitors || [],
        improvements_count: result.improvements_count || 10,
        summary: result.summary || "",
        citations,
        remaining_checks: 5 - ((usage?.usage_count || 0) + 1),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("teaser-check error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
