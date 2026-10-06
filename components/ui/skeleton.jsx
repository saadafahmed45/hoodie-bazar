import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-[#EEEEEE]", className)}
      {...props}
    />
  );
}

export { Skeleton };
