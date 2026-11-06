"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LeaderboardRowSkeletonProps {
  className?: string;
}

export function LeaderboardRowSkeleton({ className }: LeaderboardRowSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden relative",
        className
      )}
      aria-hidden="true"
    >
      {/* Rank Badge & Avatar & User Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 flex justify-center">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        <Skeleton className="w-12 h-12 rounded-full shrink-0" />

        <div className="flex-1 min-w-[150px] space-y-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
      </div>

      {/* Stats Grid matching Repos, Followers, Stars, Language */}
      <div className="grid grid-cols-4 gap-4 flex-1 mt-4 sm:mt-0 items-center justify-items-center sm:justify-items-end text-sm">
        <div className="flex flex-col items-center sm:items-end space-y-1.5">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-4 w-8 rounded" />
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-1.5">
          <Skeleton className="h-3 w-14 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-1.5">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-1.5">
          <Skeleton className="h-3 w-14 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

interface LeaderboardTableSkeletonProps {
  count?: number;
  className?: string;
}

export function LeaderboardTableSkeleton({
  count = 8,
  className,
}: LeaderboardTableSkeletonProps) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="status"
      aria-label="Loading leaderboard rankings"
    >
      {Array.from({ length: count }).map((_, i) => (
        <LeaderboardRowSkeleton key={i} />
      ))}
    </div>
  );
}
