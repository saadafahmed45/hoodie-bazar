import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-nivora-light", className)}
      {...props}
    />
  );
}

export { Skeleton };
