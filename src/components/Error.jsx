import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Error = ({ message, id, className }) => {
  if (!message) return null;

  return (
    <p
      role="alert"
      id={id}
      className={cn(
        "flex items-start gap-1.5 text-sm text-destructive",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
};

export default Error;
