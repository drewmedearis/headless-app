"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";

const VERIFIED_KEY = "headless_deck_verified";
const VERIFIED_EMAIL_KEY = "headless_deck_email";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [pitchDeckUrl, setPitchDeckUrl] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }

    // Verify the token
    fetch(`/api/invest/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.verified) {
          setStatus("success");
          setUserName(data.firstName || "");
          setPitchDeckUrl(data.pitchDeckUrl);

          // Store verified status in localStorage for same-browser access
          localStorage.setItem(VERIFIED_KEY, "true");
          localStorage.setItem(VERIFIED_EMAIL_KEY, data.email);

          // Start countdown for auto-redirect
          let count = 5;
          const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
              clearInterval(interval);
              // Redirect to pitch deck
              window.location.href = data.pitchDeckUrl;
            }
          }, 1000);

          return () => clearInterval(interval);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <main className="min-h-screen bg-cursor-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-cursor-card border border-cursor-border rounded-xl p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cursor-surface border border-cursor-border flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-cursor-white mb-2">
                Verifying your email...
              </h1>
              <p className="text-cursor-text-secondary">
                Please wait while we confirm your access
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-xl font-semibold text-cursor-white mb-2">
                {userName ? `Welcome, ${userName}!` : "Email Verified!"}
              </h1>
              <p className="text-cursor-text-secondary mb-4">
                Your email has been verified. You now have access to the Headless Markets pitch deck.
              </p>

              {/* Countdown */}
              <div className="bg-cursor-bg/50 rounded-lg p-4 mb-6">
                <p className="text-cursor-text-secondary text-sm">
                  Redirecting to pitch deck in{" "}
                  <span className="text-accent-cyan font-semibold">{countdown}</span>{" "}
                  seconds...
                </p>
              </div>

              {/* Manual link */}
              <a
                href={pitchDeckUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all w-full"
              >
                View Pitch Deck Now
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-cursor-muted text-xs mt-4">
                You can return to view the deck anytime from this browser.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-xl font-semibold text-cursor-white mb-2">
                Verification Failed
              </h1>
              <p className="text-cursor-text-secondary mb-6">
                {message || "This verification link is invalid or has expired."}
              </p>
              <Link
                href="/earn"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all"
              >
                Request New Access
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-cursor-muted text-sm hover:text-cursor-white transition-colors">
            Return to Headless Markets
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cursor-bg flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
