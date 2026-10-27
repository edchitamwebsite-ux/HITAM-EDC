import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hitam" | "amber" | "outline" | "danger" | "cyan";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    hitam: "bg-hitam-950/80 text-hitam-300 border-hitam-500/30",
    amber: "bg-amber-950/80 text-amber-300 border-amber-500/30",
    cyan: "bg-cyan-950/80 text-cyan-300 border-cyan-500/30",
    danger: "bg-red-950/80 text-red-300 border-red-500/30",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
