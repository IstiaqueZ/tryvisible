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

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { keyword_research_id, project_id } = await req.json();
    if (!keyword_research_id || !project_id) {
      return new Response(JSON.stringify({ error: "keyword_research_id and project_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id, domain, name")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single();
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check deep audit credits
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!sub || sub.deep_audit_credits <= 0) {
      return new Response(JSON.stringify({ error: "No deep audit credits remaining" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if audit already exists
    const { data: existingAudit } = await supabase
      .from("deep_audits")
      .select("*")
      .eq("keyword_research_id", keyword_research_id)
      .maybeSingle();
    if (existingAudit) {
      return new Response(JSON.stringify(existingAudit), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get keyword research data
    const { data: research } = await supabase
      .from("keyword_researches")
      .select("*")
      .eq("id", keyword_research_id)
      .single();
    if (!research) {
      return new Response(JSON.stringify({ error: "Keyword research not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // API Keys
    const deepseekKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!deepseekKey) throw new Error("DEEPSEEK_API_KEY is not configured");
    const serperKey = Deno.env.get("SERPER_API_KEY");

    const domain = project.domain;
    const keyword = research.keyword;

    // Step 1: Use Serper to find competitor data
    let serperResults: any[] = [];
    if (serperKey) {
      const serperQueries = [
        `best ${keyword}`,
        `${keyword} directory listing`,
        `${keyword} reddit`,
        `${keyword} vs ${domain}`,
      ];

      const serperResponses = await Promise.all(
        serperQueries.map((q) =>
          fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
              "X-API-KEY": serperKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ q, num: 5 }),
          }).then((r) => r.json())
        )
      );

      serperResults = serperResponses.flatMap((r) => r.organic || []);
      console.log(`[deep-audit] Serper returned ${serperResults.length} results across ${serperQueries.length} queries`);
    } else {
      console.log("[deep-audit] SERPER_API_KEY not set, skipping search data");
    }

    // Step 2: Use DeepSeek as the analysis brain
    const allCitations = [
      ...(research.gemini_citations as any[] || []),
      ...(research.openai_citations as any[] || []),
      ...(research.perplexity_citations as any[] || []),
    ];

    const analysisPrompt = `You are a competitive intelligence analyst for AI Engine Optimization (AEO). 
Analyze the AI visibility of "${domain}" (project: "${project.name}") for the keyword "${keyword}".

Here is the data from our keyword research across 3 AI engines:
- Gemini response: ${research.gemini_response?.slice(0, 800)}
- ChatGPT response: ${research.openai_response?.slice(0, 800)}
- Perplexity response: ${research.perplexity_response?.slice(0, 800)}
- All citations found across AIs: ${JSON.stringify(allCitations.slice(0, 20))}
- Google search results (via Serper): ${JSON.stringify(serperResults.slice(0, 15).map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet })))}

Quality scores: Gemini ${research.gemini_quality_score}%, ChatGPT ${research.openai_quality_score}%, Perplexity ${research.perplexity_quality_score}%
Visibility scores: Gemini ${research.gemini_visibility_score}%, ChatGPT ${research.openai_visibility_score}%, Perplexity ${research.perplexity_visibility_score}%
Is cited: Gemini ${research.gemini_is_cited}, ChatGPT ${research.openai_is_cited}, Perplexity ${research.perplexity_is_cited}

Perform a thorough competitive analysis. Return ONLY valid JSON (no markdown code fences) with this exact structure:
{
  "top_competitors": [{"name": "competitor.com", "why_mentioned": "reason AI engines prefer them"}],
  "top_citations": [{"url": "https://...", "relevance": "why this source matters"}],
  "pros_cons": {
    "pros": ["strength the AI engines recognize about ${domain}"],
    "cons": ["weakness or gap the AI engines identified"]
  },
  "competitor_analysis": {
    "summary": "2-3 sentence overall competitive landscape analysis",
    "gaps": ["specific content/feature gap vs competitors"],
    "competitor_advantages": [{"competitor": "name", "advantage": "what they do better than ${domain}"}]
  },
  "improvement_suggestions": [
    {"category": "Directory Submissions", "action": "specific actionable step", "priority": "high|medium|low", "impact": "expected impact description"},
    {"category": "Content", "action": "specific content to create", "priority": "high|medium|low", "impact": "expected impact"},
    {"category": "Reddit", "action": "specific Reddit engagement strategy", "priority": "medium", "impact": "expected impact"},
    {"category": "Features", "action": "specific feature to add or improve", "priority": "low|medium|high", "impact": "expected impact"},
    {"category": "Technical SEO", "action": "specific technical improvement", "priority": "medium", "impact": "expected impact"}
  ]
}

Provide at least 6-10 actionable improvement suggestions across different categories.`;

    console.log("[deep-audit] Calling DeepSeek API for analysis...");

    const deepseekRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deepseekKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are an expert AEO (AI Engine Optimization) analyst. You analyze how businesses appear across AI search engines (ChatGPT, Gemini, Perplexity) and provide actionable competitive intelligence. Always return valid JSON." },
          { role: "user", content: analysisPrompt },
        ],
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    const deepseekData = await deepseekRes.json();
    console.log("[deep-audit] DeepSeek status:", deepseekRes.status);

    if (!deepseekRes.ok) {
      console.error("[deep-audit] DeepSeek error:", JSON.stringify(deepseekData));
      throw new Error(`DeepSeek API error [${deepseekRes.status}]: ${JSON.stringify(deepseekData)}`);
    }

    const aiContent = deepseekData.choices?.[0]?.message?.content || "";

    let analysis;
    try {
      const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error("[deep-audit] Failed to parse DeepSeek response:", aiContent.slice(0, 500));
      analysis = {
        top_competitors: [],
        top_citations: [],
        pros_cons: { pros: [], cons: [] },
        competitor_analysis: { summary: aiContent.slice(0, 500), gaps: [], competitor_advantages: [] },
        improvement_suggestions: [],
      };
    }

    // Insert deep audit
    const { data: audit, error: insertError } = await supabase
      .from("deep_audits")
      .insert({
        keyword_research_id,
        project_id,
        top_competitors: analysis.top_competitors || [],
        top_citations: analysis.top_citations || [],
        pros_cons: analysis.pros_cons || {},
        competitor_analysis: analysis.competitor_analysis || {},
        improvement_suggestions: analysis.improvement_suggestions || [],
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save audit");
    }

    // Deduct 1 deep audit credit
    await supabase
      .from("subscriptions")
      .update({ deep_audit_credits: sub.deep_audit_credits - 1 })
      .eq("id", sub.id);

    console.log("[deep-audit] Audit saved successfully:", audit.id);

    return new Response(JSON.stringify(audit), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("deep-audit error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
