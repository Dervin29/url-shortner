/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const COPY_DURATION = 2000;

export async function writeToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

const CopyButton = ({
  text,
  label = "Copy link",
  successLabel = "Copied",
  toastMessage = "Copied to clipboard",
  variant = "ghost",
  size = "icon",
  className,
  showToast = true,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await writeToClipboard(text);
    setCopied(true);
    if (showToast) toast.success(toastMessage);
    window.setTimeout(() => setCopied(false), COPY_DURATION);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={copied ? successLabel : label}
      title={copied ? successLabel : label}
    >
      {copied ? (
        <Check weight="bold" className="text-success" aria-hidden="true" />
      ) : (
        <Copy weight="bold" aria-hidden="true" />
      )}
      {children && (
        <span className="hidden sm:inline">{copied ? successLabel : children}</span>
      )}
      {copied && <span aria-live="polite" className="sr-only">{successLabel}</span>}
    </Button>
  );
};

export default CopyButton;
