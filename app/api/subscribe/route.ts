import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Newsletter subscription endpoint.
 * Stores email in backend for market launch notifications.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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

    // Forward to backend API
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return NextResponse.json({ success: true, message: "Subscribed successfully!" });
      }

      // If backend returns error, still return success to user
      // (we don't want to expose backend issues)
      console.error("Backend subscription failed:", await response.text());
    } catch (backendError) {
      // Backend unavailable - log but don't fail user experience
      console.error("Backend unavailable for newsletter:", backendError);
    }

    // Even if backend fails, return success (email validated)
    // In production, this should queue for retry
    return NextResponse.json({ 
      success: true, 
      message: "Thanks for subscribing! We'll notify you when markets launch." 
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
