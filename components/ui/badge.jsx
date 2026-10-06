import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[#111111] text-white",
    lime: "bg-[#B6E600] text-[#111111] font-bold",
    outline: "border border-[#111111] text-[#111111] bg-transparent",
    secondary: "bg-[#F5F5F3] text-[#111111] border border-[#E2E2E2]",
    sale: "bg-[#B6E600] text-[#111111] font-bold tracking-widest",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
