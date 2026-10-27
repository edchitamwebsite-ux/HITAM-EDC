import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hitam-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary: "bg-hitam-600 hover:bg-hitam-500 text-white shadow-sm hover:shadow-glow-sm border border-hitam-500/30",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
      outline: "bg-transparent hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600",
      ghost: "bg-transparent hover:bg-slate-850 text-slate-300 hover:text-white",
      danger: "bg-red-600/90 hover:bg-red-600 text-white shadow-sm border border-red-500/30",
      subtle: "bg-hitam-950/60 hover:bg-hitam-900/60 text-hitam-300 border border-hitam-700/40",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
