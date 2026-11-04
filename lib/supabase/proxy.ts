import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

function isPublicPath(pathname: string) {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
}

function carrySession(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Refresh and verify the session before any other Supabase call.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const pathname = request.nextUrl.pathname;

  if (!signedIn && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return carrySession(supabaseResponse, NextResponse.redirect(url));
  }

  if (signedIn && isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return carrySession(supabaseResponse, NextResponse.redirect(url));
  }

  return supabaseResponse;
}
