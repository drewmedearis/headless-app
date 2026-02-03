import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const INVESTMENT_SIZES = [
  "under_25k",
  "25k_50k",
  "50k_100k",
  "100k_250k",
  "250k_500k",
  "500k_plus",
] as const;

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, company, investmentSize } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !investmentSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate investment size
    if (!INVESTMENT_SIZES.includes(investmentSize)) {
      return NextResponse.json(
        { error: "Invalid investment size" },
        { status: 400 }
      );
    }

    // Check if already verified
    const { data: existing } = await supabase
      .from("investor_access")
      .select("id, status, verified_at")
      .eq("email", email.toLowerCase())
      .single();

    if (existing?.status === "verified") {
      return NextResponse.json({
        success: true,
        message: "Already verified",
        alreadyVerified: true,
      });
    }

    // Generate verification token
    const verificationToken = generateToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://headlessmarkets.xyz";
    const verifyUrl = `${appUrl}/invest/verify?token=${verificationToken}`;

    // Upsert investor record
    const { error: dbError } = await supabase
      .from("investor_access")
      .upsert(
        {
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          company: company || null,
          investment_size: investmentSize,
          status: "pending_verification",
          verification_token: verificationToken,
          verification_sent_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }

    // Send verification email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Headless Markets <invest@headlessmarkets.xyz>",
      to: email,
      subject: "Verify your email to view the Headless Markets pitch deck",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <!-- Header -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <span style="color: #FFFFFF; font-size: 20px; font-weight: 600;">Headless Markets</span>
                      <span style="color: #83D6C5; font-size: 10px; font-weight: 500; background-color: rgba(131, 214, 197, 0.1); padding: 4px 8px; border-radius: 4px; margin-left: 8px; border: 1px solid rgba(131, 214, 197, 0.2);">BETA</span>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background-color: #0A0A0A; border: 1px solid #262626; border-radius: 12px; padding: 40px;">
                      <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                        Hi ${firstName},
                      </h1>

                      <p style="color: #A0A0A0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        Click the button below to verify your email and access the Headless Markets pitch deck.
                      </p>

                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                        <tr>
                          <td style="background-color: #83D6C5; border-radius: 8px;">
                            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; color: #000000; text-decoration: none; font-weight: 600; font-size: 16px;">
                              View Pitch Deck
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #606060; font-size: 14px; margin: 24px 0 0 0;">
                        This link expires in 24 hours.
                      </p>

                      <p style="color: #606060; font-size: 12px; margin: 16px 0 0 0; word-break: break-all;">
                        Or copy this URL: ${verifyUrl}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 32px; text-align: center;">
                      <p style="color: #606060; font-size: 12px; margin: 0;">
                        Headless Markets Protocol
                      </p>
                      <p style="color: #83D6C5; font-size: 12px; margin: 8px 0 0 0; font-style: italic;">
                        Agents form businesses. Humans invest after.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Email error:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Request access error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
