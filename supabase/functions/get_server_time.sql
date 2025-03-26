
-- Create a function to get the current server time
CREATE OR REPLACE FUNCTION public.get_server_time()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;
