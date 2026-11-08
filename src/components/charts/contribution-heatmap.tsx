"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { ContributionDay } from "@/types";
import { ChevronDown, Flame } from "lucide-react";
import { motion } from "motion/react";

interface ContributionHeatmapProps {
  className?: string;
  data?: ContributionDay[];
}

type LevelColors = Record<0 | 1 | 2 | 3 | 4, string>;

interface HeatmapPalette {
  label: string;
  /** Grid cell and legend box classes for contribution levels 0-4. */
  levels: LevelColors;
  /** Accent classes used for the header glow, icon, tooltip text and hover ring. */
  ambience: string;
  iconWrap: string;
  icon: string;
  tooltipText: string;
  hoverRing: string;
}

// Class names are written out in full (not built from fragments) so Tailwind can detect them.
const PALETTES = {
  cyberpunk: {
    label: "Cyberpunk",
    levels: {
      0: "bg-white/5 border-white/5",
      1: "bg-purple-900/40 border-purple-800/50",
      2: "bg-purple-700/60 border-purple-600/50 shadow-[0_0_8px_rgba(126,34,206,0.3)]",
      3: "bg-fuchsia-500/80 border-fuchsia-400/50 shadow-[0_0_12px_rgba(217,70,239,0.5)]",
      4: "bg-pink-400 border-pink-300 shadow-[0_0_16px_rgba(244,114,182,0.8)]",
    },
    ambience: "bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
    iconWrap: "bg-fuchsia-500/20 border-fuchsia-500/20",
    icon: "text-fuchsia-400",
    tooltipText: "text-fuchsia-400",
    hoverRing: "ring-fuchsia-500/50",
  },
  github: {
    label: "GitHub Classic",
    levels: {
      0: "bg-white/5 border-white/5",
      1: "bg-emerald-900/40 border-emerald-800/50",
      2: "bg-emerald-700/60 border-emerald-600/50 shadow-[0_0_8px_rgba(4,120,87,0.3)]",
      3: "bg-green-500/80 border-green-400/50 shadow-[0_0_12px_rgba(34,197,94,0.5)]",
      4: "bg-green-400 border-green-300 shadow-[0_0_16px_rgba(74,222,128,0.8)]",
    },
    ambience: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconWrap: "bg-emerald-500/20 border-emerald-500/20",
    icon: "text-emerald-400",
    tooltipText: "text-emerald-400",
    hoverRing: "ring-emerald-500/50",
  },
  solar: {
    label: "Solar Ember",
    levels: {
      0: "bg-white/5 border-white/5",
      1: "bg-amber-900/40 border-amber-800/50",
      2: "bg-amber-700/60 border-amber-600/50 shadow-[0_0_8px_rgba(180,83,9,0.3)]",
      3: "bg-orange-500/80 border-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.5)]",
      4: "bg-red-400 border-red-300 shadow-[0_0_16px_rgba(248,113,113,0.8)]",
    },
    ambience: "bg-orange-500/10 group-hover:bg-orange-500/20",
    iconWrap: "bg-orange-500/20 border-orange-500/20",
    icon: "text-orange-400",
    tooltipText: "text-orange-400",
    hoverRing: "ring-orange-500/50",
  },
  ice: {
    label: "Neon Ice",
    levels: {
      0: "bg-white/5 border-white/5",
      1: "bg-cyan-900/40 border-cyan-800/50",
      2: "bg-sky-700/60 border-sky-600/50 shadow-[0_0_8px_rgba(3,105,161,0.3)]",
      3: "bg-sky-400/80 border-sky-300/50 shadow-[0_0_12px_rgba(56,189,248,0.5)]",
      4: "bg-indigo-300 border-indigo-200 shadow-[0_0_16px_rgba(165,180,252,0.8)]",
    },
    ambience: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    iconWrap: "bg-cyan-500/20 border-cyan-500/20",
    icon: "text-cyan-400",
    tooltipText: "text-cyan-400",
    hoverRing: "ring-cyan-500/50",
  },
} satisfies Record<string, HeatmapPalette>;

type PaletteId = keyof typeof PALETTES;

const DEFAULT_PALETTE_ID: PaletteId = "cyberpunk";
const PALETTE_STORAGE_KEY = "codepulse_heatmap_theme";
const PALETTE_CHANGE_EVENT = "codepulse-heatmap-theme-change";
const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[];

function isPaletteId(value: string | null): value is PaletteId {
  return value !== null && Object.prototype.hasOwnProperty.call(PALETTES, value);
}

// The saved palette lives in localStorage, which React cannot observe on its own.
// useSyncExternalStore reads it without a hydration mismatch (the server render uses the default).
function subscribeToPalette(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PALETTE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PALETTE_CHANGE_EVENT, onChange);
  };
}

function getStoredPalette(): string | null {
  try {
    return window.localStorage.getItem(PALETTE_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall back to the default palette.
    return null;
  }
}

function getServerPalette(): string | null {
  return null;
}

function savePalette(id: PaletteId) {
  try {
    window.localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // Ignore write failures; the choice just will not persist.
  }
  // The "storage" event only fires in other tabs, so notify this tab ourselves.
  window.dispatchEvent(new Event(PALETTE_CHANGE_EVENT));
}

export function ContributionHeatmap({ className, data = [] }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const storedPalette = useSyncExternalStore(subscribeToPalette, getStoredPalette, getServerPalette);
  const paletteId = isPaletteId(storedPalette) ? storedPalette : DEFAULT_PALETTE_ID;
  const palette: HeatmapPalette = PALETTES[paletteId];
  const levelColors = palette.levels;

  // We only want to show the last 24 weeks (approx 6 months) to make the grid look dense and premium
  const gridData = useMemo(() => {
    const WEEKS_TO_SHOW = 24;
    const TOTAL_DAYS = WEEKS_TO_SHOW * 7;
    
    // Sort data chronologically (assuming it's given as an array)
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Get only the most recent days to fit our grid
    const recentData = sorted.slice(-TOTAL_DAYS);
    
    // If we don't have enough data, pad it at the beginning with 0 counts
    if (recentData.length < TOTAL_DAYS) {
      const paddingNeeded = TOTAL_DAYS - recentData.length;
      const firstDate = recentData.length > 0 ? new Date(recentData[0].date) : new Date();
      
      const paddedDays = [];
      for (let i = paddingNeeded; i > 0; i--) {
        const d = new Date(firstDate);
        d.setDate(d.getDate() - i);
        paddedDays.push({ date: d.toISOString().split('T')[0], count: 0, level: 0 } as ContributionDay);
      }
      return [...paddedDays, ...recentData];
    }
    
    return recentData;
  }, [data]);

  // Restructure into weeks (arrays of 7 days) for columns
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < gridData.length; i += 7) {
      w.push(gridData.slice(i, i + 7));
    }
    return w;
  }, [gridData]);

  // Helper to determine intensity level (0-4) based on counts
  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  return (
    <div className={cn("glass-card rounded-[32px] border border-white/5 p-8 relative overflow-hidden group h-full flex flex-col", className)}>
      {/* Background Ambience */}
      <div className={cn("absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none transition-colors duration-1000", palette.ambience)} />

      <div className="flex flex-col items-start gap-4 mb-8 relative z-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className={cn("p-2 rounded-xl border", palette.iconWrap)}>
              <Flame className={cn("w-5 h-5", palette.icon)} />
            </div>
            Activity Grid
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Your contribution density over the last 6 months.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Color palette selector */}
          <div className="relative shrink-0">
            <select
              aria-label="Heatmap color palette"
              value={paletteId}
              onChange={(e) => {
                if (isPaletteId(e.target.value)) savePalette(e.target.value);
              }}
              className="appearance-none bg-black/20 border border-white/10 text-white rounded-xl pl-3 pr-8 py-2 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {PALETTE_IDS.map((id) => (
                <option key={id} value={id} className="bg-slate-900 text-white">
                  {PALETTES[id].label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>

          {/* Dynamic Tooltip Area */}
          <div className="hidden sm:flex flex-col items-end min-h-[48px] justify-center">
            {hoveredDay ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <div className={cn("font-bold text-lg leading-none", palette.tooltipText)}>
                  {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  {new Date(hoveredDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </motion.div>
            ) : (
              <div className="text-slate-500 text-sm italic">Hover over the grid</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 overflow-x-auto pb-4">
        {/* The Grid */}
        <div className="flex gap-1.5 md:gap-2">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5 md:gap-2">
              {week.map((day, dIdx) => {
                const level = getLevel(day.count) as keyof LevelColors;
                return (
                  <motion.div
                    key={`${wIdx}-${dIdx}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wIdx * 0.02) + (dIdx * 0.01), duration: 0.3 }}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={cn(
                      "w-3 h-3 md:w-4 md:h-4 rounded-sm border cursor-pointer transition-all duration-300",
                      levelColors[level],
                      hoveredDay?.date === day.date ? cn("scale-125 z-10 border-white ring-2", palette.hoverRing) : "hover:scale-110"
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-slate-500 relative z-10">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={cn("w-3 h-3 rounded-sm border", levelColors[l as keyof LevelColors])} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
