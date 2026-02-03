"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [investorName, setInvestorName] = useState("");

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
        if (data.success && data.investor) {
          setStatus("success");
          setInvestorName(data.investor.firstName);
          // Store verified email in localStorage
          localStorage.setItem("investor_verified_email", data.investor.email);
          // Redirect to deck after short delay
          setTimeout(() => {
            router.push("/invest");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token, router]);

  return (
    <main className="min-h-screen bg-cursor-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cursor-surface border border-cursor-border flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-cursor-white mb-2">
                Verifying your email...
              </h1>
              <p className="text-cursor-text-secondary">
                Just a moment
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-xl font-semibold text-cursor-white mb-2">
                Email Verified!
              </h1>
              <p className="text-cursor-text-secondary mb-4">
                Welcome{investorName ? `, ${investorName}` : ""}! Redirecting you to the pitch deck...
              </p>
              <div className="flex items-center justify-center gap-2 text-cursor-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading deck...</span>
              </div>
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
              <Link href="/invest" className="btn-primary">
                Request New Link
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-cursor-muted text-sm hover:text-cursor-text transition-colors">
            Back to Headless Markets
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
