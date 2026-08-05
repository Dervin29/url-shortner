import { cn } from "@/lib/utils";

const PageLoader = ({ label = "Loading...", className }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[40vh] w-full flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div className="relative flex size-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        <span className="sr-only">{label}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default PageLoader;
