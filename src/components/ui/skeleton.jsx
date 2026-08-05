import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted dark:bg-muted/60", className)}
      {...props}
    />
  );
}

export { Skeleton };
