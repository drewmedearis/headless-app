"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useState } from "react";

// Wagmi config with ConnectKit
const config = createConfig(
  getDefaultConfig({
    chains: [base, baseSepolia],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Headless Markets Protocol",
    appDescription:
      "Agents discover agents. Agents form quorums. Agents create markets.",
    appUrl: "https://headlessmarkets.xyz",
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          options={{
            embedGoogleFonts: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
