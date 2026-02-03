"use client";

import { useParams } from "next/navigation";
import { useMarket, useMarketPrice } from "@/hooks";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  TrendingUp,
  Users,
  Coins,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function MarketDetailPage() {
  const params = useParams();
  const address = params.address as string;
  const { isConnected } = useAccount();

  const { data: market, isLoading, error } = useMarket(address);
  const { data: priceData } = useMarketPrice(address);

  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  if (isLoading) {
    return (
      <main className="min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </main>
    );
  }

  if (error || !market) {
    return (
      <main className="min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Market Not Found</h2>
            <p className="text-dark-400 mb-6">
              The market you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Link href="/" className="btn-primary">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progressPercent = (market.ethRaised / market.targetRaise) * 100;

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
          {/* Back Link */}
          <Link
            href="/#markets"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Markets
          </Link>

          {/* Market Header */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{market.name}</h1>
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                    ${market.symbol}
                  </span>
                  {market.graduated && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Graduated
                    </span>
                  )}
                </div>
                <p className="text-dark-400">{market.thesis}</p>
              </div>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2 w-fit"
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
                <div className="stat-card">
                  <div className="stat-value">
                    {priceData?.pricePerToken.toFixed(6) ?? market.currentPrice.toFixed(6)}
                  </div>
                  <div className="stat-label">Current Price (ETH)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{market.ethRaised.toFixed(2)}</div>
                  <div className="stat-label">ETH Raised</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{market.tokensSold.toLocaleString()}</div>
                  <div className="stat-label">Tokens Sold</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{market.quorumAgents.length}</div>
                  <div className="stat-label">AO Members</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-dark-400">Graduation Progress</span>
                  <span className="font-medium">
                    {market.ethRaised.toFixed(2)} / {market.targetRaise} ETH
                  </span>
                </div>
                <div className="h-4 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-dark-500 text-sm mt-2">
                  {progressPercent >= 100
                    ? "This market has graduated to Uniswap!"
                    : `${(100 - progressPercent).toFixed(1)}% remaining until graduation`}
                </p>
              </div>

              {/* Bonding Curve Visualization */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Bonding Curve
                </h2>
                <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center">
                  <p className="text-dark-500">
                    Price increases as more tokens are purchased
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-dark-500">Base Price:</span>
                    <span className="ml-2">0.0001 ETH</span>
                  </div>
                  <div>
                    <span className="text-dark-500">Target Raise:</span>
                    <span className="ml-2">{market.targetRaise} ETH</span>
                  </div>
                </div>
              </div>

              {/* AO Members */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  AO Members
                </h2>
                <div className="space-y-3">
                  {market.quorumAgents.map((agent, index) => (
                    <div
                      key={agent}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium">Agent #{index + 1}</p>
                          <p className="text-sm text-dark-500 font-mono">
                            {agent.slice(0, 6)}...{agent.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://basescan.org/address/${agent}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Buy/Sell */}
            <div className="space-y-6">
              {/* Buy/Sell Panel */}
              <div className="card p-6 sticky top-24">
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab("buy")}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      activeTab === "buy"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-dark-800 text-dark-400 hover:text-white"
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setActiveTab("sell")}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      activeTab === "sell"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-dark-800 text-dark-400 hover:text-white"
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {market.graduated ? (
                  <div className="text-center py-8">
                    <Coins className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                    <p className="text-dark-400 mb-4">
                      This market has graduated to Uniswap
                    </p>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      Trade on Uniswap
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : activeTab === "buy" ? (
                  <div>
                    <label className="block text-dark-400 text-sm mb-2">
                      Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 mb-4"
                    />

                    <div className="bg-dark-800 rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-500">You'll receive (est.)</span>
                        <span>
                          {buyAmount
                            ? (parseFloat(buyAmount) / (priceData?.pricePerToken || market.currentPrice)).toFixed(2)
                            : "0"}{" "}
                          {market.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-500">Price per token</span>
                        <span>
                          {(priceData?.pricePerToken || market.currentPrice).toFixed(6)} ETH
                        </span>
                      </div>
                    </div>

                    {isConnected ? (
                      <button className="btn-primary w-full bg-green-600 hover:bg-green-500">
                        Buy {market.symbol}
                      </button>
                    ) : (
                      <ConnectKitButton.Custom>
                        {({ show }) => (
                          <button onClick={show} className="btn-primary w-full">
                            Connect Wallet to Buy
                          </button>
                        )}
                      </ConnectKitButton.Custom>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-dark-400 text-sm mb-2">
                      Amount ({market.symbol})
                    </label>
                    <input
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 mb-4"
                    />

                    <div className="bg-dark-800 rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-500">You'll receive (est.)</span>
                        <span>
                          {sellAmount
                            ? (parseFloat(sellAmount) * (priceData?.pricePerToken || market.currentPrice) * 0.995).toFixed(6)
                            : "0"}{" "}
                          ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-500">Protocol fee</span>
                        <span>0.5%</span>
                      </div>
                    </div>

                    {isConnected ? (
                      <button className="btn-primary w-full bg-red-600 hover:bg-red-500">
                        Sell {market.symbol}
                      </button>
                    ) : (
                      <ConnectKitButton.Custom>
                        {({ show }) => (
                          <button onClick={show} className="btn-primary w-full">
                            Connect Wallet to Sell
                          </button>
                        )}
                      </ConnectKitButton.Custom>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
