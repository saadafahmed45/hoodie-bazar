import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

    const variants = {
      default:
        "bg-[#111111] text-white hover:bg-[#222222] active:scale-[0.99]",
      lime:
        "bg-[#B6E600] text-[#111111] hover:bg-[#A4CF00] active:scale-[0.99] font-bold",
      outline:
        "border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white",
      outlineWhite:
        "border border-white/50 bg-transparent text-white hover:bg-white hover:text-[#111111]",
      secondary:
        "bg-[#F5F5F3] text-[#111111] hover:bg-[#EEEEEE]",
      ghost:
        "hover:bg-[#F5F5F3] text-[#111111]",
      link:
        "text-[#111111] underline-offset-4 hover:underline normal-case tracking-normal",
      destructive:
        "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 px-4 text-[11px]",
      lg: "h-13 px-8 text-sm",
      icon: "h-10 w-10 p-0",
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
