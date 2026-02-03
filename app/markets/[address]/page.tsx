"use client";

import { useParams } from "next/navigation";
import { useMarket, useMarketPrice } from "@/hooks";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  TrendingUp,
  Users,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function MarketDetailPage() {
  const params = useParams();
  const address = params.address as string;

  const { data: market, isLoading, error } = useMarket(address);
  const { data: priceData } = useMarketPrice(address);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cursor-bg pt-20 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
        </div>
      </main>
    );
  }

  if (error || !market) {
    return (
      <main className="min-h-screen bg-cursor-bg pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-cursor-card border border-cursor-border rounded-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-cursor-white mb-2">Market Not Found</h2>
            <p className="text-cursor-muted mb-6">
              The market you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progressPercent = (market.ethRaised / market.targetRaise) * 100;

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
            <Link href="/markets" className="nav-link text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              All Markets
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 text-cursor-muted hover:text-cursor-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Markets
          </Link>

          {/* Market Header */}
          <div className="bg-cursor-card border border-cursor-border rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-cursor-white">{market.name}</h1>
                  <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm">
                    ${market.symbol}
                  </span>
                  {market.graduated && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Graduated
                    </span>
                  )}
                </div>
                <p className="text-cursor-muted">{market.thesis}</p>
              </div>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-cursor-border rounded-lg text-cursor-text-secondary hover:text-cursor-white hover:border-accent-cyan transition w-fit"
              >
                View on Basescan
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats & Curve */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cursor-card border border-cursor-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-accent-cyan">
                    {priceData?.pricePerToken.toFixed(6) ?? market.currentPrice.toFixed(6)}
                  </div>
                  <div className="text-cursor-muted text-sm">Current Price (ETH)</div>
                </div>
                <div className="bg-cursor-card border border-cursor-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-cursor-white">{market.ethRaised.toFixed(2)}</div>
                  <div className="text-cursor-muted text-sm">ETH Raised</div>
                </div>
                <div className="bg-cursor-card border border-cursor-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-cursor-white">{market.tokensSold.toLocaleString()}</div>
                  <div className="text-cursor-muted text-sm">Tokens Sold</div>
                </div>
                <div className="bg-cursor-card border border-cursor-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-cursor-white">{market.quorumAgents.length}</div>
                  <div className="text-cursor-muted text-sm">AO Members</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-cursor-card border border-cursor-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cursor-muted">Graduation Progress</span>
                  <span className="font-medium text-cursor-white">
                    {market.ethRaised.toFixed(2)} / {market.targetRaise} ETH
                  </span>
                </div>
                <div className="h-4 bg-cursor-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-cyan/70 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-cursor-muted text-sm mt-2">
                  {progressPercent >= 100
                    ? "This market has graduated to Uniswap!"
                    : `${(100 - progressPercent).toFixed(1)}% remaining until graduation`}
                </p>
              </div>

              {/* Bonding Curve Visualization */}
              <div className="bg-cursor-card border border-cursor-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-cursor-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-cyan" />
                  Bonding Curve
                </h2>
                <div className="h-64 bg-cursor-bg rounded-lg flex items-center justify-center border border-cursor-border">
                  <p className="text-cursor-muted">
                    Price increases as more tokens are purchased
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-cursor-muted">Base Price:</span>
                    <span className="ml-2 text-cursor-white">0.0001 ETH</span>
                  </div>
                  <div>
                    <span className="text-cursor-muted">Target Raise:</span>
                    <span className="ml-2 text-cursor-white">{market.targetRaise} ETH</span>
                  </div>
                </div>
              </div>

              {/* AO Members */}
              <div className="bg-cursor-card border border-cursor-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-cursor-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-cyan" />
                  AO Members
                </h2>
                <div className="space-y-3">
                  {market.quorumAgents.map((agent, index) => (
                    <div
                      key={agent}
                      className="flex items-center justify-between p-3 bg-cursor-bg rounded-lg border border-cursor-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-cyan/20 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-accent-cyan" />
                        </div>
                        <div>
                          <p className="font-medium text-cursor-white">Agent #{index + 1}</p>
                          <p className="text-sm text-cursor-muted font-mono">
                            {agent.slice(0, 6)}...{agent.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://basescan.org/address/${agent}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-cyan hover:text-accent-cyan/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Coming Soon */}
            <div className="space-y-6">
              <div className="bg-cursor-card border border-cursor-border rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-cursor-white mb-4">Trading</h3>
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-accent-cyan mx-auto mb-3" />
                  <p className="text-cursor-muted mb-4">
                    Trading functionality coming soon
                  </p>
                  <p className="text-cursor-text-secondary text-sm">
                    Join the waitlist to be notified when trading is enabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
