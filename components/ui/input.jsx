import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full bg-white px-3.5 py-2 text-sm text-[#111111] border border-[#E2E2E2] transition-colors placeholder:text-[#888888] focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-1 focus-visible:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
