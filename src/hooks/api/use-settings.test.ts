import { describe, it, expect, beforeEach } from "vitest";
import {
  DEFAULT_PREFERENCES,
  DEFAULT_APPEARANCE_PREFERENCES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  SETTINGS_STORAGE_KEY,
  loadLocalPreferences,
  saveLocalPreferences,
  type UserPreferences,
} from "./use-settings";

describe("Persistent Settings & Preferences", () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    for (const key in mockStorage) {
      delete mockStorage[key];
    }

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
  });

  it("should have correct default appearance preferences", () => {
    expect(DEFAULT_PREFERENCES).toBeDefined();
    expect(DEFAULT_PREFERENCES.appearance.theme).toBe("dark");
    expect(DEFAULT_PREFERENCES.appearance.accentColor).toBe("purple");
    expect(DEFAULT_PREFERENCES.appearance.compactTableView).toBe(false);
    expect(DEFAULT_PREFERENCES.appearance.reducedMotion).toBe(false);
    expect(DEFAULT_PREFERENCES.appearance.defaultLandingTab).toBe("dashboard");
  });

  it("should have correct default notification preferences", () => {
    expect(DEFAULT_PREFERENCES.notifications.battleChallenges).toBe(true);
    expect(DEFAULT_PREFERENCES.notifications.weeklyDigest).toBe(true);
    expect(DEFAULT_PREFERENCES.notifications.achievementUnlocks).toBe(true);
    expect(DEFAULT_PREFERENCES.notifications.leaderboardUpdates).toBe(false);
    expect(DEFAULT_PREFERENCES.notifications.challengeReminders).toBe(true);
    expect(DEFAULT_PREFERENCES.notifications.productUpdates).toBe(true);
  });

  it("should return defaults when localStorage is empty", () => {
    const loaded = loadLocalPreferences();
    expect(loaded.appearance.theme).toBe("dark");
    expect(loaded.notifications.battleChallenges).toBe(true);
  });

  it("should save and reload custom preferences correctly", () => {
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

    expect(reloaded.appearance.theme).toBe("light");
    expect(reloaded.appearance.accentColor).toBe("emerald");
    expect(reloaded.appearance.compactTableView).toBe(true);
    expect(reloaded.appearance.reducedMotion).toBe(true);
    expect(reloaded.appearance.defaultLandingTab).toBe("battles");

    expect(reloaded.notifications.battleChallenges).toBe(false);
    expect(reloaded.notifications.weeklyDigest).toBe(false);
    expect(reloaded.notifications.leaderboardUpdates).toBe(true);
  });

  it("should safely merge partial data with defaults", () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        appearance: { compactTableView: true },
        notifications: { weeklyDigest: false },
      })
    );

    const merged = loadLocalPreferences();
    expect(merged.appearance.compactTableView).toBe(true);
    expect(merged.appearance.theme).toBe("dark");
    expect(merged.appearance.defaultLandingTab).toBe("dashboard");
    expect(merged.notifications.weeklyDigest).toBe(false);
    expect(merged.notifications.battleChallenges).toBe(true);
  });

  it("should gracefully recover from corrupted JSON in localStorage", () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, "invalid-json-{{{");
    const fallback = loadLocalPreferences();
    expect(fallback.appearance.theme).toBe("dark");
    expect(fallback.appearance.defaultLandingTab).toBe("dashboard");
  });
});
