import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Link2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RedirectLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const { loading, data, error, fn: fnGetUrl } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStoreClicks } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  // Fetch the URL data
  useEffect(() => {
    if (id) {
      fnGetUrl();
    } else {
      toast.error("Invalid link");
      navigate("/");
    }
  }, [id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Link not found or has been removed");
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  // Handle successful fetch and redirect
  useEffect(() => {
    if (!loading && data?.original_url) {
      // Store click stats
      fnStoreClicks();

      // Start countdown
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Redirect after countdown
      const redirectTimer = setTimeout(() => {
        window.location.replace(data.original_url);
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [loading, data]);

  // Handle case where link doesn't exist or is invalid
  if (error && !loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg border-destructive/20 bg-destructive/5 shadow-xl">
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-destructive">Link Not Found</h1>
              <p className="text-sm text-muted-foreground">
                {error.message || "This link may have been removed or is invalid."}
              </p>
            </div>

            <Button onClick={() => navigate("/")} variant="outline" className="mt-2">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show countdown when data is loaded
  const isReady = !loading && data?.original_url;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg border-border/50 bg-background/80 backdrop-blur-sm shadow-xl transition-all hover:shadow-2xl">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all">
            {isReady ? (
              <CheckCircle className="h-8 w-8 text-green-500 animate-in zoom-in" />
            ) : (
              <Link2 className="h-8 w-8 text-primary animate-pulse" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">
              {isReady ? "Redirecting..." : "Loading..."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isReady 
                ? `You will be redirected in ${countdown} second${countdown !== 1 ? 's' : ''}`
                : "Please wait while we find your link..."
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs">
            <BarLoader
              width="100%"
              color="hsl(var(--primary))"
              loading={loading || loadingStats || !isReady}
              height={4}
            />
            {isReady && (
              <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${(3 - countdown) / 3 * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Destination URL */}
          {data?.original_url && (
            <div className="w-full rounded-lg border bg-muted/40 p-4 transition-all hover:bg-muted/60">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Destination
              </p>
              <a
                href={data.original_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline transition-colors"
              >
                <span className="truncate">{data.original_url}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            </div>
          )}

          {/* Manual redirect link */}
          <p className="text-xs text-muted-foreground">
            If you're not redirected automatically,{" "}
            {data?.original_url ? (
              <a
                href={data.original_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
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