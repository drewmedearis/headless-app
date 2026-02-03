"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

/**
 * Hook to fetch protocol metrics
 */
export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: () => api.metrics.get(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to fetch Key Risk Indicators
 */
export function useKri() {
  return useQuery({
    queryKey: ["kri"],
    queryFn: () => api.metrics.getKri(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
}

/**
 * Hook to fetch marketing agent status
 */
export function useMarketingStatus() {
  return useQuery({
    queryKey: ["marketing-status"],
    queryFn: () => api.marketing.getStatus(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to fetch Ralph loop status
 */
export function useRalphStatus() {
  return useQuery({
    queryKey: ["ralph-status"],
    queryFn: () => api.ralph.getStatus(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
