"use client";

import { useQuery } from "@tanstack/react-query";
import { api, Market } from "@/lib/api";

/**
 * Hook to fetch list of markets
 */
export function useMarkets(params?: { graduated?: boolean; limit?: number }) {
  return useQuery({
    queryKey: ["markets", params],
    queryFn: () => api.markets.list(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to fetch a single market by address
 */
export function useMarket(address: string) {
  return useQuery({
    queryKey: ["market", address],
    queryFn: () => api.markets.get(address),
    enabled: !!address,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Hook to fetch current price for a market
 */
export function useMarketPrice(address: string, amount = 1) {
  return useQuery({
    queryKey: ["market-price", address, amount],
    queryFn: () => api.markets.getPrice(address, amount),
    enabled: !!address,
    staleTime: 5 * 1000, // 5 seconds - prices change frequently
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
}
