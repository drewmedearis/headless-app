import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token" },
        { status: 400 }
      );
    }

    // Look up the token directly
    const { data: accessRecord, error: lookupError } = await supabase
      .from("deck_access")
      .select("id, email, first_name, last_name, status, verification_sent_at")
      .eq("verification_token", token)
      .single();

    if (lookupError || !accessRecord) {
      console.error("Token lookup error:", lookupError);
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if token is expired (24 hours)
    if (accessRecord.verification_sent_at) {
      const sentAt = new Date(accessRecord.verification_sent_at);
      const now = new Date();
      const hoursSinceSent = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceSent > 24) {
        return NextResponse.json(
          { error: "Verification link has expired. Please request a new one." },
          { status: 410 }
        );
      }
    }

    // Mark as verified if not already
    if (accessRecord.status !== "verified") {
      const { error: updateError } = await supabase
        .from("deck_access")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", accessRecord.id);

      if (updateError) {
        console.error("Verification update error:", updateError);
      }
    }

    // Get pitch deck URL
    const pitchDeckUrl = process.env.NEXT_PUBLIC_PITCH_DECK_URL || "https://gamma.app/docs/59d5nj6vi11d9qd";

    return NextResponse.json({
      success: true,
      verified: true,
      email: accessRecord.email,
      firstName: accessRecord.first_name,
      lastName: accessRecord.last_name,
      pitchDeckUrl,
      accessId: accessRecord.id,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify" },
      { status: 500 }
    );
  }
}
