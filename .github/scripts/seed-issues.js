// .github/scripts/seed-issues.js
const fs = require('fs');

const owner = process.env.REPO_OWNER || 'code-with-abhi-i5';
const repo = process.env.REPO_NAME || 'CodePulse';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is required.');
  process.exit(1);
}

const issuesToSeed = [
  {
    title: "[FEAT]: Topbar Interactive Notifications Dropdown with Mark-All-as-Read",
    labels: ["nsoc26", "level2", "frontend", "feature"],
    body: `### 📖 1. Overview & Problem Statement
Currently, the notification bell in the top navigation bar displays a static unread badge count, but clicking on it does not open any panel or dropdown. Users cannot view notifications, clear them, or mark them as read.

### 🎯 2. Expected Behavior
- Clicking the Bell icon should toggle a sleek, floating glassmorphic dropdown panel.
- Displays a scrollable list of recent notifications with category icons, title, description, and relative timestamp (e.g. "2 hours ago").
- Include a "Mark all as read" button at the top header of the dropdown that clears unread badges.
- Include a filter tab or toggle: **All** vs **Unread**.
- Smooth enter/exit animations matching the existing CodePulse theme.
- Responsive design for mobile screens.

### 📁 3. Relevant Files
- \`src/components/layout/topbar.tsx\`
- \`src/components/layout/notification-dropdown.tsx\` *(new component)*
- \`src/lib/mock-data.ts\` or \`src/hooks/api/use-notifications.ts\`

### 📝 4. Acceptance Criteria
- [ ] Dropdown opens and closes cleanly without layout shifts.
- [ ] "Mark all as read" updates state and resets badge count to 0.
- [ ] Zero linting or build errors (\`npm run build\` passes).

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a separate branch: \`git checkout -b feat/topbar-notifications\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Export Developer Analytics Report as Shareable PNG Image & CSV",
    labels: ["nsoc26", "level2", "frontend", "feature"],
    body: `### 📖 1. Overview & Problem Statement
Developers love sharing their coding stats, streaks, and GitHub wrapped on social media (X/Twitter, LinkedIn). Currently, the \`/analytics\` page renders informative charts, but does not offer any export or download capability.

### 🎯 2. Expected Behavior
- Add an **"Export Report"** button to the top header of the Analytics page.
- When clicked, open a modal with two export options:
  1. **Download Image (.PNG):** Captures a high-resolution branded developer scorecard summary (showing rank, total score, commits, and top languages) using \`html2canvas\`.
  2. **Export Raw Data (.CSV):** Generates and downloads a clean CSV file with repository, commit, and pull request statistics.
- Provide a clean loading spinner while the image canvas is generating.

### 📁 3. Relevant Files
- \`src/app/(dashboard)/analytics/page.tsx\`
- \`src/components/analytics/analytics-export-modal.tsx\` *(new component)*

### 📝 4. Acceptance Criteria
- [ ] PNG download renders sharp text and colors on both dark and light displays.
- [ ] CSV file downloads cleanly with valid columns and rows.
- [ ] Accessible modal dialog with Escape-key dismiss.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/analytics-export\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Interactive Achievement Detail Modal with Confetti and Social Share",
    labels: ["nsoc26", "level2", "frontend", "ui/ux"],
    body: `### 📖 1. Overview & Problem Statement
On the \`/achievements\` page, clicking on an achievement card does nothing. Users cannot inspect detailed criteria, view high-res badge art, or share their unlocked achievements.

### 🎯 2. Expected Behavior
- Clicking on any unlocked achievement card opens an interactive celebration modal.
- Triggers a celebratory confetti animation burst (\`canvas-confetti\`).
- Shows the achievement title, high-res badge icon, rarity tier (Common, Rare, Epic, Legendary), XP reward, and exact unlock criteria.
- Includes a **"Share on X (Twitter)"** button that opens a pre-filled tweet window (\`https://twitter.com/intent/tweet?text=...\`) with hashtags \`#CodePulse #NSoC2026\`.
- Includes a **"Copy Link"** button with a toast confirmation.

### 📁 3. Relevant Files
- \`src/app/(dashboard)/achievements/page.tsx\`
- \`src/components/cards/achievement-card.tsx\`
- \`src/components/modals/achievement-share-modal.tsx\` *(new component)*

### 📝 4. Acceptance Criteria
- [ ] Confetti fires smoothly on modal open for unlocked achievements.
- [ ] Social share button generates proper URI-encoded query parameters.
- [ ] Fully responsive on mobile viewports.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/achievement-share-modal\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Advanced Multi-Criteria Repository Filters and Source/Fork Toggle",
    labels: ["nsoc26", "level2", "frontend", "enhancement"],
    body: `### 📖 1. Overview & Problem Statement
The \`/repositories\` page currently offers basic keyword search and a language filter dropdown. Developers with dozens of repositories need more granular filtering to quickly find relevant projects.

### 🎯 2. Expected Behavior
- Add filter pills for repository type: **All** | **Sources (Originals)** | **Forks**.
- Add a **Minimum Stars Filter** dropdown (\`All Stars\`, \`> 10 ★\`, \`> 50 ★\`, \`> 100 ★\`).
- Add a **"Most Commits"** sorting option in the sort dropdown.
- Display an active filter badge and a **"Clear All Filters"** button when filters are active.
- Display an empty state placeholder if no repositories match the combined filter criteria.

### 📁 3. Relevant Files
- \`src/app/(dashboard)/repositories/page.tsx\`

### 📝 4. Acceptance Criteria
- [ ] Multi-criteria filtering works simultaneously (e.g. TypeScript + Sources + >10 Stars).
- [ ] "Clear All Filters" instantly restores the full repository list.
- [ ] Smooth layout transitions using Framer Motion / Motion.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/repo-filters\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Add Quick Challenge & Compare Action Triggers to Leaderboard Modal",
    labels: ["nsoc26", "level2", "frontend", "ui/ux"],
    body: `### 📖 1. Overview & Problem Statement
When clicking on a developer in the \`/leaderboard\` table, a modal opens with basic profile details, but there is no direct way to initiate a DevBattle or compare stats against that developer.

### 🎯 2. Expected Behavior
- Enhance the profile modal in \`leaderboard/page.tsx\` with two prominent action buttons:
  1. **"⚔️ Challenge to Battle":** Navigates to \`/battles?p2=<username>\`, pre-filling Player 2 in the battle setup screen.
  2. **"📊 Compare with Me":** Navigates to \`/compare?user1=<currentUser>&user2=<username>\`, immediately loading both developers.
- Disable or hide these buttons if the selected developer is the currently logged-in user.
- Add an external link icon next to the GitHub username that opens their GitHub profile in a new tab.

### 📁 3. Relevant Files
- \`src/app/(dashboard)/leaderboard/page.tsx\`
- \`src/app/(dashboard)/battles/page.tsx\` *(to read \`p2\` search parameter)*

### 📝 4. Acceptance Criteria
- [ ] Clicking "Challenge" opens Battles with Player 2 pre-filled.
- [ ] Clicking "Compare" opens Compare dashboard with both users populated.
- [ ] Modal dismisses cleanly on navigation.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/leaderboard-quick-actions\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Persistent User Preferences for Appearance and Notifications in Settings",
    labels: ["nsoc26", "level2", "frontend", "enhancement"],
    body: `### 📖 1. Overview & Problem Statement
On the \`/settings\` page, toggling switches in Appearance and Notifications tabs executes \`handleMockSave()\`, which only triggers a static toast message without saving the preferences.

### 🎯 2. Expected Behavior
- Persist Appearance preferences (compact table view, reduced motion toggle, default landing tab) in \`localStorage\` or via user settings API.
- Persist Notification preferences (battle challenge alerts, weekly stats digest, achievement unlocks) with proper state management.
- Add a **"Reset to Defaults"** button that restores recommended default preferences.
- Provide clear visual feedback when changes are automatically saved.

### 📁 3. Relevant Files
- \`src/app/(dashboard)/settings/page.tsx\`
- \`src/hooks/api/use-settings.ts\`

### 📝 4. Acceptance Criteria
- [ ] Reloading the browser preserves the saved switch positions.
- [ ] "Reset to Defaults" button works reliably.
- [ ] Zero type or linter errors.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/settings-persistence\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Dynamic GitHub Profile SVG Badge Generator Endpoint",
    labels: ["nsoc26", "level2", "backend", "feature"],
    body: `### 📖 1. Overview & Problem Statement
Developers frequently customize their GitHub Profile README files with dynamic stat badges. CodePulse has rich developer data (score, rank, tier, streak) that developers would love to show off on their profiles.

### 🎯 2. Expected Behavior
- Create a Next.js API route: \`src/app/api/badge/[username]/route.ts\`.
- Fetch user stats (total score, global rank, persona/tier title) from existing backend API or GitHub proxy.
- Render and return an attractive dark-themed SVG badge with \`Content-Type: image/svg+xml\`.
- Include appropriate caching headers (\`Cache-Control: public, max-age=3600, s-maxage=7200\`).
- If a user is not found, return an elegant fallback SVG badge instead of a raw 404 JSON error.

### 📁 3. Relevant Files
- \`src/app/api/badge/[username]/route.ts\` *(new endpoint)*

### 📝 4. Acceptance Criteria
- [ ] Visiting \`/api/badge/<username>\` renders a valid, sharp SVG image.
- [ ] Badge renders cleanly when embedded in a GitHub Markdown README: \`![CodePulse Badge](url)\`.
- [ ] Handles non-existent users gracefully.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/dynamic-svg-badge\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Integrate Global Search for Repositories & Battles into Command Palette",
    labels: ["nsoc26", "level2", "frontend", "feature"],
    body: `### 📖 1. Overview & Problem Statement
The Command Palette (\`Ctrl+K\` / \`Cmd+K\`) currently only allows navigation to static dashboard routes. It does not allow searching through the user's repositories or starting a quick battle.

### 🎯 2. Expected Behavior
- Add a **"Repositories"** group inside \`command-palette.tsx\` that dynamically searches through the user's active repositories.
- Add a **"Start Quick Battle"** action allowing the user to type a GitHub username and hit Enter to jump directly into battle.
- Display relevant icons (e.g. GitHub repo icon, Swords icon) and keyboard shortcut helpers.

### 📁 3. Relevant Files
- \`src/components/layout/command-palette.tsx\`

### 📝 4. Acceptance Criteria
- [ ] Pressing \`Ctrl+K\` and typing a repository name highlights and navigates to the repository on Enter.
- [ ] Full keyboard navigation (Arrow Up/Down, Enter, Esc) works seamlessly.
- [ ] Mobile drawer trigger functions properly.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/command-palette-search\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[FEAT]: Add Victory Confetti Celebration and Sound Effects to Battle Report",
    labels: ["nsoc26", "level2", "frontend", "ui/ux"],
    body: `### 📖 1. Overview & Problem Statement
When a developer battle concludes on \`/battles\`, the \`BattleReport\` component appears, but lacks celebratory visual and auditory excitement for the winning developer.

### 🎯 2. Expected Behavior
- When the Winner card is revealed in \`battle-report.tsx\`:
  - Trigger a dynamic dual-cannon confetti celebration (\`canvas-confetti\`).
  - Play an optional subtle sound effect for victory (with a global mute toggle button in the battle header).
- Add a **"Share Battle Result"** button that copies a shareable URL to clipboard (\`/battles?p1=...&p2=...&winner=...\`) with toast confirmation.

### 📁 3. Relevant Files
- \`src/components/battles/battle-report.tsx\`
- \`src/app/(dashboard)/battles/page.tsx\`

### 📝 4. Acceptance Criteria
- [ ] Confetti runs smoothly without dropping FPS.
- [ ] Audio respects the mute toggle and user interaction policies.
- [ ] "Share Result" button copies the URL and displays a toast message.

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b feat/battle-victory-celebration\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  },
  {
    title: "[TEST]: Configure Vitest and Add Unit Tests for Utility Functions and Core Cards",
    labels: ["nsoc26", "level2", "testing", "enhancement"],
    body: `### 📖 1. Overview & Problem Statement
Currently, the frontend has zero component or unit tests. Adding automated test coverage prevents regressions when contributors submit PRs.

### 🎯 2. Expected Behavior
- Configure Vitest with \`@testing-library/react\` and \`jsdom\` in the Next.js frontend.
- Add unit tests for:
  1. \`src/lib/utils.ts\` (\`formatNumber\`, \`cn\`, date helpers).
  2. \`src/components/cards/challenge-card.tsx\` (rendering progress bars, difficulty badges, and reward XP).
- Add \`test\` script to \`package.json\` (\`"test": "vitest run"\`).

### 📁 3. Relevant Files
- \`vitest.config.ts\` *(new file)*
- \`src/lib/utils.test.ts\` *(new file)*
- \`src/components/cards/challenge-card.test.tsx\` *(new file)*
- \`package.json\`

### 📝 4. Acceptance Criteria
- [ ] \`npm run test\` executes and passes all test suites cleanly.
- [ ] Covers both standard cases and edge cases (e.g., 0 progress, large numbers).

### ⚠️ 5. Contributor Rules & Compliance
1. Work on a dedicated branch: \`git checkout -b test/vitest-setup\`
2. In your PR description, include: \`Closes #<issue_number>\`
3. Inactivity for **7 days** will result in automatic unassignment.

---
*Comment \`/assign\` below to claim this issue!*`
  }
];

async function main() {
  const headers = {
    'Authorization': 'token ' + token,
    'User-Agent': 'CodePulse-Seeder',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  console.log(`Checking existing issues in ${owner}/${repo}...`);
  const listRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`, { headers });
  if (!listRes.ok) {
    throw new Error(`Failed to list issues: ${listRes.status} ${await listRes.text()}`);
  }

  const existingIssues = await listRes.json();
  const existingTitles = new Set(existingIssues.map(i => i.title.toLowerCase().trim()));

  let createdCount = 0;
  for (const issue of issuesToSeed) {
    const normalizedTitle = issue.title.toLowerCase().trim();
    if (existingTitles.has(normalizedTitle)) {
      console.log(`⏩ Skipping already existing issue: "${issue.title}"`);
      continue;
    }

    console.log(`Creating issue: "${issue.title}"...`);
    const createRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      })
    });

    if (!createRes.ok) {
      console.error(`❌ Failed to create "${issue.title}": ${createRes.status} ${await createRes.text()}`);
      continue;
    }

    const createdData = await createRes.json();
    console.log(`✅ Created Issue #${createdData.number}: ${createdData.title}`);
    createdCount++;

    // Wait 1.5s between requests to respect rate limits
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`🎉 Finished! Created ${createdCount} new issues on ${owner}/${repo}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
