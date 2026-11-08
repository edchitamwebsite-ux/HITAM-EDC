import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "navy" | "teal" | "amber" | "outline" | "danger" | "hitam";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    navy: "bg-navy-50 text-navy-900 border-navy-200",
    teal: "bg-teal-50 text-teal-800 border-teal-200",
    hitam: "bg-teal-50 text-teal-800 border-teal-200", // backward compatibility alias
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-white text-slate-700 border-slate-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
