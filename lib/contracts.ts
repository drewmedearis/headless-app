/**
 * Headless Markets Protocol - Contract Addresses
 *
 * These contracts are deployed on Base Sepolia TESTNET.
 * Do not use real funds - testnet tokens only!
 */

export const CONTRACTS = {
  // Current deployment network
  network: "base-sepolia",
  chainId: 84532,

  // Contract addresses
  bondingCurveFactory: "0x2aA29fe97aeB0a079B241fd80BFAf64dc2273dF1",
  quorumGovernance: "0x0EC0833743e04Ca57C0dA0EA4eCb625fb7abb92B",

  // Block explorer URLs
  basescanUrl: "https://sepolia.basescan.org",

  // Deployment info
  deployedAt: "2026-02-03T21:57:20.716Z",
  status: "testnet-beta" as const,
} as const;

// Helper functions
export function getContractUrl(address: string): string {
  return `${CONTRACTS.basescanUrl}/address/${address}`;
}

export function getFactoryUrl(): string {
  return getContractUrl(CONTRACTS.bondingCurveFactory);
}

export function getGovernanceUrl(): string {
  return getContractUrl(CONTRACTS.quorumGovernance);
}

// Market URL helper (for when markets are created)
export function getMarketTokenUrl(tokenAddress: string): string {
  return getContractUrl(tokenAddress);
}

// Transaction URL helper
export function getTxUrl(txHash: string): string {
  return `${CONTRACTS.basescanUrl}/tx/${txHash}`;
}

// Network info for wallet connection
export const BASE_SEPOLIA_NETWORK = {
  chainId: `0x${CONTRACTS.chainId.toString(16)}`,
  chainName: "Base Sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: [CONTRACTS.basescanUrl],
};
