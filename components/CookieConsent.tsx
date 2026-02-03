"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "headless_cookie_consent";
const SESSION_ID_KEY = "headless_session_id";

type ConsentStatus = "accepted" | "declined" | null;

// Generate a unique session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Parse UTM parameters from URL
function getUtmParams(): Record<string, string | null> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

// Simple browser fingerprint (non-invasive)
function generateFingerprint(): string {
  if (typeof window === "undefined") return "";

  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join("|");

  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export default function CookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (storedConsent === "accepted" || storedConsent === "declined") {
      setConsentStatus(storedConsent as ConsentStatus);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const recordConsent = useCallback(async (accepted: boolean) => {
    const sessionId = getSessionId();
    const utmParams = getUtmParams();
    const fingerprint = generateFingerprint();

    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          consentGiven: accepted,
          consentType: "analytics",
          fingerprintHash: fingerprint,
          referrer: document.referrer || null,
          landingPage: window.location.pathname,
          ...utmParams,
        }),
      });
    } catch (error) {
      // Silently fail - don't block user experience
      console.error("Failed to record consent:", error);
    }
  }, []);

  const handleAccept = useCallback(async () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    setIsVisible(false);
    await recordConsent(true);
  }, [recordConsent]);

  const handleDecline = useCallback(async () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsentStatus("declined");
    setIsVisible(false);
    await recordConsent(false);
  }, [recordConsent]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't render if user has already made a choice or banner is dismissed
  if (consentStatus !== null || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cursor-card border border-cursor-border rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 md:mb-0">
                <h3 className="text-sm font-semibold text-cursor-white">
                  Analytics & Cookies
                </h3>
                <button
                  onClick={handleDismiss}
                  className="md:hidden p-1 text-cursor-muted hover:text-cursor-text-secondary transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-cursor-text-secondary leading-relaxed">
                We use cookies and similar technologies to analyze traffic and improve your experience.
                By clicking &quot;Accept&quot;, you consent to our use of analytics cookies.{" "}
                <a
                  href="/privacy"
                  className="text-accent-cyan hover:underline"
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-xs md:text-sm font-medium text-cursor-text-secondary hover:text-cursor-white border border-cursor-border hover:border-cursor-border-accent rounded-lg transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-xs md:text-sm font-semibold bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/90 transition-all hover:shadow-[0_0_20px_rgba(131,214,197,0.25)]"
              >
                Accept
              </button>
              <button
                onClick={handleDismiss}
                className="hidden md:flex p-1.5 text-cursor-muted hover:text-cursor-text-secondary transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export session ID getter for use in other components (newsletter, deck access)
export { getSessionId };
