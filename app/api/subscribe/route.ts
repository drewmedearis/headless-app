import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Newsletter subscription endpoint.
 * Stores email in Supabase for market launch notifications.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "website" } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Subscribe via Supabase function (handles upsert and reactivation)
    const { data: subscriber, error } = await supabase
      .rpc("subscribe_newsletter", {
        subscriber_email: email,
        subscriber_source: source,
        subscriber_metadata: {},
      });

    if (error) {
      console.error("Newsletter subscription error:", error);
      // Don't expose internal errors - still return success to user
      return NextResponse.json({
        success: true,
        message: "Thanks for subscribing! We'll notify you when markets launch.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll notify you when AO markets launch.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
