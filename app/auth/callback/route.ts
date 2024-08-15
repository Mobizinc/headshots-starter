import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // console.log("I WAS HERE");

    // Use environment variable for the base URL
    const baseUrl = process.env.BASE_URL;
    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get("code");
    const error = requestUrl.searchParams.get("error");
    const next = requestUrl.searchParams.get("next") || "/";
    const error_description = requestUrl.searchParams.get("error_description");
    // console.log("REQUEST URL IS: ", requestUrl);

    if (error) {
        console.log("error: ", {
            error,
            error_description,
            code,
        });
    }

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies });

        try {
            await supabase.auth.exchangeCodeForSession(code);

            // After exchanging the code, check if the user has a feature-flag row and credits row, if not, create one
            const { data: user, error: userError } = await supabase.auth.getUser();
            console.log("user: ", user);
            if (userError || !user) {
                console.error(
                    "[login] [session] [500] Error getting user: ",
                    userError
                );
                return NextResponse.redirect(
                    `${baseUrl}/login/failed?err=500`
                );
            }
        } catch (error) {
            if (isAuthApiError(error)) {
                console.error(
                    "[login] [session] [500] Error exchanging code for session: ",
                    error
                );
                return NextResponse.redirect(
                    `${baseUrl}/login/failed?err=AuthApiError`
                );
            } else {
                console.error("[login] [session] [500] Something wrong: ", error);
                return NextResponse.redirect(
                    `${baseUrl}/login/failed?err=500`
                );
            }
        }
    }

    // console.log("HERE IS THE NEXT ", new URL(next, baseUrl));
    return NextResponse.redirect(new URL(next, baseUrl));
}
