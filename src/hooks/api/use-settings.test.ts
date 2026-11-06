import {
  DEFAULT_PREFERENCES,
  DEFAULT_APPEARANCE_PREFERENCES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  SETTINGS_STORAGE_KEY,
  loadLocalPreferences,
  saveLocalPreferences,
  type UserPreferences,
} from "./use-settings";

async function runTests() {
  console.log("🧪 Running unit tests for persistent settings & preferences...\n");

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

  // Mock in-memory localStorage for Node test environment
  const mockStorage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => {
      mockStorage[key] = val;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      for (const k in mockStorage) delete mockStorage[k];
    },
  };
  (global as any).window = {};

  // 1. Verify Default Preferences structure
  assert(DEFAULT_PREFERENCES !== null, "DEFAULT_PREFERENCES is defined");
  assert(DEFAULT_PREFERENCES.appearance.theme === "dark", "Default theme is dark");
  assert(DEFAULT_PREFERENCES.appearance.accentColor === "purple", "Default accent is purple");
  assert(DEFAULT_PREFERENCES.appearance.compactTableView === false, "Compact table view is false by default");
  assert(DEFAULT_PREFERENCES.appearance.reducedMotion === false, "Reduced motion is false by default");
  assert(DEFAULT_PREFERENCES.appearance.defaultLandingTab === "dashboard", "Default landing tab is dashboard");

  assert(DEFAULT_PREFERENCES.notifications.battleChallenges === true, "Battle challenges alert is true by default");
  assert(DEFAULT_PREFERENCES.notifications.weeklyDigest === true, "Weekly digest is true by default");
  assert(DEFAULT_PREFERENCES.notifications.achievementUnlocks === true, "Achievement unlocks is true by default");
  assert(DEFAULT_PREFERENCES.notifications.leaderboardUpdates === false, "Leaderboard updates is false by default");
  assert(DEFAULT_PREFERENCES.notifications.challengeReminders === true, "Challenge reminders is true by default");
  assert(DEFAULT_PREFERENCES.notifications.productUpdates === true, "Product updates is true by default");

  // 2. Test loadLocalPreferences with empty storage
  localStorage.clear();
  const loadedDefault = loadLocalPreferences();
  assert(
    loadedDefault.appearance.theme === "dark",
    "loadLocalPreferences returns default theme when storage is empty"
  );
  assert(
    loadedDefault.notifications.battleChallenges === true,
    "loadLocalPreferences returns default notifications when storage is empty"
  );

  // 3. Test saveLocalPreferences and persistence
  const customPrefs: UserPreferences = {
    appearance: {
      theme: "light",
      accentColor: "emerald",
      compactTableView: true,
      reducedMotion: true,
      defaultLandingTab: "battles",
    },
    notifications: {
      battleChallenges: false,
      weeklyDigest: false,
      achievementUnlocks: true,
      leaderboardUpdates: true,
      challengeReminders: false,
      productUpdates: false,
    },
  };

  saveLocalPreferences(customPrefs);
  const reloaded = loadLocalPreferences();

  assert(reloaded.appearance.theme === "light", "Persisted theme is light");
  assert(reloaded.appearance.accentColor === "emerald", "Persisted accent color is emerald");
  assert(reloaded.appearance.compactTableView === true, "Persisted compactTableView is true");
  assert(reloaded.appearance.reducedMotion === true, "Persisted reducedMotion is true");
  assert(reloaded.appearance.defaultLandingTab === "battles", "Persisted defaultLandingTab is battles");

  assert(reloaded.notifications.battleChallenges === false, "Persisted battleChallenges is false");
  assert(reloaded.notifications.weeklyDigest === false, "Persisted weeklyDigest is false");
  assert(reloaded.notifications.leaderboardUpdates === true, "Persisted leaderboardUpdates is true");

  // 4. Test partial data recovery / safe merging
  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      appearance: { compactTableView: true },
      notifications: { weeklyDigest: false },
    })
  );

  const merged = loadLocalPreferences();
  assert(merged.appearance.compactTableView === true, "Preserves custom compactTableView");
  assert(merged.appearance.theme === "dark", "Fills in missing appearance.theme with default");
  assert(merged.appearance.defaultLandingTab === "dashboard", "Fills in missing landing tab with default");
  assert(merged.notifications.weeklyDigest === false, "Preserves custom weeklyDigest");
  assert(merged.notifications.battleChallenges === true, "Fills in missing battleChallenges with default");

  // 5. Test resilience to corrupted JSON
  localStorage.setItem(SETTINGS_STORAGE_KEY, "invalid-json-{{{");
  const fallbackFromCorrupt = loadLocalPreferences();
  assert(
    fallbackFromCorrupt.appearance.theme === "dark",
    "Gracefully recovers from corrupted JSON in localStorage"
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

