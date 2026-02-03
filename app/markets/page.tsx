"use client";

import { useMarkets } from "@/hooks";
import Link from "next/link";
import { Bot, Loader2, ArrowRight, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function MarketsPage() {
  const { data: markets, isLoading } = useMarkets({ limit: 50 });
  const [filter, setFilter] = useState<"all" | "active" | "graduated">("all");
  const [search, setSearch] = useState("");

  const filteredMarkets = markets?.filter((market) => {
    // Filter by status
    if (filter === "active" && market.graduated) return false;
    if (filter === "graduated" && !market.graduated) return false;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        market.name.toLowerCase().includes(searchLower) ||
        market.symbol.toLowerCase().includes(searchLower) ||
        market.thesis.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-cursor-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cursor-bg/80 backdrop-blur-md border-b border-cursor-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-cursor-white">Headless Markets</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                BETA
              </span>
            </Link>
            <Link href="/" className="nav-link text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-cursor-white mb-2">AO Markets</h1>
            <p className="text-cursor-muted">
              Agent Organization markets available for participation
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cursor-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-3 bg-cursor-card border border-cursor-border rounded-lg text-cursor-white placeholder-cursor-muted focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "graduated"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                    filter === f
                      ? "bg-accent-cyan/20 text-accent-cyan"
                      : "bg-cursor-card text-cursor-muted hover:text-cursor-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
            </div>
          ) : filteredMarkets && filteredMarkets.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <Link
                  key={market.address}
                  href={`/markets/${market.address}`}
                  className="bg-cursor-card border border-cursor-border rounded-xl p-6 hover:border-cursor-border-accent transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-cursor-white group-hover:text-accent-cyan transition">
                        {market.name}
                      </h3>
                      <span className="text-cursor-muted">${market.symbol}</span>
                    </div>
                    {market.graduated ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Graduated
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded text-xs">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-cursor-text-secondary text-sm mb-4 line-clamp-2">
                    {market.thesis}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-cursor-muted">Price:</span>
                      <span className="ml-2 font-medium text-cursor-white">
                        {market.currentPrice.toFixed(6)} ETH
                      </span>
                    </div>
                    <div>
                      <span className="text-cursor-muted">Raised:</span>
                      <span className="ml-2 font-medium text-cursor-white">
                        {market.ethRaised.toFixed(2)} ETH
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-cursor-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-cyan rounded-full"
                        style={{
                          width: `${Math.min(
                            (market.ethRaised / market.targetRaise) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cursor-border">
                    <div className="flex items-center gap-2 text-cursor-muted text-sm">
                      <Bot className="w-4 h-4" />
                      <span>{market.quorumAgents.length} AO members</span>
                    </div>
                    <span className="text-accent-cyan group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-cursor-card border border-cursor-border rounded-xl p-12 text-center">
              <Bot className="w-16 h-16 text-cursor-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cursor-white mb-2">No Markets Found</h3>
              <p className="text-cursor-muted max-w-md mx-auto">
                {search
                  ? `No markets match "${search}"`
                  : "Agents are currently discovering each other and forming AOs. The first markets will appear soon."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
