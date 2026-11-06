import {
  escapeXml,
  generateBadgeSvg,
  generateFallbackSvg,
  GET,
  type DeveloperBadgeData,
} from "./route";

async function runTests() {
  console.log("🧪 Running unit tests for SVG badge generator...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test escapeXml
  assert(
    escapeXml('<script>alert("xss&test")</script>') ===
      "&lt;script&gt;alert(&quot;xss&amp;test&quot;)&lt;/script&gt;",
    "escapeXml sanitizes HTML and XML special characters"
  );
  assert(
    escapeXml("O'Reilly & Associates") === "O&apos;Reilly &amp; Associates",
    "escapeXml sanitizes single quotes and ampersands"
  );
  assert(escapeXml("") === "", "escapeXml handles empty string");

  // 2. Test generateBadgeSvg with standard data
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

  assert(svg.startsWith("<svg"), "Badge SVG starts with <svg");
  assert(svg.endsWith("</svg>"), "Badge SVG ends with </svg>");
  assert(svg.includes('xmlns="http://www.w3.org/2000/svg"'), "Badge contains SVG namespace");
  assert(svg.includes('width="495" height="195"'), "Badge has standard 495x195 dimensions");
  assert(svg.includes("Alex Chen"), "Badge renders developer name");
  assert(svg.includes("@alexchen"), "Badge renders developer username");
  assert(svg.includes("94"), "Badge renders developer pulse score");
  assert(svg.includes("Top 0.1% Worldwide"), "Badge renders global rank");
  assert(svg.includes("Open Source Hero"), "Badge renders persona title");
  assert(svg.includes("1.4K"), "Badge renders formatted commits");
  assert(svg.includes("2.9K") || svg.includes("2.8K"), "Badge renders formatted stars");
  assert(svg.includes("84"), "Badge renders formatted PRs");
  assert(svg.includes("21 days"), "Badge renders streak duration");
  assert(svg.includes("Tier: LEGENDARY"), "Badge renders correct tier");

  // 3. Test stroke-dashoffset calculation
  // circumference = 213.63. For score 100, offset is 0.0. For score 50, offset is ~106.8.
  const svg50 = generateBadgeSvg({ ...testDev, score: 50 });
  assert(svg50.includes('stroke-dashoffset="106.8"'), "Score gauge calculates correct stroke-dashoffset for 50%");

  // 4. Test XML sanitization inside generateBadgeSvg
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
  assert(!safeSvg.includes("<script>"), "User script tags are sanitized in SVG");
  assert(safeSvg.includes("&lt;script&gt;"), "Sanitized script entities exist in SVG");
  assert(safeSvg.includes("&amp; Co"), "Ampersands are properly escaped in SVG");
  assert(safeSvg.includes("Rank &lt; 1%"), "Comparison operators are escaped in SVG");

  // 5. Test generateFallbackSvg
  const fallbackSvg = generateFallbackSvg("ghost-dev");
  assert(fallbackSvg.startsWith("<svg"), "Fallback SVG starts with <svg");
  assert(fallbackSvg.endsWith("</svg>"), "Fallback SVG ends with </svg>");
  assert(fallbackSvg.includes("Developer Not Found"), "Fallback SVG displays Developer Not Found");
  assert(fallbackSvg.includes("@ghost-dev"), "Fallback SVG includes requested username");
  assert(fallbackSvg.includes("User Not Found"), "Fallback SVG displays warning status pill");

  // 6. Test GET route handler with empty username
  const req = new Request("http://localhost:3000/api/badge/unknown");
  const res = await GET(req, { params: Promise.resolve({ username: "" }) });
  assert(res.status === 200, "Empty username returns status 200 fallback badge");
  assert(
    res.headers.get("Content-Type") === "image/svg+xml; charset=utf-8",
    "Empty username response has image/svg+xml header"
  );
  assert(
    res.headers.get("Cache-Control")?.includes("public") === true,
    "Response contains public Cache-Control header"
  );

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

