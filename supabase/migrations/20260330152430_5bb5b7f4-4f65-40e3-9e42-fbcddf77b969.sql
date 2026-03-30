
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Subscription plan tier enum
CREATE TYPE public.plan_tier AS ENUM ('tier_1', 'tier_2', 'tier_3');
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_tier public.plan_tier NOT NULL DEFAULT 'tier_1',
  keyword_credits INTEGER NOT NULL DEFAULT 50,
  deep_audit_credits INTEGER NOT NULL DEFAULT 10,
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Sentiment enum
CREATE TYPE public.sentiment_type AS ENUM ('positive', 'negative', 'neutral', 'mixed');

-- Keyword researches table
CREATE TABLE public.keyword_researches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  gemini_response TEXT,
  openai_response TEXT,
  perplexity_response TEXT,
  gemini_citations JSONB DEFAULT '[]'::jsonb,
  openai_citations JSONB DEFAULT '[]'::jsonb,
  perplexity_citations JSONB DEFAULT '[]'::jsonb,
  is_cited BOOLEAN DEFAULT false,
  is_named BOOLEAN DEFAULT false,
  sentiment public.sentiment_type DEFAULT 'neutral',
  avg_quality_score NUMERIC(5,2) DEFAULT 0,
  avg_visibility_score NUMERIC(5,2) DEFAULT 0,
  gemini_quality_score NUMERIC(5,2) DEFAULT 0,
  gemini_visibility_score NUMERIC(5,2) DEFAULT 0,
  openai_quality_score NUMERIC(5,2) DEFAULT 0,
  openai_visibility_score NUMERIC(5,2) DEFAULT 0,
  perplexity_quality_score NUMERIC(5,2) DEFAULT 0,
  perplexity_visibility_score NUMERIC(5,2) DEFAULT 0,
  gemini_is_cited BOOLEAN DEFAULT false,
  openai_is_cited BOOLEAN DEFAULT false,
  perplexity_is_cited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.keyword_researches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own keyword researches" ON public.keyword_researches FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = keyword_researches.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own keyword researches" ON public.keyword_researches FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = keyword_researches.project_id AND projects.user_id = auth.uid())
);

-- Deep audits table
CREATE TABLE public.deep_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_research_id UUID NOT NULL REFERENCES public.keyword_researches(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  competitor_analysis JSONB DEFAULT '{}'::jsonb,
  improvement_suggestions JSONB DEFAULT '[]'::jsonb,
  pros_cons JSONB DEFAULT '{}'::jsonb,
  top_citations JSONB DEFAULT '[]'::jsonb,
  top_competitors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deep_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own deep audits" ON public.deep_audits FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deep_audits.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own deep audits" ON public.deep_audits FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deep_audits.project_id AND projects.user_id = auth.uid())
);

-- Todo items table
CREATE TABLE public.todo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  source_audit_id UUID REFERENCES public.deep_audits(id) ON DELETE SET NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.todo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own todos" ON public.todo_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos" ON public.todo_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos" ON public.todo_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON public.todo_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- AI Monitor keywords table
CREATE TABLE public.ai_monitor_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_run_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '5 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_monitor_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own monitor keywords" ON public.ai_monitor_keywords FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = ai_monitor_keywords.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own monitor keywords" ON public.ai_monitor_keywords FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = ai_monitor_keywords.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update own monitor keywords" ON public.ai_monitor_keywords FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = ai_monitor_keywords.project_id AND projects.user_id = auth.uid())
);

-- Monitor history table
CREATE TABLE public.monitor_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_keyword_id UUID NOT NULL REFERENCES public.ai_monitor_keywords(id) ON DELETE CASCADE,
  keyword_research_id UUID NOT NULL REFERENCES public.keyword_researches(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.monitor_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own monitor history" ON public.monitor_history FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.ai_monitor_keywords mk
    JOIN public.projects p ON p.id = mk.project_id
    WHERE mk.id = monitor_history.monitor_keyword_id AND p.user_id = auth.uid()
  )
);

-- Teaser usage table (no RLS - accessed by edge function with service role)
CREATE TABLE public.teaser_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ip_address)
);
ALTER TABLE public.teaser_usage ENABLE ROW LEVEL SECURITY;
