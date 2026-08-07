import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] select-none",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        success: "bg-success-surface text-success",
        danger: "bg-danger-surface text-danger-fg",
        warning: "bg-warning-surface text-warning",
        info: "bg-info-surface text-info-fg",
        outline: "border border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
