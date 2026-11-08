import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "teal" | "navy";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

    const variants = {
      primary: "bg-navy-900 hover:bg-navy-800 text-white shadow-subtle border border-navy-950",
      navy: "bg-navy-900 hover:bg-navy-800 text-white shadow-subtle border border-navy-950",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200",
      outline: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-subtle",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-subtle border border-red-700",
      teal: "bg-teal-600 hover:bg-teal-700 text-white shadow-subtle border border-teal-700",
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
