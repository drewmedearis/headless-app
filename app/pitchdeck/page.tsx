"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Mail,
  CheckCircle,
  Lock,
  TrendingUp,
  Users,
  Zap,
  Building2,
} from "lucide-react";

const PARTICIPATION_SIZES = [
  { value: "under_25k", label: "Under $25K" },
  { value: "25k_50k", label: "$25K - $50K" },
  { value: "50k_100k", label: "$50K - $100K" },
  { value: "100k_250k", label: "$100K - $250K" },
  { value: "250k_500k", label: "$250K - $500K" },
  { value: "500k_plus", label: "$500K+" },
];

export default function EarnPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    investmentSize: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "already_verified">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Check if returning from verification
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for verified email (set by /pitchdeck/verify page)
    const stored = localStorage.getItem("headless_deck_email");
    if (stored) {
      setVerifiedEmail(stored);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.investmentSize) {
      setSubmitStatus("error");
      setSubmitMessage("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/deck/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyVerified) {
          setSubmitStatus("already_verified");
          setSubmitMessage("You already have access! Redirecting to pitch deck...");
          localStorage.setItem("headless_deck_email", formData.email);
          setTimeout(() => {
            setVerifiedEmail(formData.email);
          }, 1500);
        } else {
          setSubmitStatus("success");
          setSubmitMessage(data.message || "Check your email to verify and access the pitch deck.");
        }
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If verified, show the pitch deck
  if (verifiedEmail) {
    return <PitchDeckView email={verifiedEmail} />;
  }

  return (
    <main className="min-h-screen bg-cursor-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cursor-bg/80 backdrop-blur-md border-b border-cursor-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-cursor-white">Headless Markets</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                BETA
              </span>
            </Link>
            <Link href="/" className="nav-link text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Value Prop */}
            <div>
              <div className="badge badge-accent mb-6">
                <TrendingUp className="w-3 h-3" />
                <span>Earning Opportunity</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.2] mb-5 text-cursor-white">
                View the Headless Markets Pitch Deck
              </h1>

              <p className="text-lg text-cursor-text-secondary mb-8 leading-relaxed">
                Get access to our full presentation. See our traction,
                unit economics, and the $100K participation opportunity.
              </p>

              {/* Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-cursor-white font-medium text-sm">48 Hours: Idea to Live</h3>
                    <p className="text-cursor-text-secondary text-sm">3 bots deployed on Moltbook, engaging 1.4M agents</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div>
                    <h3 className="text-cursor-white font-medium text-sm">$100K-200K Month 1 Revenue</h3>
                    <p className="text-cursor-text-secondary text-sm">Based on current traction, not projections</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-accent-orange" />
                  </div>
                  <div>
                    <h3 className="text-cursor-white font-medium text-sm">17,727:1 LTV:CAC</h3>
                    <p className="text-cursor-text-secondary text-sm">Exceptional unit economics via agent-driven acquisition</p>
                  </div>
                </div>
              </div>

              {/* Email Gate Notice */}
              <div className="p-4 rounded-xl bg-cursor-surface/50 border border-cursor-border">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-cursor-muted" />
                  <div>
                    <p className="text-cursor-text text-sm font-medium">Email verification required</p>
                    <p className="text-cursor-muted text-xs">We'll send a verification link to access the deck</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="card p-8">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-accent-cyan" />
                <h2 className="text-xl font-semibold text-cursor-white">Request Deck Access</h2>
              </div>

              {submitStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-accent-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold text-cursor-white mb-2">Check Your Email</h3>
                  <p className="text-cursor-text-secondary mb-4">{submitMessage}</p>
                  <p className="text-cursor-muted text-sm">
                    Click the link in the email to verify and view the pitch deck.
                  </p>
                </div>
              ) : submitStatus === "already_verified" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-cursor-white mb-2">Already Verified</h3>
                  <p className="text-cursor-text-secondary">{submitMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-cursor-text-secondary mb-2">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cursor-text-secondary mb-2">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-cursor-text-secondary mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cursor-text-secondary mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Ventures"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cursor-text-secondary mb-2">
                      Participation Size <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PARTICIPATION_SIZES.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, investmentSize: size.value })}
                          className={`
                            px-4 py-3 rounded-lg border text-sm font-medium transition-all
                            ${formData.investmentSize === size.value
                              ? "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan"
                              : "bg-cursor-surface border-cursor-border text-cursor-text-secondary hover:border-cursor-border-light"
                            }
                          `}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {submitStatus === "error" && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-sm">{submitMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Get Access
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-cursor-muted text-xs text-center">
                    By submitting, you agree to receive emails about Headless Markets.
                    We'll send a verification link to access the deck.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Component to show after verification
function PitchDeckView({ email }: { email: string }) {
  const [firstName, setFirstName] = useState<string | null>(null);
  const pitchDeckUrl = process.env.NEXT_PUBLIC_PITCH_DECK_URL || "https://gamma.app/docs/59d5nj6vi11d9qd";

  useEffect(() => {
    // Fetch user info and track view
    fetch("/api/deck/check-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.firstName) {
          setFirstName(data.firstName);
        }
      })
      .catch(console.error);
  }, [email]);

  return (
    <main className="min-h-screen bg-cursor-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cursor-bg/80 backdrop-blur-md border-b border-cursor-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-cursor-white">Headless Markets</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                BETA
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-accent-cyan">
                <CheckCircle className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {/* Welcome Header */}
        <div className="bg-cursor-surface/30 border-b border-cursor-border py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-accent-cyan" />
              </div>
              <div>
                <p className="text-cursor-white text-sm font-medium">
                  {firstName ? `Welcome, ${firstName}` : "Access Granted"}
                </p>
                <p className="text-cursor-muted text-xs">{email}</p>
              </div>
            </div>
            <a
              href={pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Open in New Tab
            </a>
          </div>
        </div>

        {/* Pitch Deck Embed */}
        <div className="w-full" style={{ height: "calc(100vh - 120px)" }}>
          <iframe
            src={`${pitchDeckUrl}/embed`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            title="Headless Markets Pitch Deck"
          />
        </div>
      </div>
    </main>
  );
}
