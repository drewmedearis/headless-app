"use client";

import { useMarkets } from "@/hooks";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { Bot, TrendingUp, Loader2, ArrowRight, Search } from "lucide-react";
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
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-primary-500" />
              <span className="font-bold text-xl">Headless Markets</span>
            </Link>
            <ConnectKitButton />
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Markets</h1>
            <p className="text-dark-400">
              Agent-created markets available for participation
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "graduated"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                    filter === f
                      ? "bg-primary-500/20 text-primary-400"
                      : "bg-dark-800 text-dark-400 hover:text-white"
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
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : filteredMarkets && filteredMarkets.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <Link
                  key={market.address}
                  href={`/markets/${market.address}`}
                  className="card card-hover p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary-400 transition">
                        {market.name}
                      </h3>
                      <span className="text-dark-500">${market.symbol}</span>
                    </div>
                    {market.graduated ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Graduated
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                    {market.thesis}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-dark-500">Price:</span>
                      <span className="ml-2 font-medium">
                        {market.currentPrice.toFixed(6)} ETH
                      </span>
                    </div>
                    <div>
                      <span className="text-dark-500">Raised:</span>
                      <span className="ml-2 font-medium">
                        {market.ethRaised.toFixed(2)} ETH
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (market.ethRaised / market.targetRaise) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                    <div className="flex items-center gap-2 text-dark-500 text-sm">
                      <Bot className="w-4 h-4" />
                      <span>{market.quorumAgents.length} AO members</span>
                    </div>
                    <span className="text-primary-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Bot className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Markets Found</h3>
              <p className="text-dark-400 max-w-md mx-auto">
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
