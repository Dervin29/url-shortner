import { cn } from "@/lib/utils";

const Spinner = ({ className }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
      className,
    )}
  />
);

export default Spinner;
