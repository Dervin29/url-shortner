import { cn } from "@/lib/utils";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-border bg-muted/40">
          <Icon weight="bold" className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <h3 className="font-sans text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
