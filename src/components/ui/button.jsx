/* eslint-disable react-refresh/only-export-components */
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[4px] border text-sm font-bold whitespace-nowrap transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out outline-none select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 disabled:active:scale-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-primary text-primary-foreground shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-button-pressed active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        outline:
          "border-foreground bg-background text-foreground shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-button-pressed hover:bg-muted/40 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        secondary:
          "border-foreground bg-secondary text-secondary-foreground shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-button-pressed active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-muted aria-expanded:bg-muted dark:hover:bg-muted/60",
        destructive:
          "border-foreground bg-destructive text-destructive-foreground shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-button-pressed active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        link: "border-transparent bg-transparent text-foreground underline underline-offset-4 hover:text-secondary",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
