import { describe, it, expect } from "vitest";
import manifest from "./manifest";
import fs from "fs";
import path from "path";

describe("PWA Manifest", () => {
  it("should return the correct manifest metadata configuration", () => {
    const data = manifest();

    expect(data.name).toBe("CodePulse — Developer Analytics");
    expect(data.short_name).toBe("CodePulse");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe("#020617");
    expect(data.background_color).toBe("#000000");
    expect(data.start_url).toBe("/");
    expect(data.orientation).toBe("portrait-primary");

    expect(Array.isArray(data.icons)).toBe(true);
    expect(data.icons?.length).toBeGreaterThanOrEqual(2);

    const icon192 = data.icons?.find((icon) => icon.sizes === "192x192");
    expect(icon192).toBeDefined();
    expect(icon192?.src).toBe("/icons/icon-192x192.png");
    expect(icon192?.type).toBe("image/png");

    const icon512 = data.icons?.find((icon) => icon.sizes === "512x512");
    expect(icon512).toBeDefined();
    expect(icon512?.src).toBe("/icons/icon-512x512.png");
    expect(icon512?.type).toBe("image/png");
  });

  it("should ensure static public/manifest.json exists and is valid", () => {
    const manifestPath = path.resolve(process.cwd(), "public", "manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, "utf-8");
    const parsed = JSON.parse(raw);

    expect(parsed.name).toBe("CodePulse — Developer Analytics");
    expect(parsed.short_name).toBe("CodePulse");
    expect(parsed.theme_color).toBe("#020617");
    expect(parsed.background_color).toBe("#000000");
    expect(parsed.display).toBe("standalone");
    expect(parsed.icons.length).toBeGreaterThanOrEqual(2);
  });

  it("should ensure app icon assets exist in public/icons and public/", () => {
    const icon192Path = path.resolve(process.cwd(), "public", "icons", "icon-192x192.png");
    const icon512Path = path.resolve(process.cwd(), "public", "icons", "icon-512x512.png");
    const appleTouchPath = path.resolve(process.cwd(), "public", "apple-touch-icon.png");

    expect(fs.existsSync(icon192Path)).toBe(true);
    expect(fs.existsSync(icon512Path)).toBe(true);
    expect(fs.existsSync(appleTouchPath)).toBe(true);

    expect(fs.statSync(icon192Path).size).toBeGreaterThan(0);
    expect(fs.statSync(icon512Path).size).toBeGreaterThan(0);
    expect(fs.statSync(appleTouchPath).size).toBeGreaterThan(0);
  });
});

