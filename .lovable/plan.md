

# Visible — AEO Engine SaaS

## Design System
- **Dark color**: `#003934` | **Primary/Accent**: `#24e16a` | **White**: `#fff`
- **Zero border-radius** throughout (sharp corners everywhere)
- Clean, data-driven dashboard aesthetic

---

## Phase 1: Foundation & Auth

### Database Schema
- **profiles** — user_id, full_name, avatar_url, created_at
- **subscriptions** — user_id, stripe_customer_id, stripe_subscription_id, plan_tier (1/2/3), keyword_credits, deep_audit_credits, status, current_period_end
- **projects** — id, user_id, name, domain, created_at
- **keyword_researches** — id, project_id, keyword, gemini_response, openai_response, perplexity_response, gemini_citations, openai_citations, perplexity_citations, is_cited, is_named, sentiment (positive/negative/neutral), avg_quality_score, avg_visibility_score, individual scores per AI, created_at
- **deep_audits** — id, keyword_research_id, project_id, competitor_analysis (JSONB), improvement_suggestions (JSONB), pros_cons (JSONB), created_at
- **todo_items** — id, project_id, user_id, title, description, source (deep_audit reference), is_completed, created_at
- **ai_monitor_keywords** — id, project_id, keyword, is_active, next_run_at, created_at
- **monitor_history** — id, monitor_keyword_id, keyword_research_id, recorded_at (for charting)
- **teaser_usage** — ip_address, usage_count (max 5 per IP)

### Authentication
- Google OAuth via Supabase Auth
- Profile auto-creation trigger on signup

### Stripe Integration
- 3 tiers: $29/$99/$299 per month
- Tier 1: 50 keyword / 10 deep audit / 3 projects
- Tier 2: 250 keyword / 50 deep audit / 10 projects
- Tier 3: 1,000 keyword / 200 deep audit / unlimited projects
- Coupon support enabled
- Webhook to update subscription & credits in DB

---

## Phase 2: Landing Page & Teaser Flow

### Landing Page
- Hero with bold headline: "Are you visible on ChatGPT? Gemini? Perplexity?"
- Two large input fields: Domain + Primary Keyword
- Submit triggers a Perplexity-only quick check (edge function)
- IP tracked — max 5 free checks, then auto-redirect to auth
- Results show "the pain": competitor names found, missing visibility, teaser of improvements count
- CTA: "We found 10+ improvements. Start Now to unlock all" → Auth page

### Auth Flow
- Google sign-in page
- Post-auth: if no subscription → redirect to pricing/plans page
- After subscribing → redirect to dashboard

---

## Phase 3: Dashboard & Projects

### Main Dashboard (post-auth landing)
- Stats cards: Keyword credits left, Deep audit credits left, Total projects, AI monitored keywords count
- Alert banner if 0 credits
- Pending to-do count
- Project list with "Add Project" button (name + domain)

### Project Dashboard (sidebar layout)
- Left sidebar: Keyword Research, AI Monitor, To-Do List
- Sharp-cornered sidebar matching brand colors

---

## Phase 4: Keyword Research

### Research Flow
- Input field for keyword, submit triggers edge function
- Edge function calls Gemini, OpenAI (via Lovable AI gateway), and Perplexity (via connector) in parallel
- Stores full responses + citations, computes per-AI and average scores
- Deducts 1 keyword credit

### Results Table
- Paginated list of all researched keywords
- Columns: Keyword, Visible (yes/no), Avg Quality Score, Avg Visibility Score, Sentiment, Actions
- Search/filter support
- Expandable rows showing per-AI breakdown: individual quality/visibility scores, cited or not, sentiment
- Each row has "Deep Research" button (or "View Results" if already done)

---

## Phase 5: Deep Research

### Deep Audit Flow
- Opens in a modal/panel with detailed analysis
- Edge function analyzes top-named competitors and citations from keyword research
- Uses Serper API to find: directory listings, Reddit mentions, content gaps, feature comparisons
- Uses DeepSeek (via Lovable AI) as the analysis brain
- Deducts 1 deep audit credit

### Deep Audit Results
- Average + per-AI quality & visibility scores
- Pros/cons AI found about the project
- Competitor comparison: what they have that client doesn't
- Actionable improvement list (directory submissions, Reddit engagement, content suggestions, feature gaps)
- "Add to To-Do" button on each suggestion

---

## Phase 6: AI Monitor

### Monitor Setup
- Add keyword to monitor from keyword research list
- Shows credit cost warning (1 keyword credit per keyword per 5-day cycle)
- Won't run if credits exhausted

### Monitor Dashboard
- Line charts showing visibility & quality score trends over time (per keyword + average across all)
- Filter by keyword, date range
- Each data point links to the full keyword research result
- Scheduled edge function (pg_cron every 5 days) runs keyword research for all active monitor keywords

---

## Phase 7: To-Do List

### Project To-Do
- Items sourced from Deep Research suggestions + manually added
- Mark as completed
- Shows pending count

### Global To-Do (on main dashboard)
- Aggregated across all projects
- Filter by project
- Mark as solved

---

## Edge Functions Needed
1. **teaser-check** — Perplexity-only quick keyword check for landing page
2. **keyword-research** — Full multi-AI keyword research (Gemini, OpenAI, Perplexity)
3. **deep-audit** — Competitor analysis with Serper + DeepSeek
4. **ai-monitor-cron** — Scheduled function for monitored keywords
5. **stripe-webhook** — Handle subscription events & credit management

