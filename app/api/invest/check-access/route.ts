import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if verified
    const { data: investor, error } = await supabase
      .from("investor_access")
      .select("id, status, first_name, verified_at")
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Check access error:", error);
      return NextResponse.json(
        { error: "Failed to check access" },
        { status: 500 }
      );
    }

    const hasAccess = investor?.status === "verified";

    // Track view if verified
    if (hasAccess) {
      await supabase.rpc("track_deck_view", { investor_email: email.toLowerCase() });
    }

    return NextResponse.json({
      hasAccess,
      firstName: investor?.first_name || null,
    });
  } catch (error) {
    console.error("Check access error:", error);
    return NextResponse.json(
      { error: "Failed to check access" },
      { status: 500 }
    );
  }
}
