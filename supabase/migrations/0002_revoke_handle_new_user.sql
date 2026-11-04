-- Lock down the sign-up helper. The on_auth_user_created trigger still runs,
-- because it executes as the function owner rather than as anon or authenticated.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
