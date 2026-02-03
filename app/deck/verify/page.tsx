"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve the token when redirecting
    const token = searchParams.get("token");
    const redirectUrl = token ? `/pitchdeck/verify?token=${token}` : "/pitchdeck";
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-cursor-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
    </main>
  );
}

// Redirect /deck/verify to /pitchdeck/verify
export default function DeckVerifyRedirect() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cursor-bg flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
        </main>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
