import { describe, it, expect } from "vitest";
import {
  escapeXml,
  generateBadgeSvg,
  generateFallbackSvg,
  GET,
  type DeveloperBadgeData,
} from "./route";

describe("Developer Badge SVG API", () => {
  it("escapeXml should sanitize HTML and XML special characters", () => {
    expect(escapeXml('<script>alert("xss&test")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&amp;test&quot;)&lt;/script&gt;"
    );
    expect(escapeXml("O'Reilly & Associates")).toBe(
      "O&apos;Reilly &amp; Associates"
    );
    expect(escapeXml("")).toBe("");
  });

  it("generateBadgeSvg should render standard developer badge SVG correctly", () => {
    const testDev: DeveloperBadgeData = {
      username: "alexchen",
      name: "Alex Chen",
      score: 94,
      rankTitle: "Top 0.1% Worldwide",
      personaTitle: "Open Source Hero",
      tier: "LEGENDARY",
      totalCommits: 1420,
      totalStars: 2850,
      totalPRs: 84,
      streak: 21,
    };

    const svg = generateBadgeSvg(testDev);

    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    expect(svg.includes('xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg.includes('width="495" height="195"')).toBe(true);
    expect(svg.includes("Alex Chen")).toBe(true);
    expect(svg.includes("@alexchen")).toBe(true);
    expect(svg.includes("94")).toBe(true);
    expect(svg.includes("Top 0.1% Worldwide")).toBe(true);
    expect(svg.includes("Open Source Hero")).toBe(true);
    expect(svg.includes("1.4K")).toBe(true);
    expect(svg.includes("2.9K") || svg.includes("2.8K")).toBe(true);
    expect(svg.includes("84")).toBe(true);
    expect(svg.includes("21 days")).toBe(true);
    expect(svg.includes("Tier: LEGENDARY")).toBe(true);
  });

  it("generateBadgeSvg should calculate correct stroke-dashoffset for score gauge", () => {
    const testDev: DeveloperBadgeData = {
      username: "alexchen",
      name: "Alex Chen",
      score: 50,
      rankTitle: "Top 10% Worldwide",
      personaTitle: "Frontend Dev",
      tier: "GOLD",
      totalCommits: 500,
      totalStars: 200,
      totalPRs: 30,
      streak: 10,
    };

    const svg50 = generateBadgeSvg(testDev);
    expect(svg50.includes('stroke-dashoffset="106.8"')).toBe(true);
  });

  it("generateBadgeSvg should prevent XSS by escaping dangerous characters", () => {
    const dangerousDev: DeveloperBadgeData = {
      username: "user<script>",
      name: 'Jane "Hacker" & Co <svg>',
      score: 80,
      rankTitle: "Rank < 1%",
      personaTitle: "Coder & Maker",
      tier: "DIAMOND",
      totalCommits: 100,
      totalStars: 50,
      totalPRs: 10,
      streak: 5,
    };

    const safeSvg = generateBadgeSvg(dangerousDev);
    expect(safeSvg.includes("<script>")).toBe(false);
    expect(safeSvg.includes("&lt;script&gt;")).toBe(true);
    expect(safeSvg.includes("&amp; Co")).toBe(true);
    expect(safeSvg.includes("Rank &lt; 1%")).toBe(true);
  });

  it("generateFallbackSvg should render not found state cleanly", () => {
    const fallbackSvg = generateFallbackSvg("ghost-dev");
    expect(fallbackSvg.startsWith("<svg")).toBe(true);
    expect(fallbackSvg.endsWith("</svg>")).toBe(true);
    expect(fallbackSvg.includes("Developer Not Found")).toBe(true);
    expect(fallbackSvg.includes("@ghost-dev")).toBe(true);
    expect(fallbackSvg.includes("User Not Found")).toBe(true);
  });

  it("GET route handler should return fallback SVG badge with 200 for empty username", async () => {
    const req = new Request("http://localhost:3000/api/badge/unknown");
    const res = await GET(req, { params: Promise.resolve({ username: "" }) });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/svg+xml; charset=utf-8");
    expect(res.headers.get("Cache-Control")?.includes("public")).toBe(true);
  });
});
