select cron.schedule(
  'ai-monitor-cron-every-5-days',
  '0 3 */5 * *',
  $$
  select
    net.http_post(
        url:='https://hjmczmdswiirnogjnfdl.supabase.co/functions/v1/ai-monitor-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbWN6bWRzd2lpcm5vZ2puZmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzMzOTcsImV4cCI6MjA5MDQ0OTM5N30.w-NjnJGrxhQEPiOOCXTZjbDfqk7knHC6oANqB8B_61w"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);