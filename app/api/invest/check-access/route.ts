import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

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
    const { data: accessor, error } = await supabase
      .from("deck_access")
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

    const hasAccess = accessor?.status === "verified";

    // Track view if verified
    if (hasAccess) {
      await supabase.rpc("track_deck_view", { accessor_email: email.toLowerCase() });
    }

    return NextResponse.json({
      hasAccess,
      firstName: accessor?.first_name || null,
    });
  } catch (error) {
    console.error("Check access error:", error);
    return NextResponse.json(
      { error: "Failed to check access" },
      { status: 500 }
    );
  }
}
