-- Deny all direct client access to teaser_usage (service role bypasses RLS)
CREATE POLICY "No direct client access" ON public.teaser_usage
  AS RESTRICTIVE FOR ALL TO authenticated, anon USING (false) WITH CHECK (false);