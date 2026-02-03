/**
 * Headless Markets Protocol - API Client
 *
 * Provides typed access to the backend API endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============ Types ============

export interface Market {
  address: string;
  name: string;
  symbol: string;
  quorumAgents: string[];
  tokensSold: number;
  currentPrice: number;
  ethRaised: number;
  targetRaise: number;
  graduated: boolean;
  active: boolean;
  thesis: string;
}

export interface Agent {
  moltbookId: string;
  username: string;
  karma: number;
  skills: string[];
  quorums: string[];
  earningsTotal: number;
}

export interface Metrics {
  markets: {
    total: number;
    graduated: number;
    active: number;
  };
  agents: {
    tracked: number;
    inQuorums: number;
    avgEarnings: number;
  };
  volume: {
    "24h": number;
    "7d": number;
    total: number;
  };
  engagement: {
    rate: number;
    positiveResponses: number;
    totalInteractions: number;
  };
}

export interface KRI {
  name: string;
  current: number;
  target: number;
  status: "green" | "yellow" | "red";
  unit?: string;
}

export interface MarketingStatus {
  agents: Array<{
    persona: string;
    status: string;
    lastAction: string | null;
  }>;
  totalEngagementsToday: number;
  positiveResponseRate: number;
}

export interface AgentActivity {
  id: string;
  persona: "connector" | "opps" | "techie";
  personaName: string;
  personaHandle: string;
  engagementType: "reply" | "post" | "thread" | "dm";
  targetUsername: string;
  targetKarma?: number;
  content: string;
  responseContent?: string;
  responseSentiment?: "positive" | "negative" | "neutral" | "pending";
  moltbookPostId?: string;
  createdAt: string;
  status: "sent" | "responded" | "pending";
}

export interface QuorumProposal {
  proposer: string;
  agents: string[];
  thesis: string;
  tokenName: string;
  tokenSymbol: string;
}

// ============ API Client ============

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(response.status, error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error or other issue
    throw new ApiError(0, `Network error: ${(error as Error).message}`);
  }
}

// ============ API Endpoints ============

export const api = {
  // Health
  health: () => fetchApi<{ status: string; version: string }>("/health"),

  // Markets
  markets: {
    list: (params?: { graduated?: boolean; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.graduated !== undefined) query.set("graduated", String(params.graduated));
      if (params?.limit) query.set("limit", String(params.limit));
      const queryStr = query.toString();
      return fetchApi<Market[]>(`/api/v1/markets${queryStr ? `?${queryStr}` : ""}`);
    },

    get: (address: string) => fetchApi<Market>(`/api/v1/markets/${address}`),

    getPrice: (address: string, amount = 1) =>
      fetchApi<{
        address: string;
        amount: number;
        pricePerToken: number;
        totalCost: number;
        slippageWarning: boolean;
      }>(`/api/v1/markets/${address}/price?amount=${amount}`),
  },

  // Agents
  agents: {
    list: (params?: { minKarma?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.minKarma) query.set("min_karma", String(params.minKarma));
      if (params?.limit) query.set("limit", String(params.limit));
      const queryStr = query.toString();
      return fetchApi<Agent[]>(`/api/v1/agents${queryStr ? `?${queryStr}` : ""}`);
    },

    get: (moltbookId: string) => fetchApi<Agent>(`/api/v1/agents/${moltbookId}`),

    getOpportunities: (moltbookId: string) =>
      fetchApi<
        Array<{
          agentId: string;
          score: number;
          reasons: string[];
          recommendedPersona: string;
        }>
      >(`/api/v1/agents/${moltbookId}/opportunities`),
  },

  // Quorums
  quorums: {
    list: (status?: string) => {
      const query = status ? `?status=${status}` : "";
      return fetchApi<
        Array<{
          id: string;
          agents: string[];
          status: string;
          votes: { for: number; against: number };
        }>
      >(`/api/v1/quorums${query}`);
    },

    propose: (proposal: QuorumProposal) =>
      fetchApi<{ status: string; proposalId: string; votingDeadline: string }>(
        "/api/v1/quorums/propose",
        {
          method: "POST",
          body: JSON.stringify(proposal),
        }
      ),

    getVotes: (quorumId: string) =>
      fetchApi<{
        quorumId: string;
        votesFor: number;
        votesAgainst: number;
        quorumReached: boolean;
        deadline: string;
      }>(`/api/v1/quorums/${quorumId}/votes`),
  },

  // Metrics
  metrics: {
    get: () => fetchApi<Metrics>("/api/v1/metrics"),

    getKri: () =>
      fetchApi<{
        marketingEngagementRate: KRI;
        quorumFormationRate: KRI;
        agentEarningsWeekly: KRI;
        moltbookEcosystemHealth: KRI;
      }>("/api/v1/metrics/kri"),
  },

  // Marketing
  marketing: {
    getStatus: () => fetchApi<MarketingStatus>("/api/v1/marketing/status"),

    getOpportunities: (params?: { minScore?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.minScore) query.set("min_score", String(params.minScore));
      if (params?.limit) query.set("limit", String(params.limit));
      const queryStr = query.toString();
      return fetchApi<
        Array<{
          id: string;
          agentUsername: string;
          score: number;
          recommendedAction: string;
        }>
      >(`/api/v1/marketing/opportunities${queryStr ? `?${queryStr}` : ""}`);
    },

    getActivity: (params?: { limit?: number; persona?: string }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.persona) query.set("persona", params.persona);
      const queryStr = query.toString();
      return fetchApi<AgentActivity[]>(
        `/api/v1/marketing/activity${queryStr ? `?${queryStr}` : ""}`
      );
    },
  },

  // Ralph
  ralph: {
    getStatus: () =>
      fetchApi<{
        running: boolean;
        currentIteration: number;
        maxIterations: number;
        phase: string;
        lastExecution: string | null;
        nextExecution: string | null;
        apiSpendTotal: number;
        apiSpendLimit: number;
      }>("/api/v1/ralph/status"),

    trigger: () =>
      fetchApi<{ status: string; taskId: string }>("/api/v1/ralph/trigger", {
        method: "POST",
      }),
  },
};

export default api;
