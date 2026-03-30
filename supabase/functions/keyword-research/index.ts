import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { project_id, keyword } = await req.json();
    if (!project_id || !keyword) {
      return new Response(JSON.stringify({ error: "project_id and keyword are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id, domain")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check keyword credits
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!sub || sub.keyword_credits <= 0) {
      return new Response(JSON.stringify({ error: "No keyword credits remaining" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = project.domain;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY")!;

    const systemPrompt = `You are an AI visibility analyst. Analyze if the domain "${domain}" is visible/mentioned/cited when a user asks about "${keyword}". Return ONLY valid JSON (no markdown) with:
{
  "response_text": "your full analysis text",
  "is_cited": boolean,
  "citations": ["url1", "url2"],
  "quality_score": number (0-100, how well the domain's content quality is perceived),
  "visibility_score": number (0-100, how prominently the domain appears),
  "sentiment": "positive" | "negative" | "neutral" | "mixed"
}`;

    const userMsg = `Is ${domain} recommended or mentioned when someone asks about "${keyword}"? Who else is mentioned? Analyze the visibility and quality of ${domain} for this topic.`;

    // Call all 3 AI engines in parallel
    const [geminiRes, openaiRes, perplexityRes] = await Promise.all([
      // Gemini via Lovable AI Gateway
      fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg },
          ],
          temperature: 0.1,
        }),
      }),
      // OpenAI via Lovable AI Gateway
      fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg },
          ],
          temperature: 0.1,
        }),
      }),
      // Perplexity direct
      fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${perplexityKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg },
          ],
          temperature: 0.1,
        }),
      }),
    ]);

    const [geminiData, openaiData, perplexityData] = await Promise.all([
      geminiRes.json(),
      openaiRes.json(),
      perplexityRes.json(),
    ]);

    const parseAIResponse = (data: any) => {
      try {
        const content = data.choices?.[0]?.message?.content || "";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return {
          response_text: data.choices?.[0]?.message?.content || "",
          is_cited: false,
          citations: [],
          quality_score: 0,
          visibility_score: 0,
          sentiment: "neutral",
        };
      }
    };

    const gemini = parseAIResponse(geminiData);
    const openai = parseAIResponse(openaiData);
    const perplexity = parseAIResponse(perplexityData);

    const avgQuality = Math.round(
      ((gemini.quality_score || 0) + (openai.quality_score || 0) + (perplexity.quality_score || 0)) / 3
    );
    const avgVisibility = Math.round(
      ((gemini.visibility_score || 0) + (openai.visibility_score || 0) + (perplexity.visibility_score || 0)) / 3
    );
    const isCited = gemini.is_cited || openai.is_cited || perplexity.is_cited;
    const isNamed = isCited; // simplified

    // Determine overall sentiment
    const sentiments = [gemini.sentiment, openai.sentiment, perplexity.sentiment].filter(Boolean);
    const sentimentCounts: Record<string, number> = {};
    sentiments.forEach((s) => { sentimentCounts[s] = (sentimentCounts[s] || 0) + 1; });
    const overallSentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    // Insert keyword research
    const { data: research, error: insertError } = await supabase
      .from("keyword_researches")
      .insert({
        project_id,
        keyword,
        gemini_response: gemini.response_text || "",
        openai_response: openai.response_text || "",
        perplexity_response: perplexity.response_text || "",
        gemini_citations: gemini.citations || [],
        openai_citations: openai.citations || [],
        perplexity_citations: perplexityData.citations || perplexity.citations || [],
        gemini_is_cited: gemini.is_cited || false,
        openai_is_cited: openai.is_cited || false,
        perplexity_is_cited: perplexity.is_cited || false,
        gemini_quality_score: gemini.quality_score || 0,
        gemini_visibility_score: gemini.visibility_score || 0,
        openai_quality_score: openai.quality_score || 0,
        openai_visibility_score: openai.visibility_score || 0,
        perplexity_quality_score: perplexity.quality_score || 0,
        perplexity_visibility_score: perplexity.visibility_score || 0,
        is_cited: isCited,
        is_named: isNamed,
        sentiment: overallSentiment as any,
        avg_quality_score: avgQuality,
        avg_visibility_score: avgVisibility,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save research results");
    }

    // Deduct 1 keyword credit
    await supabase
      .from("subscriptions")
      .update({ keyword_credits: sub.keyword_credits - 1 })
      .eq("id", sub.id);

    return new Response(JSON.stringify(research), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("keyword-research error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
