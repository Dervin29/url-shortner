import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[4px] border border-foreground px-2 py-0.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.06em] select-none",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        primary: "bg-primary text-primary-foreground",
        success: "bg-success text-success-foreground",
        danger: "bg-danger-surface text-danger-fg",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info-surface text-info-fg",
        outline: "bg-background text-foreground",
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
