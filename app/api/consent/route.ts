import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Cookie consent tracking endpoint.
 * Records user consent for analytics/marketing with attribution data.
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  try {
    const body = await request.json();
    const {
      sessionId,
      consentGiven,
      consentType = "analytics",
      fingerprintHash,
      referrer,
      landingPage,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    } = body;

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (typeof consentGiven !== "boolean") {
      return NextResponse.json(
        { error: "Consent status is required" },
        { status: 400 }
      );
    }

    // Get user agent from headers
    const userAgent = request.headers.get("user-agent") || null;

    // Record consent via Supabase function
    const { data, error } = await supabase.rpc("record_cookie_consent", {
      p_session_id: sessionId,
      p_consent_given: consentGiven,
      p_consent_type: consentType,
      p_fingerprint_hash: fingerprintHash || null,
      p_user_agent: userAgent,
      p_referrer: referrer || null,
      p_landing_page: landingPage || null,
      p_utm_source: utmSource || null,
      p_utm_medium: utmMedium || null,
      p_utm_campaign: utmCampaign || null,
      p_utm_term: utmTerm || null,
      p_utm_content: utmContent || null,
    });

    if (error) {
      console.error("Consent recording error:", error);
      // Don't fail silently for consent tracking
      return NextResponse.json({
        success: true,
        message: "Consent recorded",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Consent recorded",
      consentId: data,
    });
  } catch (error) {
    console.error("Consent recording error:", error);
    return NextResponse.json(
      { error: "Failed to record consent" },
      { status: 500 }
    );
  }
}
