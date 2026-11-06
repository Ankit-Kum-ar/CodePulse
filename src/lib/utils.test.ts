import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatNumber,
  formatDate,
  formatRelativeTime,
  getInitials,
  generateGradient,
  clamp,
  randomBetween,
  getPercentageChange,
  getDaysAgo,
} from "./utils";

describe("Utils Library", () => {
  describe("cn", () => {
    it("should merge simple class names", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    });

    it("should handle conditional and falsy class names", () => {
      expect(cn("btn", false && "hidden", null, undefined, "active")).toBe(
        "btn active"
      );
    });

    it("should resolve conflicting Tailwind classes using tailwind-merge", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
      expect(cn("bg-red-500", "bg-green-500")).toBe("bg-green-500");
    });

    it("should handle empty arguments", () => {
      expect(cn()).toBe("");
    });
  });

  describe("formatNumber", () => {
    it("should format small numbers as plain strings", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(42)).toBe("42");
      expect(formatNumber(999)).toBe("999");
    });

    it("should format thousands with K suffix", () => {
      expect(formatNumber(1000)).toBe("1.0K");
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(999900)).toBe("999.9K");
    });

    it("should format millions with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1.0M");
      expect(formatNumber(2540000)).toBe("2.5M");
      expect(formatNumber(10000000)).toBe("10.0M");
    });

    it("should handle negative numbers below 1000", () => {
      expect(formatNumber(-50)).toBe("-50");
    });
  });

  describe("formatDate", () => {
    it("should format a Date object into short month, day, year", () => {
      const date = new Date("2026-04-15T12:00:00Z");
      expect(formatDate(date)).toContain("2026");
      expect(formatDate(date)).toContain("15");
    });

    it("should format an ISO date string", () => {
      const result = formatDate("2026-01-01T00:00:00Z");
      expect(result).toContain("2026");
      expect(result).toContain("Jan");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-01T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return 'just now' for diff under 60 seconds", () => {
      const past = new Date("2026-06-01T11:59:30Z");
      expect(formatRelativeTime(past)).toBe("just now");
    });

    it("should return 'Xm ago' for diff under 60 minutes", () => {
      const past = new Date("2026-06-01T11:45:00Z");
      expect(formatRelativeTime(past)).toBe("15m ago");
    });

    it("should return 'Xh ago' for diff under 24 hours", () => {
      const past = new Date("2026-06-01T08:00:00Z");
      expect(formatRelativeTime(past)).toBe("4h ago");
    });

    it("should return 'Xd ago' for diff under 7 days", () => {
      const past = new Date("2026-05-28T12:00:00Z");
      expect(formatRelativeTime(past)).toBe("4d ago");
    });

    it("should fallback to formatDate for diff 7 days or older", () => {
      const past = new Date("2026-05-10T12:00:00Z");
      expect(formatRelativeTime(past)).toBe(formatDate(past));
    });
  });

  describe("getInitials", () => {
    it("should return the first two letters of a multi-word name in uppercase", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("ada lovelace")).toBe("AL");
    });

    it("should return up to 2 characters for single word names", () => {
      expect(getInitials("Linus")).toBe("L");
    });

    it("should truncate initials beyond 2 characters", () => {
      expect(getInitials("Nexus Spring of Code")).toBe("NS");
    });
  });

  describe("generateGradient", () => {
    it("should return a consistent gradient class string for the same seed", () => {
      const gradient1 = generateGradient("user123");
      const gradient2 = generateGradient("user123");
      expect(gradient1).toBe(gradient2);
      expect(gradient1).toContain("from-");
      expect(gradient1).toContain("to-");
    });

    it("should return valid gradient string for any string input", () => {
      expect(typeof generateGradient("test-seed")).toBe("string");
      expect(typeof generateGradient("")).toBe("string");
    });
  });

  describe("clamp", () => {
    it("should return the value when within bounds", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it("should return min when value is below min", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it("should return max when value exceeds max", () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it("should handle min equal to max", () => {
      expect(clamp(8, 5, 5)).toBe(5);
    });
  });

  describe("randomBetween", () => {
    it("should return a number between min and max inclusive", () => {
      for (let i = 0; i < 20; i++) {
        const val = randomBetween(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(10);
      }
    });

    it("should return the same number when min equals max", () => {
      expect(randomBetween(7, 7)).toBe(7);
    });
  });

  describe("getPercentageChange", () => {
    it("should calculate positive percentage increase correctly", () => {
      expect(getPercentageChange(150, 100)).toBe(50);
      expect(getPercentageChange(200, 100)).toBe(100);
    });

    it("should calculate negative percentage decrease correctly", () => {
      expect(getPercentageChange(80, 100)).toBe(-20);
      expect(getPercentageChange(50, 100)).toBe(-50);
    });

    it("should return 100 when previous is 0 to avoid division by zero", () => {
      expect(getPercentageChange(50, 0)).toBe(100);
    });

    it("should return 0 when current equals previous", () => {
      expect(getPercentageChange(100, 100)).toBe(0);
    });
  });

  describe("getDaysAgo", () => {
    it("should return a date shifted backwards by specified days", () => {
      const now = new Date();
      const threeDaysAgo = getDaysAgo(3);
      const diffMs = now.getTime() - threeDaysAgo.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(3);
    });
  });
});

