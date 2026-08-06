import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { slugSchema } from "@/lib/validation";
import useFetch from "@/hooks/useFetch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link2, AlertCircle, CheckCircle } from "lucide-react";
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

  // Handle successful fetch and redirect
  useEffect(() => {
    if (loading || !data?.original_url) return undefined;

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
      window.location.replace(data.original_url);
    }, 3000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  if (error && !loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Card className="w-full max-w-lg border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-destructive">
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

  const isReady = !loading && data?.original_url;

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div
            className="flex size-16 items-center justify-center rounded-full bg-primary/10"
            role="status"
            aria-live="polite"
          >
            {isReady ? (
              <CheckCircle
                className="size-8 text-emerald-500 animate-in zoom-in"
                aria-hidden="true"
              />
            ) : (
              <Link2 className="size-8 animate-pulse text-primary" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">
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
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Destination URL */}
          {data?.original_url && (
            <div className="w-full rounded-lg border bg-muted/40 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Destination
              </p>
              <a
                href={data.original_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline"
              >
                <span className="truncate">{data.original_url}</span>
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            If you're not redirected automatically,{" "}
            {data?.original_url ? (
              <a
                href={data.original_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
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
