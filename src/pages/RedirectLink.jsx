import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { longUrlSchema, slugSchema } from "@/lib/validation";
import useFetch from "@/hooks/useFetch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowSquareOut, LinkSimple, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { toast } from "sonner";

const RedirectLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const { loading, data, error, fn: fnGetUrl } = useFetch(getLongUrl, id);
  const { fn: fnStoreClicks } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  // Never trust the value returned by the database. Reuse the same schema used
  // at creation time: a proper URL() parse that only accepts http/https. If bad
  // data somehow exists, safeUrl is null and we refuse to navigate anywhere.
  let safeUrl = null;
  if (data?.original_url) {
    try {
      safeUrl = longUrlSchema.validateSync(data.original_url);
    } catch {
      safeUrl = null;
    }
  }

  // Fetch the URL data
  useEffect(() => {
    if (id && slugSchema.isValidSync(id)) {
      fnGetUrl();
    } else {
      toast.error("Invalid link");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle errors
  useEffect(() => {
    if (!error) return undefined;
    toast.error(error.message || "Link not found or has been removed");
    const timer = window.setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [error, navigate]);

  // Handle fetched data that is not a valid http(s) URL
  useEffect(() => {
    if (loading || !data || safeUrl) return undefined;
    toast.error("This link is invalid or has been removed");
    const timer = window.setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [loading, data, safeUrl, navigate]);

  // Handle successful fetch and redirect
  useEffect(() => {
    if (loading || !safeUrl) return undefined;

    fnStoreClicks();

    const countdownInterval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = window.setTimeout(() => {
      window.location.replace(safeUrl);
    }, 3000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, safeUrl]);

  if (error && !loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Card className="w-full max-w-lg border-destructive/40 bg-danger-surface">
          <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-danger-surface">
              <WarningCircle weight="bold" className="size-8 text-destructive" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-display text-2xl font-black text-destructive">
                Link Not Found
              </h1>
              <p className="text-sm text-muted-foreground">
                {error.message || "This link may have been removed or is invalid."}
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="mt-1"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReady = !loading && safeUrl;

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div
            className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/40"
            role="status"
            aria-live="polite"
          >
            {isReady ? (
              <CheckCircle
                weight="bold"
                className="size-8 text-success animate-in zoom-in"
                aria-hidden="true"
              />
            ) : (
              <LinkSimple weight="bold" className="size-8 animate-pulse text-foreground" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-2 text-center">
            <h1 className="font-display text-2xl font-black tracking-[-0.02em]">
              {isReady ? "Redirecting..." : "Loading..."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isReady
                ? `You will be redirected in ${countdown} second${
                    countdown !== 1 ? "s" : ""
                  }`
                : "Please wait while we find your link..."}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-[4px] border border-border bg-muted">
              <div
                className="h-full rounded-[4px] bg-secondary transition-all duration-1000 ease-linear"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Destination URL */}
          {safeUrl && (
            <div className="w-full rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Destination
              </p>
              <a
                href={safeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 break-all text-sm font-bold text-secondary hover:underline"
              >
                <span className="truncate">{safeUrl}</span>
                <ArrowSquareOut weight="bold" className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            If you're not redirected automatically,{" "}
            {safeUrl ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-secondary hover:underline"
              >
                click here
              </a>
            ) : (
              "please wait..."
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedirectLink;
