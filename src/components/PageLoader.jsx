import { cn } from "@/lib/utils";
import { Scissors } from "@phosphor-icons/react";

const PageLoader = ({ label = "Loading...", className }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col items-center gap-8 py-12",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-md bg-brand-soft text-brand">
        <Scissors weight="bold" className="size-5" aria-hidden="true" />
      </span>
      <div className="w-full space-y-4">
        <div className="skeleton-shimmer h-4 w-40 rounded-full" />
        <div className="skeleton-shimmer h-10 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-1/2 rounded-full" />
        <div className="skeleton-shimmer mt-8 h-28 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="skeleton-shimmer h-24 rounded-xl" />
          <div className="skeleton-shimmer h-24 rounded-xl" />
          <div className="skeleton-shimmer h-24 rounded-xl" />
        </div>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

export default PageLoader;
