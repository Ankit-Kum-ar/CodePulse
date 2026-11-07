"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  Eye,
  Star,
  GitFork,
  Trophy,
  ArrowUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { Activity } from "@/types";

const activityIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  commit: { icon: GitCommit, color: "text-purple-400", bg: "bg-purple-500/10" },
  pull_request: { icon: GitPullRequest, color: "text-blue-400", bg: "bg-blue-500/10" },
  issue: { icon: CircleDot, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  review: { icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  star: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  fork: { icon: GitFork, color: "text-orange-400", bg: "bg-orange-500/10" },
  achievement: { icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10" },
  level_up: { icon: ArrowUp, color: "text-pink-400", bg: "bg-pink-500/10" },
};

export type ActivityFilterType = "all" | "commits" | "prs" | "issues" | "achievements";

interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
  maxItems?: number;
}

export function ActivityTimeline({
  activities = [],
  className,
  maxItems = 8,
}: ActivityTimelineProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityFilterType>("all");

  // Calculate count for each category
  const counts = useMemo(() => {
    let commits = 0;
    let prs = 0;
    let issues = 0;
    let achievements = 0;

    activities.forEach((activity) => {
      const type = activity.type.toLowerCase();
      if (type === "commit") {
        commits++;
      } else if (type === "pull_request" || type === "pr") {
        prs++;
      } else if (type === "issue") {
        issues++;
      } else if (type === "achievement") {
        achievements++;
      }
    });

    return {
      all: activities.length,
      commits,
      prs,
      issues,
      achievements,
    };
  }, [activities]);

  const filterPills: { id: ActivityFilterType; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "commits", label: "Commits", count: counts.commits },
    { id: "prs", label: "PRs", count: counts.prs },
    { id: "issues", label: "Issues", count: counts.issues },
    { id: "achievements", label: "Achievements", count: counts.achievements },
  ];

  // Filter activities array in memory
  const filteredActivities = useMemo(() => {
    if (selectedFilter === "all") return activities;
    return activities.filter((activity) => {
      const type = activity.type.toLowerCase();
      switch (selectedFilter) {
        case "commits":
          return type === "commit";
        case "prs":
          return type === "pull_request" || type === "pr";
        case "issues":
          return type === "issue";
        case "achievements":
          return type === "achievement";
        default:
          return true;
      }
    });
  }, [activities, selectedFilter]);

  const displayActivities = filteredActivities.slice(0, maxItems);

  return (
    <div className={cn("glass-card rounded-[20px] p-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterPills.map((pill) => {
            const isActive = selectedFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedFilter(pill.id)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-white/5 border-transparent text-muted-foreground hover:text-white hover:bg-white/10"
                )}
              >
                <span>{pill.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-slate-400"
                  )}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => {
              const config =
                activityIcons[activity.type.toLowerCase()] || activityIcons.commit;
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    delay: index * 0.03,
                  }}
                  className="flex items-start gap-3 py-3 group"
                >
                  {/* Icon + Timeline line */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        config.bg
                      )}
                    >
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    {index < displayActivities.length - 1 && (
                      <div className="w-px h-full bg-white/5 absolute top-10 left-1/2 -translate-x-1/2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {activity.repository && (
                        <span className="text-xs text-primary/80 font-mono bg-primary/5 px-1.5 py-0.5 rounded">
                          {activity.repository}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 my-2"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground mb-2.5">
                <Filter className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                No {selectedFilter !== "all" ? selectedFilter : ""} activities found
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedFilter !== "all"
                  ? `There are no ${selectedFilter} in the recent activity stream.`
                  : "No recent activity available."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
