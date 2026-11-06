import { formatNumber } from "@/lib/utils";

// ==========================================
// Types
// ==========================================

export interface DeveloperBadgeData {
  username: string;
  name: string;
  score: number;
  rankTitle: string;
  personaTitle: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND" | "LEGENDARY";
  totalCommits: number;
  totalStars: number;
  totalPRs: number;
  streak: number;
}

// ==========================================
// XML / SVG Sanitizer
// ==========================================

export function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ==========================================
// Tier Colors & Themes
// ==========================================

const TIER_COLORS: Record<string, { primary: string; secondary: string; border: string }> = {
  LEGENDARY: { primary: "#F59E0B", secondary: "#EF4444", border: "rgba(245, 158, 11, 0.4)" },
  DIAMOND: { primary: "#38BDF8", secondary: "#818CF8", border: "rgba(56, 189, 248, 0.4)" },
  GOLD: { primary: "#FBBF24", secondary: "#F59E0B", border: "rgba(251, 191, 36, 0.4)" },
  SILVER: { primary: "#94A3B8", secondary: "#64748B", border: "rgba(148, 163, 184, 0.4)" },
  BRONZE: { primary: "#CD7F32", secondary: "#A0522D", border: "rgba(205, 127, 50, 0.4)" },
};

// ==========================================
// SVG Generators
// ==========================================

export function generateBadgeSvg(data: DeveloperBadgeData, theme = "dark"): string {
  const safeName = escapeXml(data.name || data.username);
  const safeUsername = escapeXml(data.username);
  const safePersona = escapeXml(data.personaTitle || "Developer");
  const safeRank = escapeXml(data.rankTitle || "Active Contributor");
  const tierConfig = TIER_COLORS[data.tier] || TIER_COLORS.GOLD;

  const score = Math.max(0, Math.min(100, Math.round(data.score)));
  // Circumference = 2 * PI * 34 = ~213.63
  const circumference = 213.63;
  const strokeDashoffset = (circumference * (1 - score / 100)).toFixed(1);

  const formattedCommits = formatNumber(data.totalCommits || 0);
  const formattedStars = formatNumber(data.totalStars || 0);
  const formattedPRs = formatNumber(data.totalPRs || 0);
  const formattedStreak = formatNumber(data.streak || 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none" role="img" aria-label="CodePulse Developer Badge for ${safeUsername}">
  <title>CodePulse Developer Badge - ${safeUsername}</title>
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#070B14" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${tierConfig.primary}" />
      <stop offset="100%" stop-color="${tierConfig.secondary}" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${tierConfig.border}" />
      <stop offset="50%" stop-color="rgba(255, 255, 255, 0.08)" />
      <stop offset="100%" stop-color="rgba(139, 92, 246, 0.3)" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .header-tag { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; fill: #A78BFA; letter-spacing: 1.5px; text-transform: uppercase; }
    .dev-name { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 700; fill: #F8FAFC; }
    .dev-user { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #94A3B8; }
    .tier-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; fill: #E0E7FF; }
    .score-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 700; fill: #94A3B8; letter-spacing: 1px; text-transform: uppercase; }
    .score-num { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; fill: #FFFFFF; }
    .rank-val { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; fill: #38BDF8; }
    .stat-lbl { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 500; fill: #94A3B8; }
    .stat-val { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; fill: #F1F5F9; }
    .brand-foot { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 500; fill: #64748B; }
  </style>

  <!-- Card Background -->
  <rect x="1" y="1" width="493" height="193" rx="16" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="1.5" />

  <!-- Background Decorative Ambient Glows -->
  <circle cx="75" cy="100" r="50" fill="${tierConfig.primary}" opacity="0.08" filter="url(#subtleGlow)" />
  <circle cx="420" cy="130" r="45" fill="#8B5CF6" opacity="0.06" filter="url(#subtleGlow)" />

  <!-- Top Bar: Logo & Brand -->
  <g transform="translate(20, 22)">
    <path d="M0 7h4l2.5-6 3.5 12 2.5-8 1.5 2h4" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <text x="24" y="10" class="header-tag">CodePulse Analytics</text>
  </g>

  <!-- Top Right: Persona Badge Pill -->
  <g transform="translate(325, 14)">
    <rect x="0" y="0" width="150" height="24" rx="12" fill="rgba(139, 92, 246, 0.12)" stroke="rgba(167, 139, 250, 0.3)" stroke-width="1" />
    <circle cx="12" cy="12" r="3.5" fill="${tierConfig.primary}" />
    <text x="22" y="16" class="tier-text">${safePersona}</text>
  </g>

  <!-- Left: Developer Info & Score Gauge -->
  <g transform="translate(20, 50)">
    <text x="0" y="16" class="dev-name">${safeName}</text>
    <text x="0" y="34" class="dev-user">@${safeUsername}</text>

    <!-- Score Circular Gauge -->
    <g transform="translate(6, 46)">
      <!-- Background Track -->
      <circle cx="38" cy="38" r="34" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="5.5" />
      <!-- Animated / Measured Progress Arc -->
      <circle cx="38" cy="38" r="34" fill="none" stroke="url(#primaryGrad)" stroke-width="5.5"
        stroke-linecap="round" stroke-dasharray="213.63" stroke-dashoffset="${strokeDashoffset}"
        transform="rotate(-90 38 38)" />
      <!-- Inner Score Text -->
      <text x="38" y="44" text-anchor="middle" class="score-num">${score}</text>
      <text x="38" y="24" text-anchor="middle" class="score-title">Pulse</text>
    </g>

    <!-- Rank & Tier Information -->
    <g transform="translate(94, 68)">
      <text x="0" y="0" class="score-title">GLOBAL RANK</text>
      <text x="0" y="15" class="rank-val">${safeRank}</text>
      <text x="0" y="30" class="dev-user">${data.tier} Tier</text>
    </g>
  </g>

  <!-- Vertical Divider Line -->
  <line x1="245" y1="52" x2="245" y2="162" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1" />

  <!-- Right: 2x2 Metric Tiles -->
  <g transform="translate(265, 54)">
    <!-- Commits Tile -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="102" height="48" rx="8" fill="rgba(255, 255, 255, 0.025)" stroke="rgba(255, 255, 255, 0.06)" />
      <g transform="translate(10, 16)">
        <path d="M5 0a3 3 0 0 0-2.83 2H0v2h2.17A3 3 0 0 0 5 6a3 3 0 0 0 2.83-2H10V2H7.83A3 3 0 0 0 5 0z" fill="#8B5CF6" />
        <text x="16" y="4" class="stat-lbl">Commits</text>
      </g>
      <text x="10" y="40" class="stat-val">${formattedCommits}</text>
    </g>

    <!-- Stars Tile -->
    <g transform="translate(112, 0)">
      <rect x="0" y="0" width="102" height="48" rx="8" fill="rgba(255, 255, 255, 0.025)" stroke="rgba(255, 255, 255, 0.06)" />
      <g transform="translate(10, 16)">
        <polygon points="5,0.5 6.5,3.8 10,4.2 7.5,6.6 8.2,10 5,8.2 1.8,10 2.5,6.6 0,4.2 3.5,3.8" fill="#F59E0B" />
        <text x="16" y="4" class="stat-lbl">Stars</text>
      </g>
      <text x="10" y="40" class="stat-val">${formattedStars}</text>
    </g>

    <!-- Pull Requests Tile -->
    <g transform="translate(0, 56)">
      <rect x="0" y="0" width="102" height="48" rx="8" fill="rgba(255, 255, 255, 0.025)" stroke="rgba(255, 255, 255, 0.06)" />
      <g transform="translate(10, 16)">
        <circle cx="3" cy="3" r="2.5" fill="none" stroke="#10B981" stroke-width="1.5" />
        <circle cx="3" cy="11" r="2.5" fill="none" stroke="#10B981" stroke-width="1.5" />
        <path d="M3 5.5v3M8 6a2 2 0 0 0-2-2H4.5" fill="none" stroke="#10B981" stroke-width="1.5" />
        <text x="16" y="4" class="stat-lbl">PRs</text>
      </g>
      <text x="10" y="40" class="stat-val">${formattedPRs}</text>
    </g>

    <!-- Streak Tile -->
    <g transform="translate(112, 56)">
      <rect x="0" y="0" width="102" height="48" rx="8" fill="rgba(255, 255, 255, 0.025)" stroke="rgba(255, 255, 255, 0.06)" />
      <g transform="translate(10, 16)">
        <path d="M4 0C4 2 2 3.5 2 5.5a3 3 0 0 0 6 0C8 3 5.5 2 5.5 0z" fill="#EC4899" />
        <text x="16" y="4" class="stat-lbl">Streak</text>
      </g>
      <text x="10" y="40" class="stat-val">${formattedStreak} days</text>
    </g>
  </g>

  <!-- Footer Branding -->
  <g transform="translate(20, 180)">
    <text x="0" y="0" class="brand-foot">codepulse.dev • Verified GitHub Developer Analytics</text>
    <text x="455" y="0" text-anchor="end" class="brand-foot">Tier: ${data.tier}</text>
  </g>
</svg>`;
}

export function generateFallbackSvg(username: string): string {
  const safeUsername = escapeXml(username || "unknown");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none" role="img" aria-label="CodePulse Badge - User Not Found">
  <title>CodePulse Developer Badge - User Not Found</title>
  <defs>
    <linearGradient id="fallbackBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="fallbackBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(239, 68, 68, 0.4)" />
      <stop offset="100%" stop-color="rgba(245, 158, 11, 0.3)" />
    </linearGradient>
  </defs>

  <style>
    .header-tag { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; fill: #F59E0B; letter-spacing: 1.5px; text-transform: uppercase; }
    .warn-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 700; fill: #F8FAFC; }
    .warn-sub { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 500; fill: #94A3B8; }
    .warn-hint { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 400; fill: #64748B; }
    .pill-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; fill: #FCA5A5; }
  </style>

  <!-- Card Background -->
  <rect x="1" y="1" width="493" height="193" rx="16" fill="url(#fallbackBg)" stroke="url(#fallbackBorder)" stroke-width="1.5" />

  <!-- Top Bar -->
  <g transform="translate(20, 22)">
    <path d="M0 7h4l2.5-6 3.5 12 2.5-8 1.5 2h4" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <text x="24" y="10" class="header-tag">CodePulse Analytics</text>
  </g>

  <!-- Top Right Warning Pill -->
  <g transform="translate(335, 14)">
    <rect x="0" y="0" width="140" height="24" rx="12" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.3)" stroke-width="1" />
    <circle cx="12" cy="12" r="3.5" fill="#EF4444" />
    <text x="22" y="16" class="pill-text">User Not Found</text>
  </g>

  <!-- Warning Content -->
  <g transform="translate(45, 76)">
    <!-- Warning Circle Icon -->
    <circle cx="24" cy="24" r="22" fill="rgba(245, 158, 11, 0.1)" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1.5" />
    <path d="M24 15v11M24 30v2" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />

    <g transform="translate(60, 10)">
      <text x="0" y="4" class="warn-title">Developer Not Found</text>
      <text x="0" y="24" class="warn-sub">Could not locate GitHub profile for &ldquo;@${safeUsername}&rdquo;</text>
      <text x="0" y="42" class="warn-hint">Please verify your username spelling or join codepulse.dev</text>
    </g>
  </g>

  <!-- Footer -->
  <g transform="translate(20, 180)">
    <text x="0" y="0" class="warn-hint">codepulse.dev • Real-time GitHub Analytics</text>
  </g>
</svg>`;
}

// ==========================================
// Data Fetcher
// ==========================================

async function fetchDeveloperData(username: string): Promise<DeveloperBadgeData | null> {
  const githubToken = process.env.GITHUB_TOKEN || "";
  const backendBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

  // 1. Try fetching from NestJS backend if available
  if (backendBase) {
    try {
      const backendUrl = `${backendBase.replace(/\/$/, "")}/github/developer?username=${encodeURIComponent(username)}`;
      const res = await fetch(backendUrl, {
        headers: githubToken ? { Authorization: `Bearer ${githubToken}` } : {},
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const payload = await res.json();
        const data = payload && payload.data ? payload.data : payload;
        if (data && data.username) {
          const score = typeof data.score === "number" ? data.score : 50;
          let tier: DeveloperBadgeData["tier"] = "GOLD";
          if (score >= 90) tier = "LEGENDARY";
          else if (score >= 75) tier = "DIAMOND";
          else if (score >= 50) tier = "GOLD";
          else if (score >= 25) tier = "SILVER";
          else tier = "BRONZE";

          return {
            username: data.username,
            name: data.name || data.username,
            score,
            rankTitle: data.globalRank?.title || "Top Contributor",
            personaTitle: data.persona?.title || "Active Developer",
            tier,
            totalCommits: data.stats?.totalCommits || 0,
            totalStars: data.stats?.totalStars || 0,
            totalPRs: data.stats?.totalPRs || 0,
            streak: data.stats?.streak || 0,
          };
        }
      }
    } catch {
      // Fallback to GitHub API direct fetch
    }
  }

  // 2. Fetch directly from GitHub API
  try {
    const fetchOptions: RequestInit = {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
      },
      next: { revalidate: 3600 },
    };

    const userRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      fetchOptions
    );

    if (!userRes.ok) {
      return null;
    }

    const userData = await userRes.json();

    // Fetch repositories for total stars and repo metrics
    let totalStars = 0;
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`,
        fetchOptions
      );
      if (reposRes.ok) {
        const repos = await reposRes.json();
        if (Array.isArray(repos)) {
          totalStars = repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
        }
      }
    } catch {}

    // Fetch PR count
    let totalPRs = 0;
    try {
      const prsRes = await fetch(
        `https://api.github.com/search/issues?q=type:pr+author:${encodeURIComponent(username)}`,
        fetchOptions
      );
      if (prsRes.ok) {
        const prsData = await prsRes.json();
        totalPRs = prsData.total_count || 0;
      }
    } catch {}

    // Fetch commits count
    let totalCommits = 0;
    try {
      const commitsRes = await fetch(
        `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}`,
        {
          ...fetchOptions,
          headers: {
            Accept: "application/vnd.github.cloak-preview",
            ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
          },
        }
      );
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        totalCommits = commitsData.total_count || 0;
      }
    } catch {}

    // Fetch streak estimate
    let streak = 0;
    try {
      const streakRes = await fetch(
        `https://github-contributions-api.deno.dev/${encodeURIComponent(username)}.json`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (streakRes.ok) {
        const streakData = await streakRes.json();
        const days = (streakData.contributions || []).flat();
        let currentStreak = 0;
        const today = new Date().toISOString().split("T")[0];
        let todayIdx = days.findIndex((d: any) => d.date === today);
        if (todayIdx === -1) todayIdx = days.length - 1;

        if (todayIdx >= 0 && days[todayIdx]?.contributionCount === 0) todayIdx--;

        if (todayIdx >= 0 && days[todayIdx]?.contributionCount > 0) {
          for (let i = todayIdx; i >= 0; i--) {
            if (days[i].contributionCount > 0) currentStreak++;
            else break;
          }
        }
        streak = currentStreak;
      }
    } catch {}

    // Compute developer pulse score & persona
    const score = Math.min(
      100,
      Math.round(
        totalCommits * 0.01 +
          totalPRs * 0.5 +
          totalStars * 1 +
          (userData.followers || 0) * 0.5
      )
    );

    let personaTitle = "Weekend Warrior";
    if (score > 80) personaTitle = "Open Source Hero";
    else if (score > 50) personaTitle = "Consistent Coder";
    else if (score > 25) personaTitle = "Rising Contributor";

    let rankTitle = "Top 50% Worldwide";
    let tier: DeveloperBadgeData["tier"] = "BRONZE";

    if (score >= 90) {
      rankTitle = "Top 0.1% Worldwide";
      tier = "LEGENDARY";
    } else if (score >= 75) {
      rankTitle = "Top 1% Worldwide";
      tier = "DIAMOND";
    } else if (score >= 60) {
      rankTitle = "Top 5% Worldwide";
      tier = "GOLD";
    } else if (score >= 40) {
      rankTitle = "Top 15% Worldwide";
      tier = "SILVER";
    }

    return {
      username: userData.login,
      name: userData.name || userData.login,
      score,
      rankTitle,
      personaTitle,
      tier,
      totalCommits,
      totalStars,
      totalPRs,
      streak,
    };
  } catch (error) {
    console.error("Error fetching developer badge stats:", error);
    return null;
  }
}

// ==========================================
// Route Handler
// ==========================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username || "").trim();

  // If username is empty or invalid, return fallback badge
  if (!decodedUsername) {
    const fallbackSvg = generateFallbackSvg("unknown");
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Vary": "Accept-Encoding",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") || "dark";

  const devData = await fetchDeveloperData(decodedUsername);

  // If user is not found, return elegant fallback SVG badge
  if (!devData) {
    const fallbackSvg = generateFallbackSvg(decodedUsername);
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Vary": "Accept-Encoding",
      },
    });
  }

  // Generate dynamic dark-themed SVG badge
  const svgBadge = generateBadgeSvg(devData, theme);

  return new Response(svgBadge, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=7200",
      "Vary": "Accept-Encoding",
    },
  });
}

