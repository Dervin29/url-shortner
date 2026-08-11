import { useEffect, useState } from "react";
import { WifiSlash, ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

// Real connectivity probe — navigator.onLine only reflects the OS link state,
// so confirm by fetching a small static asset before declaring "back online".
const probe = async () => {
  try {
    const res = await fetch("/favicon.svg", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
};

const OfflineBanner = () => {
  const [online, setOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine,
  );
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    setOnline(await probe());
    setRetrying(false);
  };

  if (online) return null;

  return (
    <div
      role="alert"
      className="border-b-2 border-foreground bg-warning"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="flex min-w-0 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-warning-foreground">
          <WifiSlash weight="bold" className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            You're offline — the app shell is cached, but live data can't load
          </span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={retrying}
          className="shrink-0 bg-background shadow-button-sm hover:shadow-button-pressed"
        >
          {retrying ? (
            <>
              <ArrowClockwise className="animate-spin" aria-hidden="true" />
              Checking...
            </>
          ) : (
            "Retry"
          )}
        </Button>
      </div>
    </div>
  );
};

export default OfflineBanner;
