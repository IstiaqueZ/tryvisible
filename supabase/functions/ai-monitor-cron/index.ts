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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // API Keys
    const openaiKey = Deno.env.get("OPENAI_API_KEY")!;
    const geminiKey = Deno.env.get("GEMINI_API_KEY")!;
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY")!;

    console.log("[AI-MONITOR-CRON] Starting scheduled run");

    // Get all active monitor keywords that are due
    const { data: dueKeywords, error } = await supabase
      .from("ai_monitor_keywords")
      .select("*, projects!inner(id, domain, user_id)")
      .eq("is_active", true)
      .lte("next_run_at", new Date().toISOString());

    if (error) {
      console.error("Error fetching keywords:", error);
      throw error;
    }

    if (!dueKeywords || dueKeywords.length === 0) {
      console.log("[AI-MONITOR-CRON] No keywords due for processing");
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[AI-MONITOR-CRON] Processing ${dueKeywords.length} keywords`);

    let processed = 0;
    let skipped = 0;

    for (const mk of dueKeywords) {
      const project = mk.projects as any;

      // Check if user has keyword credits
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", project.user_id)
        .single();

      if (!sub || sub.keyword_credits <= 0) {
        console.log(`[AI-MONITOR-CRON] Skipping ${mk.keyword} - no credits for user ${project.user_id}`);
        skipped++;
        continue;
      }

      const domain = project.domain;
      const keyword = mk.keyword;

      const systemPrompt = `You are an AI visibility analyst. Analyze if the domain "${domain}" is visible/mentioned/cited when a user asks about "${keyword}". Return ONLY valid JSON with:
{
  "response_text": "your full analysis text",
  "is_cited": boolean,
  "citations": ["url1", "url2"],
  "quality_score": number (0-100),
  "visibility_score": number (0-100),
  "sentiment": "positive" | "negative" | "neutral" | "mixed"
}`;
      const userMsg = `Is ${domain} recommended or mentioned when someone asks about "${keyword}"?`;

      try {
        const [geminiRes, openaiRes, perplexityRes] = await Promise.all([
          // Google Gemini (direct API)
          fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userMsg}` }] }],
              generationConfig: { temperature: 0.1, responseMimeType: "text/plain" },
            }),
          }),
          // OpenAI ChatGPT (direct API)
          fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMsg },
              ],
              temperature: 0.1,
            }),
          }),
          // Perplexity (direct API)
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
          geminiRes.json(), openaiRes.json(), perplexityRes.json(),
        ]);

        const parseJSON = (text: string) => {
          try {
            return JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
          } catch {
            return { response_text: text, is_cited: false, citations: [], quality_score: 0, visibility_score: 0, sentiment: "neutral" };
          }
        };

        const geminiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const gemini = parseJSON(geminiContent);
        const openaiContent = openaiData.choices?.[0]?.message?.content || "";
        const openai = parseJSON(openaiContent);
        const perplexityContent = perplexityData.choices?.[0]?.message?.content || "";
        const perplexity = parseJSON(perplexityContent);

        const avgQ = Math.round(((gemini.quality_score || 0) + (openai.quality_score || 0) + (perplexity.quality_score || 0)) / 3);
        const avgV = Math.round(((gemini.visibility_score || 0) + (openai.visibility_score || 0) + (perplexity.visibility_score || 0)) / 3);
        const isCited = gemini.is_cited || openai.is_cited || perplexity.is_cited;

        const sentiments = [gemini.sentiment, openai.sentiment, perplexity.sentiment].filter(Boolean);
        const sc: Record<string, number> = {};
        sentiments.forEach((s) => { sc[s] = (sc[s] || 0) + 1; });
        const overallSentiment = Object.entries(sc).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

        const { data: research } = await supabase
          .from("keyword_researches")
          .insert({
            project_id: project.id,
            keyword,
            gemini_response: gemini.response_text || geminiContent,
            openai_response: openai.response_text || openaiContent,
            perplexity_response: perplexity.response_text || perplexityContent,
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
            is_named: isCited,
            sentiment: overallSentiment as any,
            avg_quality_score: avgQ,
            avg_visibility_score: avgV,
          })
          .select()
          .single();

        if (research) {
          await supabase.from("monitor_history").insert({
            monitor_keyword_id: mk.id,
            keyword_research_id: research.id,
          });

          await supabase
            .from("subscriptions")
            .update({ keyword_credits: sub.keyword_credits - 1 })
            .eq("id", sub.id);

          await supabase
            .from("ai_monitor_keywords")
            .update({ next_run_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() })
            .eq("id", mk.id);

          processed++;
          console.log(`[AI-MONITOR-CRON] Processed: ${keyword} for ${domain}`);
        }
      } catch (err) {
        console.error(`[AI-MONITOR-CRON] Error processing ${keyword}:`, err);
      }

      // Brief delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 2000));
    }

    console.log(`[AI-MONITOR-CRON] Done. Processed: ${processed}, Skipped: ${skipped}`);
    return new Response(JSON.stringify({ processed, skipped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[AI-MONITOR-CRON] Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
