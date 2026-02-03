import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token" },
        { status: 400 }
      );
    }

    // Verify the token
    const { data: investor, error } = await supabase
      .rpc("verify_investor_token", { token });

    if (error || !investor) {
      console.error("Verification error:", error);
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      investor: {
        email: investor.email,
        firstName: investor.first_name,
        lastName: investor.last_name,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify" },
      { status: 500 }
    );
  }
}
