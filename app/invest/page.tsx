"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Redirect /invest to /pitchdeck
export default function InvestRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pitchdeck");
  }, [router]);

  return (
    <main className="min-h-screen bg-cursor-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
    </main>
  );
}
