import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ContributionHeatmap } from "./contribution-heatmap";
import type { ContributionDay } from "@/types";

const STORAGE_KEY = "codepulse_heatmap_theme";

const sampleData = [
  { date: "2026-01-01", count: 0, level: 0 },
  { date: "2026-01-02", count: 1, level: 1 },
  { date: "2026-01-03", count: 12, level: 4 },
] as ContributionDay[];

// The strongest (level 4) cell colour of each palette, used to tell palettes apart.
const TOP_LEVEL_CLASS = {
  cyberpunk: "bg-pink-400",
  github: "bg-green-400",
  solar: "bg-red-400",
  ice: "bg-indigo-300",
} as const;

function getSelect() {
  return screen.getByLabelText("Heatmap color palette") as HTMLSelectElement;
}

// Some Node/jsdom combinations do not expose a working window.localStorage, so the tests use
// a small in-memory implementation to stay independent of the environment.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
}

describe("ContributionHeatmap color palettes", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("shows the four palettes and defaults to Cyberpunk", () => {
    const { container } = render(<ContributionHeatmap data={sampleData} />);

    const options = Array.from(getSelect().options).map((o) => o.textContent);
    expect(options).toEqual(["Cyberpunk", "GitHub Classic", "Solar Ember", "Neon Ice"]);
    expect(getSelect().value).toBe("cyberpunk");
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.cyberpunk}`)).not.toBeNull();
  });

  it("recolors the grid and legend when a palette is selected", () => {
    const { container } = render(<ContributionHeatmap data={sampleData} />);

    fireEvent.change(getSelect(), { target: { value: "ice" } });

    expect(getSelect().value).toBe("ice");
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.ice}`)).not.toBeNull();
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.cyberpunk}`)).toBeNull();
  });

  it("saves the selected palette in localStorage", () => {
    render(<ContributionHeatmap data={sampleData} />);

    fireEvent.change(getSelect(), { target: { value: "solar" } });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("solar");
  });

  it("restores the saved palette after a reload", () => {
    window.localStorage.setItem(STORAGE_KEY, "github");

    const { container } = render(<ContributionHeatmap data={sampleData} />);

    expect(getSelect().value).toBe("github");
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.github}`)).not.toBeNull();
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.cyberpunk}`)).toBeNull();
  });

  it("falls back to Cyberpunk when the saved value is not a known palette", () => {
    window.localStorage.setItem(STORAGE_KEY, "not-a-palette");

    const { container } = render(<ContributionHeatmap data={sampleData} />);

    expect(getSelect().value).toBe("cyberpunk");
    expect(container.querySelector(`.${TOP_LEVEL_CLASS.cyberpunk}`)).not.toBeNull();
  });
});
