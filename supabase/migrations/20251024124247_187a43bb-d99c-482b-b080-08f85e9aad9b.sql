-- Function to get all users with statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users_stats()
RETURNS TABLE (
  user_id uuid,
  email text,
  name text,
  created_at timestamptz,
  tier text,
  subscription_tier text,
  subscription_status text,
  subscription_expires_at timestamptz,
  total_habits bigint,
  total_completions bigint,
  last_activity timestamptz,
  is_admin boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.email,
    p.name,
    u.created_at,
    p.tier,
    s.tier as subscription_tier,
    s.status as subscription_status,
    s.expires_at as subscription_expires_at,
    COUNT(DISTINCT h.id) as total_habits,
    COUNT(DISTINCT hc.id) as total_completions,
    MAX(h.last_completed) as last_activity,
    EXISTS(SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = 'admin') as is_admin
  FROM auth.users u
  LEFT JOIN profiles p ON p.id = u.id
  LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
  LEFT JOIN habits h ON h.user_id = u.id
  LEFT JOIN habit_completions hc ON hc.user_id = u.id
  GROUP BY u.id, u.email, p.name, u.created_at, p.tier, s.tier, s.status, s.expires_at
  ORDER BY u.created_at DESC;
END;
$$;

-- Function to get all subscriptions (admin only)
CREATE OR REPLACE FUNCTION public.get_all_subscriptions()
RETURNS TABLE (
  subscription_id uuid,
  user_id uuid,
  user_email text,
  user_name text,
  tier text,
  status text,
  started_at timestamptz,
  expires_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  RETURN QUERY
  SELECT 
    s.id as subscription_id,
    s.user_id,
    u.email as user_email,
    p.name as user_name,
    s.tier,
    s.status,
    s.started_at,
    s.expires_at,
    s.stripe_customer_id,
    s.stripe_subscription_id,
    s.created_at
  FROM subscriptions s
  LEFT JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN profiles p ON p.id = s.user_id
  ORDER BY s.created_at DESC;
END;
$$;

-- Function to manually update user subscription (admin only)
CREATE OR REPLACE FUNCTION public.update_user_subscription(
  p_user_id uuid,
  p_tier text,
  p_status text,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  -- Upsert subscription
  INSERT INTO subscriptions (user_id, tier, status, expires_at, started_at)
  VALUES (p_user_id, p_tier, p_status, p_expires_at, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    tier = p_tier,
    status = p_status,
    expires_at = p_expires_at,
    updated_at = NOW();

  -- Also update profile tier
  UPDATE profiles 
  SET tier = p_tier
  WHERE id = p_user_id;
END;
$$;

-- Function to add user role (admin only)
CREATE OR REPLACE FUNCTION public.add_user_role(
  p_user_id uuid,
  p_role app_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Function to remove user role (admin only)
CREATE OR REPLACE FUNCTION public.remove_user_role(
  p_user_id uuid,
  p_role app_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  DELETE FROM user_roles
  WHERE user_id = p_user_id AND role = p_role;
END;
$$;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  total_users bigint,
  active_users_30d bigint,
  total_subscriptions bigint,
  active_subscriptions bigint,
  monthly_revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::bigint as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM habit_completions WHERE completed_at >= NOW() - INTERVAL '30 days')::bigint as active_users_30d,
    (SELECT COUNT(*) FROM subscriptions)::bigint as total_subscriptions,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active')::bigint as active_subscriptions,
    (SELECT COUNT(*) * 39.90 FROM subscriptions WHERE status = 'active' AND tier = 'pro')::numeric as monthly_revenue;
END;
$$;