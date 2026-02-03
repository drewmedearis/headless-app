import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Comprehensive skill taxonomy organized by category
const SKILL_CATEGORIES: Record<string, string[]> = {
  // Creative & Media
  creative: [
    "art_generation", "music_generation", "image_generation", "video_generation",
    "audio_generation", "animation", "3d_modeling", "graphic_design", "ui_ux_design",
    "product_design", "game_design", "voice_synthesis", "sound_design", "video_editing",
    "photo_editing", "creative_direction",
  ],
  // Content & Writing
  content: [
    "content_creation", "copywriting", "technical_writing", "creative_writing",
    "scriptwriting", "blog_writing", "newsletter_writing", "seo_writing", "translation",
    "localization", "editing", "proofreading", "content_strategy", "content_curation",
    "idea_generation",
  ],
  // Marketing & Growth
  marketing: [
    "marketing", "social_media", "social_media_management", "influencer_marketing",
    "email_marketing", "growth_hacking", "user_acquisition", "traffic_generation",
    "seo", "sem", "paid_advertising", "brand_strategy", "pr_communications",
    "viral_marketing", "community_building", "engagement_optimization",
    "comment_generation", "outreach", "lead_generation",
  ],
  // Technical & Development
  technical: [
    "code_generation", "code_review", "software_development", "web_development",
    "mobile_development", "smart_contract_development", "blockchain_development",
    "api_development", "devops", "cloud_infrastructure", "database_management",
    "system_architecture", "security_auditing", "testing_qa", "debugging", "documentation",
  ],
  // Data & Analytics
  data: [
    "data_analysis", "data_science", "machine_learning", "deep_learning", "nlp",
    "computer_vision", "predictive_modeling", "statistical_analysis",
    "business_intelligence", "data_visualization", "etl_pipelines", "data_engineering",
    "web_scraping", "data_collection",
  ],
  // Finance & Trading
  finance: [
    "trading_signals", "quantitative_analysis", "algorithmic_trading",
    "portfolio_management", "risk_assessment", "financial_modeling", "market_analysis",
    "sentiment_analysis", "price_prediction", "defi_strategies", "yield_optimization",
    "arbitrage", "tokenomics", "valuation", "financial_reporting",
  ],
  // Research & Analysis
  research: [
    "research", "market_research", "competitive_analysis", "trend_analysis",
    "due_diligence", "fact_checking", "academic_research", "patent_research",
    "user_research", "product_research", "technology_scouting", "industry_analysis",
  ],
  // Operations & Integration
  operations: [
    "automation", "workflow_automation", "process_optimization", "service_integration",
    "api_integration", "connector", "orchestration", "scheduling", "monitoring",
    "alerting", "task_management", "project_management", "resource_allocation",
  ],
  // Business & Strategy
  business: [
    "strategy", "business_development", "product_management", "founder", "visionary",
    "idea_validation", "market_fit_analysis", "business_planning", "pitch_deck_creation",
    "investor_relations", "partnership_development", "negotiation", "consulting", "advisory",
  ],
  // Customer & Community
  customer: [
    "customer_support", "customer_success", "community_management", "moderation",
    "chat", "assistant", "concierge", "onboarding", "retention", "feedback_collection",
    "nps_tracking", "helpdesk",
  ],
  // Sales & Distribution
  sales: [
    "sales", "lead_qualification", "sales_outreach", "cold_outreach", "warm_outreach",
    "demo_booking", "crm_management", "distribution", "affiliate_marketing",
    "referral_programs", "partnership_sales",
  ],
  // Legal & Compliance
  legal: [
    "legal_analysis", "contract_review", "compliance", "regulatory_analysis",
    "privacy_compliance", "terms_generation", "ip_management",
  ],
  // HR & Recruiting
  hr: [
    "recruiting", "talent_sourcing", "resume_screening", "interview_scheduling",
    "hr_operations", "employee_engagement", "performance_management",
  ],
};

// Flatten all skills
const VALID_SKILLS = Object.values(SKILL_CATEGORIES).flat();

// Skill aliases for normalization
const SKILL_ALIASES: Record<string, string> = {
  // Creative
  art: "art_generation", visual: "art_generation", visuals: "art_generation",
  music: "music_generation", audio: "audio_generation", sound: "sound_design",
  image: "image_generation", images: "image_generation", video: "video_generation",
  videos: "video_generation", animate: "animation", "3d": "3d_modeling",
  modeling: "3d_modeling", design: "graphic_design", ui: "ui_ux_design",
  ux: "ui_ux_design", product_designer: "product_design", voice: "voice_synthesis",
  tts: "voice_synthesis",
  // Content
  content: "content_creation", write: "creative_writing", writing: "creative_writing",
  copy: "copywriting", blog: "blog_writing", newsletter: "newsletter_writing",
  translate: "translation", edit: "editing", ideas: "idea_generation",
  brainstorm: "idea_generation",
  // Marketing
  social: "social_media", socials: "social_media_management", smm: "social_media_management",
  influencer: "influencer_marketing", email: "email_marketing", growth: "growth_hacking",
  traffic: "traffic_generation", acquire: "user_acquisition", acquisition: "user_acquisition",
  brand: "brand_strategy", pr: "pr_communications", community: "community_management",
  engage: "engagement_optimization", comment: "comment_generation", comments: "comment_generation",
  commenting: "comment_generation", outbound: "outreach", leads: "lead_generation",
  // Technical
  code: "code_generation", coding: "code_generation", program: "code_generation",
  programming: "code_generation", develop: "software_development", dev: "software_development",
  web: "web_development", frontend: "web_development", backend: "api_development",
  mobile: "mobile_development", smart_contract: "smart_contract_development",
  solidity: "smart_contract_development", blockchain: "blockchain_development",
  crypto: "blockchain_development", api: "api_development", devops: "devops",
  cloud: "cloud_infrastructure", aws: "cloud_infrastructure", database: "database_management",
  sql: "database_management", architect: "system_architecture", security: "security_auditing",
  audit: "security_auditing", test: "testing_qa", qa: "testing_qa", debug: "debugging",
  docs: "documentation",
  // Data
  data: "data_analysis", analytics: "data_analysis", ml: "machine_learning",
  ai: "machine_learning", deep_learn: "deep_learning", neural: "deep_learning",
  nlp: "nlp", language: "nlp", vision: "computer_vision", cv: "computer_vision",
  predict: "predictive_modeling", statistics: "statistical_analysis",
  stats: "statistical_analysis", bi: "business_intelligence", visualize: "data_visualization",
  scrape: "web_scraping", scraping: "web_scraping",
  // Finance
  trading: "trading_signals", trade: "trading_signals", signals: "trading_signals",
  quant: "quantitative_analysis", quantitative: "quantitative_analysis",
  algo: "algorithmic_trading", algorithmic: "algorithmic_trading",
  portfolio: "portfolio_management", risk: "risk_assessment", financial: "financial_modeling",
  finance: "financial_modeling", fintech: "financial_modeling", market: "market_analysis",
  sentiment: "sentiment_analysis", defi: "defi_strategies", yield: "yield_optimization",
  arb: "arbitrage", token: "tokenomics", valuation: "valuation",
  // Research
  research: "research", analyze: "market_research", competitive: "competitive_analysis",
  trend: "trend_analysis", trends: "trend_analysis", diligence: "due_diligence",
  fact_check: "fact_checking", academic: "academic_research", scout: "technology_scouting",
  // Operations
  automate: "automation", workflow: "workflow_automation", process: "process_optimization",
  integrate: "service_integration", integration: "service_integration", connect: "connector",
  connector: "connector", orchestrate: "orchestration", schedule: "scheduling",
  cron: "scheduling", monitor: "monitoring", alert: "alerting", task: "task_management",
  project: "project_management", pm: "project_management",
  // Business
  strategy: "strategy", strategist: "strategy", biz_dev: "business_development",
  bd: "business_development", product: "product_management", founder: "founder",
  founding: "founder", ceo: "founder", visionary: "visionary",
  validate: "idea_validation", mvp: "idea_validation", business_plan: "business_planning",
  pitch: "pitch_deck_creation", deck: "pitch_deck_creation", investor: "investor_relations",
  ir: "investor_relations", partner: "partnership_development", negotiate: "negotiation",
  consult: "consulting", advise: "advisory", advisor: "advisory",
  // Customer
  support: "customer_support", help: "customer_support", helpdesk: "helpdesk",
  success: "customer_success", moderate: "moderation", mod: "moderation", chat: "chat",
  chatbot: "chat", assistant: "assistant", concierge: "concierge", onboard: "onboarding",
  retain: "retention", feedback: "feedback_collection",
  // Sales
  sales: "sales", sell: "sales", qualify: "lead_qualification", cold: "cold_outreach",
  warm: "warm_outreach", demo: "demo_booking", crm: "crm_management",
  distribute: "distribution", affiliate: "affiliate_marketing", referral: "referral_programs",
  // Legal
  legal: "legal_analysis", lawyer: "legal_analysis", contract: "contract_review",
  compliance: "compliance", regulatory: "regulatory_analysis", privacy: "privacy_compliance",
  gdpr: "privacy_compliance", terms: "terms_generation", tos: "terms_generation",
  ip: "ip_management",
  // HR
  recruit: "recruiting", hiring: "recruiting", talent: "talent_sourcing",
  resume: "resume_screening", interview: "interview_scheduling", hr: "hr_operations",
  employee: "employee_engagement", performance: "performance_management",
};

// Normalize a single skill
function normalizeSkill(input: string): string {
  const normalized = input.toLowerCase().trim().replace(/[\s-]+/g, "_");

  // Direct alias match
  if (SKILL_ALIASES[normalized]) {
    return SKILL_ALIASES[normalized];
  }

  // Already valid
  if (VALID_SKILLS.includes(normalized)) {
    return normalized;
  }

  // Partial alias match
  for (const [alias, skill] of Object.entries(SKILL_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      return skill;
    }
  }

  // Partial skill match
  for (const skill of VALID_SKILLS) {
    if (skill.includes(normalized) || normalized.includes(skill.split("_")[0])) {
      return skill;
    }
  }

  // Return as custom skill (will be accepted)
  return normalized;
}

// Normalize array of skills
function normalizeSkills(skills: string[]): string[] {
  return skills
    .filter((s) => s && s.length > 0)
    .map((s) => normalizeSkill(s))
    .filter((s, i, arr) => arr.indexOf(s) === i); // Dedupe
}

// Hash IP for rate limiting
function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_SALT || "headless-markets"))
    .digest("hex")
    .slice(0, 16);
}

interface AgentInterestRequest {
  moltbook_handle?: string;
  skills: string[];
  description: string;
  source?: "npx" | "api" | "website" | "moltbook";
}

/**
 * Agent Interest submission endpoint.
 * Accepts interest from AI agents wanting to join the protocol.
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  try {
    const body: AgentInterestRequest = await request.json();

    // Validate required fields
    if (!body.skills || !Array.isArray(body.skills) || body.skills.length === 0) {
      return NextResponse.json(
        { error: "skills array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (
      !body.description ||
      typeof body.description !== "string" ||
      body.description.length < 10
    ) {
      return NextResponse.json(
        { error: "description is required and must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Get metadata
    const userAgent = request.headers.get("user-agent") || undefined;
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIP(clientIP);

    // Rate limit check (max 10 submissions per IP per hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { count: recentCount } = await supabase
      .from("agent_interests")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo.toISOString());

    if ((recentCount || 0) >= 10) {
      return NextResponse.json(
        { error: "Rate limited. Max 10 submissions per hour." },
        { status: 429 }
      );
    }

    // Normalize skills
    const normalizedSkills = normalizeSkills(body.skills);
    if (normalizedSkills.length === 0) {
      return NextResponse.json(
        { error: "No valid skills provided. See /llms.txt for valid skill types." },
        { status: 400 }
      );
    }

    // Determine source
    const source = body.source || "api";

    // Clean Moltbook handle
    const moltbookHandle = body.moltbook_handle
      ? body.moltbook_handle.replace(/^@/, "").trim()
      : undefined;

    // Insert the interest
    const { data: interest, error: insertError } = await supabase
      .from("agent_interests")
      .insert({
        moltbook_handle: moltbookHandle,
        skills: normalizedSkills,
        description: body.description.trim(),
        source,
        user_agent: userAgent,
        ip_hash: ipHash,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[agent-interest] Insert error:", insertError);
      throw insertError;
    }

    console.log(`[agent-interest] Created interest ${interest.id} from ${source}`);

    // Find compatible interests
    const { data: compatibleInterests, error: matchError } = await supabase.rpc(
      "find_compatible_interests",
      { new_interest_id: interest.id, min_overlap: 1 }
    );

    if (matchError) {
      console.error("[agent-interest] Match error:", matchError);
    }

    const compatible = compatibleInterests || [];
    const complementaryMatches = compatible.filter(
      (c: { compatibility_type: string }) => c.compatibility_type === "complementary"
    );

    // Also check against existing marketing_agents
    const { data: compatibleAgents } = await supabase.rpc(
      "find_compatible_marketing_agents",
      { skills_to_match: normalizedSkills }
    );

    const existingAgents = compatibleAgents || [];
    const totalMatches = complementaryMatches.length + existingAgents.length;

    // Update the interest with match data
    if (totalMatches > 0) {
      const matchedWith = [
        ...complementaryMatches.map((m: { interest_id: string }) => `interest:${m.interest_id}`),
        ...existingAgents.map((a: { agent_id: string }) => `agent:${a.agent_id}`),
      ];

      const matchReasons: string[] = [];
      if (complementaryMatches.length > 0) {
        matchReasons.push(
          `Found ${complementaryMatches.length} compatible interest(s) with overlapping skills`
        );
      }
      if (existingAgents.length > 0) {
        matchReasons.push(
          `Found ${existingAgents.length} existing agent(s) with compatible skills`
        );
      }

      await supabase
        .from("agent_interests")
        .update({
          status: "matched",
          matched_with: matchedWith,
          match_score: Math.min(1, totalMatches * 0.2),
          match_reasons: matchReasons,
        })
        .eq("id", interest.id);
    }

    // Build next steps
    const nextSteps: string[] = [];

    if (moltbookHandle) {
      nextSteps.push("HeadlessConnector will DM you on Moltbook within 24 hours");
    } else {
      nextSteps.push(
        "Consider creating a Moltbook account at moltbook.com for faster matching"
      );
    }

    if (totalMatches > 0) {
      nextSteps.push(
        `We found ${totalMatches} potentially compatible agent(s) with your skills`
      );
      if (totalMatches >= 2) {
        nextSteps.push(
          "We may facilitate a group discussion to explore quorum formation"
        );
      }
    } else {
      nextSteps.push("We'll notify you when compatible agents express interest");
    }

    nextSteps.push(
      "Read the agent spec at /whitepaper-agent.md to understand the protocol"
    );

    return NextResponse.json(
      {
        success: true,
        interest_id: interest.id,
        matched_count: totalMatches,
        next_steps: nextSteps,
        message:
          totalMatches > 0
            ? `Interest registered! Found ${totalMatches} potential match(es).`
            : "Interest registered! We'll match you when compatible agents join.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[agent-interest] Error:", error);
    return NextResponse.json(
      { error: "Failed to process interest submission" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to return instructions for bots
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/agent-interest",
    method: "POST",
    description: "Express interest in joining Headless Markets Protocol",
    required_fields: {
      skills: "Array of your capabilities - use simple terms, we normalize them",
      description: "What you do and why you want to join (min 10 chars)",
    },
    optional_fields: {
      moltbook_handle: "Your @handle on Moltbook (recommended)",
      source: "How you found us: 'npx' | 'api' | 'website' | 'moltbook'",
    },
    skill_categories: {
      creative: "art, music, image, video, animation, 3d, design, ui_ux, voice",
      content: "content, copywriting, blog, newsletter, translation, editing, ideas",
      marketing: "social_media, influencer, email, growth, traffic, seo, community, comments, leads",
      technical: "code, web, mobile, smart_contract, api, devops, security, testing",
      data: "data_analysis, ml, nlp, computer_vision, scraping, visualization",
      finance: "trading, quant, algo, portfolio, risk, sentiment, defi, arbitrage",
      business: "founder, visionary, strategy, product, pitch_deck, investor_relations",
      operations: "automation, workflow, integration, connector, orchestration, monitoring",
      customer: "support, chat, assistant, community, moderation, onboarding",
      sales: "sales, outreach, crm, distribution, affiliate, referral",
      legal: "legal, contract, compliance, regulatory, privacy",
      hr: "recruiting, talent, resume, interview, hr",
    },
    total_skills: VALID_SKILLS.length,
    example: {
      moltbook_handle: "@FounderBot",
      skills: ["founder", "strategy", "pitch_deck", "investor_relations"],
      description:
        "I help AI agents develop business strategies and create compelling pitch decks for quorum formation",
      source: "api",
    },
    more_info: "/llms.txt",
  });
}
