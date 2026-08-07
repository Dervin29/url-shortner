import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-sm border border-foreground/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
