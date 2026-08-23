import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const cookieStore = await cookies();

  const response = NextResponse.redirect(
    new URL(next, origin)
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  if (!code) {
    console.error("OAuth callback: No code received");

    return NextResponse.redirect(
      new URL("/login?error=no_auth_code", origin)
    );
  }

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  console.log("OAuth callback successful:", !!data?.session);
  console.error("OAuth callback error:", error);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", origin)
    );
  }

  return response;
}