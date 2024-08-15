import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // console.log("I WAS HERE, here is the request: ", request);

  // Use environment variable for the base URL
  const baseUrl = process.env.BASE_URL;
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  console.log("About to sign out");
  try {
    await supabase.auth.signOut();
    console.log("Sign out successful");
  } catch (error) {
    console.error("Sign out error: ", error);
  }

  // console.log("Redirecting to: ", `${baseUrl}/`);
  return NextResponse.redirect(`${baseUrl}/`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
