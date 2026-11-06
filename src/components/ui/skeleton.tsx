"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string;
  shimmer?: boolean;
  children?: React.ReactNode;
}

function Skeleton({
  className,
  shimmer = true,
  children,
  ...props
}: SkeletonProps) {
  return (
    <motion.div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/80 dark:bg-white/[0.05] backdrop-blur-[2px]",
        className
      )}
      {...props}
    >
      {shimmer && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
            repeatDelay: 0.15,
          }}
          className="absolute inset-0 z-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] dark:via-white/[0.06] to-transparent pointer-events-none"
        />
      )}
      {children}
    </motion.div>
  );
}

export { Skeleton };
export type { SkeletonProps };
