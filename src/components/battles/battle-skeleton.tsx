"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Swords, Sparkles, Shield, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Skeleton card for active/recent battle listings
 */
export function BattleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-card rounded-[24px] p-6 relative overflow-hidden border border-white/5",
        className
      )}
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </div>

      {/* VS Section */}
      <div className="flex items-center justify-between gap-4">
        {/* Challenger */}
        <div className="flex-1 flex flex-col items-center text-center space-y-2">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-3 w-32 rounded mt-1" />
        </div>

        {/* Center VS */}
        <div className="shrink-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground/60">VS</span>
          </div>
        </div>

        {/* Opponent */}
        <div className="flex-1 flex flex-col items-center text-center space-y-2">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-3 w-32 rounded mt-1" />
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-5">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for the Head-to-Head Battle Arena stats showdown
 */
export function BattleStatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8 max-w-5xl mx-auto", className)} aria-hidden="true">
      {/* Top Bar - Power Meter */}
      <div className="glass-card p-4 rounded-[20px] flex items-center justify-between gap-4 border border-white/5">
        <div className="w-24 flex justify-center">
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>

        <div className="flex-1 h-4 rounded-full bg-black/40 overflow-hidden flex relative items-center justify-center">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Swords className="w-3.5 h-3.5 text-white/50" />
            </div>
          </div>
        </div>

        <div className="w-24 flex justify-center">
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>

      {/* Main 2-Fighter Showdown */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center min-h-[400px]">
        {/* Player 1 Card */}
        <div className="glass-card rounded-[32px] p-8 border border-white/5 flex flex-col items-center md:items-end space-y-4">
          <Skeleton className="w-32 h-32 rounded-3xl mb-1" />
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-md" />

          {/* Stat rows */}
          <div className="w-full mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-5 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Divider / VS */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 flex items-center justify-center">
            <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-500">
              VS
            </span>
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="glass-card rounded-[32px] p-8 border border-white/5 flex flex-col items-center md:items-start space-y-4">
          <Skeleton className="w-32 h-32 rounded-3xl mb-1" />
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-md" />

          {/* Stat rows */}
          <div className="w-full mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-5 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Coordinated Matchmaking & Battle Initiation Loading Screen
 */
export function BattleMatchmakingSkeleton({
  p1Username,
  p2Username,
  battleType = "Overall Battle",
  className,
}: {
  p1Username?: string;
  p2Username?: string;
  battleType?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full max-w-5xl mx-auto space-y-8", className)}
      role="status"
      aria-label="Matchmaking and fetching battle statistics"
    >
      {/* Matchmaking Status Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Matchmaking & Computing Battle Metrics...</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Synchronizing <span className="gradient-text">{battleType}</span>
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
          Fetching commit graphs, pull requests, stars, and language telemetry from GitHub.
        </p>
      </div>

      {/* Top Power Meter Skeleton */}
      <div className="glass-card p-4 rounded-[20px] flex items-center justify-between gap-4 border border-white/5">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <div className="flex-1 h-3 rounded-full bg-black/30 overflow-hidden relative">
          <Skeleton className="w-full h-full" />
        </div>
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>

      {/* Fighters Matchup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Challenger Card */}
        <div className="glass-card rounded-[24px] p-6 border border-blue-500/20 bg-blue-500/[0.02] flex flex-col items-center space-y-3 relative overflow-hidden">
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              Challenger
            </span>
          </div>

          <div className="w-24 h-24 rounded-2xl border-2 border-blue-500/30 overflow-hidden relative mt-4">
            {p1Username ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://github.com/${p1Username}.png`}
                alt={p1Username}
                className="w-full h-full object-cover"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg text-white">
              {p1Username ? `@${p1Username}` : <Skeleton className="h-5 w-28 mx-auto" />}
            </h3>
            <Skeleton className="h-3.5 w-20 mx-auto rounded" />
          </div>

          {/* Quick Stats Skeleton */}
          <div className="w-full pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
          </div>
        </div>

        {/* Center VS Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <span className="font-black text-xl italic bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-pink-500">
              VS
            </span>
          </div>
        </div>

        {/* Opponent Card */}
        <div className="glass-card rounded-[24px] p-6 border border-pink-500/20 bg-pink-500/[0.02] flex flex-col items-center space-y-3 relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
              Opponent
            </span>
          </div>

          <div className="w-24 h-24 rounded-2xl border-2 border-pink-500/30 overflow-hidden relative mt-4">
            {p2Username ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://github.com/${p2Username}.png`}
                alt={p2Username}
                className="w-full h-full object-cover"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg text-white">
              {p2Username ? `@${p2Username}` : <Skeleton className="h-5 w-28 mx-auto" />}
            </h3>
            <Skeleton className="h-3.5 w-20 mx-auto rounded" />
          </div>

          {/* Quick Stats Skeleton */}
          <div className="w-full pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-10 mx-auto rounded mb-1" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Category Showdown Metric Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Commit History", icon: Swords, color: "text-blue-400" },
          { label: "Pull Requests", icon: Shield, color: "text-purple-400" },
          { label: "Star Impact", icon: Trophy, color: "text-amber-400" },
          { label: "Active Streak", icon: Flame, color: "text-pink-400" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-card rounded-[20px] p-4 border border-white/5 space-y-2 text-center"
          >
            <item.icon className={cn("w-5 h-5 mx-auto mb-1", item.color)} />
            <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
            <Skeleton className="h-5 w-16 mx-auto rounded-md" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
