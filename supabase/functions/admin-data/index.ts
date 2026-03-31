import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Unauthorized: not an admin");

    // Fetch all users from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    // Fetch all profiles
    const { data: profiles } = await supabase.from("profiles").select("*");

    // Fetch all subscriptions
    const { data: subscriptions } = await supabase.from("subscriptions").select("*");

    // Fetch all projects with counts
    const { data: projects } = await supabase.from("projects").select("*");

    // Fetch keyword research counts per project
    const { data: kwCounts } = await supabase
      .from("keyword_researches")
      .select("project_id");

    // Fetch monitor keyword counts per project
    const { data: monitorCounts } = await supabase
      .from("ai_monitor_keywords")
      .select("project_id");

    // Build project stats
    const projectStats = (projects || []).map((p: any) => ({
      ...p,
      keyword_research_count: (kwCounts || []).filter((k: any) => k.project_id === p.id).length,
      monitor_keyword_count: (monitorCounts || []).filter((m: any) => m.project_id === p.id).length,
    }));

    // Build user list
    const users = (authUsers?.users || []).map((u: any) => {
      const profile = (profiles || []).find((p: any) => p.id === u.id);
      const sub = (subscriptions || []).find((s: any) => s.user_id === u.id);
      const userProjects = projectStats.filter((p: any) => p.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        subscription: sub || null,
        project_count: userProjects.length,
      };
    });

    return new Response(JSON.stringify({
      users,
      subscriptions: subscriptions || [],
      projects: projectStats,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error.message.includes("Unauthorized") ? 403 : 500,
    });
  }
});
