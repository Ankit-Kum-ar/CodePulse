# 🤝 Contributing to CodePulse (DevBattle)

Thank you for your interest in contributing to **CodePulse**! We are thrilled to be participating in **Nexus Spring of Code (NSoC / NWoC) 2026 — Winter Edition**.

Whether you're fixing a typo, designing a new dashboard component, or building core backend battle algorithms, we welcome your contributions!

---

## 📜 Official NSoC 2026 Guidelines & Rules

Please read these rules carefully. NSoC strictly monitors contributions and awards points based on quality and compliance:

### 1. ⚠️ Issue Assignment is Mandatory
- **Never open a Pull Request without being officially assigned to an issue first.**
- Browse [existing issues](https://github.com/code-with-abhi-i5/CodePulse/issues) or open a new one with our [Issue Template](https://github.com/code-with-abhi-i5/CodePulse/issues/new/choose).
- Comment on the issue requesting assignment with a brief sentence on how you plan to solve it.
- Wait for a Project Admin (@code-with-abhi-i5) to assign you.
- **Unsolicited PRs (opened without assignment) will be closed automatically.**

### 2. ⏳ The 7-Day Inactivity Rule
- Once an issue is assigned to you, you have **7 days** to submit a PR or provide an active progress update.
- If there is no activity for 7 days, the issue will be **unassigned and given to another contributor**.

### 3. 🎯 NSoC Points & Level Structure

Every NSoC issue and PR will carry the mandatory **`nsoc26`** tag and exactly ONE Level tag:

| Level | Points | Scope | Examples |
|:---:|:---:|:---|:---|
| **`level1`** | **3 Points** | Documentation & Minor Fixes | Typos, fixing doc links, code comments, minor CSS alignments |
| **`level2`** | **5 Points** | UI & Frontend Development | New components, responsive layouts, Tailwind v4 styling, animations, charts |
| **`level3`** | **10 Points** | Core Logic & Backend | Complex API endpoints, Prisma migrations, BullMQ workers, Battle algorithms |

> ⚠️ **Level Abuse Warning:** Very small edits (e.g. 10-20 lines or formatting only) will **not** be tagged Level 2 or Level 3. Admin decisions on Level tags are final.

### 4. 🚫 Prohibited Practices
- **No Spam or AI-Generated PRs:** PRs consisting of raw ChatGPT/AI boilerplate that was not tested or understood will be marked invalid.
- **No 0-line or Trivial PRs:** PRs that make meaningless edits just to inflate contribution counts will be closed and reported to NSoC admins.
- **No Shared Branch Commits:** Work strictly on your own forked feature branch.

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v20+ or v22+
- **Git**
- **npm**

### Step 1: Fork and Clone the Repository
```bash
# 1. Fork via GitHub UI, then clone your fork:
git clone https://github.com/<YOUR_GITHUB_USERNAME>/CodePulse.git
cd CodePulse

# 2. Add upstream remote to stay synced:
git remote add upstream https://github.com/code-with-abhi-i5/CodePulse.git
```

### Step 2: Setup Frontend (Next.js 16)
```bash
# In project root:
npm install

# Start development server:
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Setup Backend (NestJS 11)
```bash
cd backend
npm install
npx prisma generate

# Copy environment variables:
cp .env.example .env  # (Or configure with your database)

# Start backend server:
npm run start:dev
```
Backend runs at [http://localhost:3001/api/v1](http://localhost:3001/api/v1).  
Interactive API Documentation is at [http://localhost:3001/api/docs](http://localhost:3001/api/docs).

---

## 🌿 Git & Branching Conventions

Always create a new branch for each assigned issue:

```bash
# Pull latest changes from upstream main:
git checkout main
git pull upstream main

# Create a feature branch:
git checkout -b feat/issue-12-leaderboard-filter
# Or for bug fixes:
git checkout -b fix/issue-45-theme-toggle
```

### Commit Message Guidelines
Follow conventional commits:
- `feat: add filter by country in leaderboard`
- `fix: resolve mobile navigation contrast issue`
- `docs: update NSoC setup instructions`

---

## 🚀 Submitting a Pull Request (PR)

1. **Verify your code locally:**
   ```bash
   # Run type checks:
   npx tsc --noEmit
   
   # Build test:
   npm run build
   ```
2. **Push to your fork:**
   ```bash
   git push origin feat/issue-12-leaderboard-filter
   ```
3. **Open a PR against `code-with-abhi-i5/CodePulse:main`:**
   - Use our provided **PR Template**.
   - Make sure your PR body explicitly mentions: `Closes #<issue-number>`.
   - Ensure the `nsoc26` label and your proposed level are indicated.
   - Describe what changed and provide screenshots for UI changes.

---

## ❓ Need Help?
- **NSoC Discord:** Join the discussion in the official [NSoC Discord Server](https://discord.gg/cUDnU9dup).
- **Issue Discussions:** Comment directly on your assigned issue for technical guidance.

Thank you for contributing and happy hacking during **Nexus Spring of Code 2026**! 🎉

