import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  LinkIcon,
  MousePointerClick,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { UrlState } from "@/context/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrlBySlug } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
import EditLink from "@/components/EditLink";
import CopyButton from "@/components/CopyButton";
import { useTheme } from "@/context/theme";

const SectionLabel = ({ children }) => (
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    {children}
  </p>
);

const ActiveBadge = () => (
  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-500">
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-40" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
    Active
  </span>
);

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { theme } = useTheme();
  const { slug } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { loading, data: url, fn: fnGetUrl, error } = useFetch(getUrlBySlug, {
    slug,
    user_id: user?.id,
  });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
    error: statsError,
  } = useFetch(getClicksForUrl, url?.id);

  useEffect(() => {
    if (user?.id && slug) {
      fnGetUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, slug]);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  const refreshStats = () => fnStats();

  useEffect(() => {
    if (url) {
      fnStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (!url) return undefined;
    const handleVisibility = () => {
      if (!document.hidden) fnStats();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const clicksOverTime = useMemo(() => {
    if (!stats) return [];
    const buckets = {};
    stats.forEach((item) => {
      const day = new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      buckets[day] = (buckets[day] || 0) + 1;
    });
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  }, [stats]);

  const downloadImage = () => {
    if (!url?.qr) {
      toast.error("QR code not available");
      return;
    }

    try {
      const anchor = document.createElement("a");
      anchor.href = url.qr;
      anchor.download = `${url.title || "qrcode"}-qrcode.png`;
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      toast.success("QR code downloaded");
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  const handleDelete = async () => {
    const result = await fnDelete();
    if (result) {
      toast.success("Link deleted");
      setIsDeleteDialogOpen(false);
      navigate("/dashboard");
    } else {
      toast.error("Failed to delete link");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-6 h-5 w-36" />
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-5">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <Skeleton className="size-44 rounded-2xl" />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-7">
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-16 w-40 rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="h-72 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
          <LinkIcon className="size-7 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Link not found</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            This link may have been removed, or you don't have access to it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fnGetUrl()}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const shortUrl = `${import.meta.env.VITE_APP_URL}/${
    url?.custom_url || url?.short_url
  }`;
  const createdDate = url?.created_at
    ? new Date(url.created_at).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const totalClicks = stats?.length || 0;

  const isDark = theme === "dark";
  const chartColors = {
    primary: isDark ? "#60A5FA" : "#3B82F6",
    grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(24, 24, 27, 0.07)",
    axisText: isDark ? "rgba(161, 161, 170, 1)" : "rgba(113, 113, 122, 1)",
    cursor: isDark ? "rgba(161, 161, 170, 0.4)" : "rgba(113, 113, 122, 0.4)",
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Button
        variant="ghost"
        className="-ml-2 mb-6 w-fit gap-2"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left: link details */}
        <Card className="lg:col-span-5">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SectionLabel>Link details</SectionLabel>
                <h1 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                  {url?.title || "Untitled Link"}
                </h1>
              </div>
              <ActiveBadge />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Short link pill */}
            <div>
              <SectionLabel>Short link</SectionLabel>
              <div className="mt-2 flex min-w-0 items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1.5 pl-3">
                <LinkIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={shortUrl}
                  className="min-w-0 flex-1 truncate font-mono text-sm font-medium text-primary hover:underline"
                >
                  {shortUrl}
                </a>
                <CopyButton
                  text={shortUrl}
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Open shortened link in new tab"
                  title="Open link"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Destination */}
            <div className="min-w-0">
              <SectionLabel>Destination</SectionLabel>
              <a
                href={url?.original_url}
                target="_blank"
                rel="noreferrer"
                title={url?.original_url}
                className="mt-1.5 flex items-start gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
              >
                <ExternalLink
                  className="mt-0.5 size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 break-all">
                  {url?.original_url}
                </span>
              </a>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Created {createdDate}</span>
            </div>

            <div className="border-t border-border" />

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <CopyButton
                text={shortUrl}
                variant="default"
                size="default"
                label="Copy link"
                successLabel="Copied"
                className="w-full gap-2 sm:w-auto"
              >
                Copy Link
              </CopyButton>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={downloadImage}
                disabled={!url?.qr}
              >
                <Download className="size-4" aria-hidden="true" />
                Download QR
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Button>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      disabled={loadingDelete}
                      className="col-span-2 w-full gap-2 sm:col-span-1 sm:w-auto"
                    >
                      {loadingDelete ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-destructive-foreground/40 border-t-destructive-foreground" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="size-4" aria-hidden="true" />
                          Delete
                        </>
                      )}
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <Trash2 className="size-5" aria-hidden="true" />
                      Delete Link
                    </DialogTitle>
                    <DialogDescription className="pt-1">
                      Are you sure you want to delete{" "}
                      <span className="font-medium text-foreground">
                        {url?.title || "this link"}
                      </span>
                      ? This action cannot be undone and all analytics data will
                      be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-2">
                    <DialogClose
                      render={
                        <Button variant="outline" disabled={loadingDelete}>
                          Cancel
                        </Button>
                      }
                    />
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={loadingDelete}
                      className="min-w-24"
                    >
                      {loadingDelete ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <EditLink
              url={url}
              fetchUrls={fnGetUrl}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            />

            {/* QR Code */}
            {url?.qr && (
              <div className="flex justify-center border-t border-border pt-6">
                <div className="w-fit rounded-2xl border border-border bg-background p-3 shadow-card">
                  <img
                    src={url.qr}
                    alt={`QR code for ${url?.title || "link"}`}
                    className="size-44 rounded-lg sm:size-48"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: statistics */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold sm:text-2xl">
              Statistics
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={refreshStats}
              disabled={loadingStats}
              aria-label="Refresh statistics"
              title="Refresh statistics"
            >
              <RefreshCw
                className={cn("size-4", loadingStats && "animate-spin")}
                aria-hidden="true"
              />
            </Button>
          </CardHeader>

          {statsError ? (
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-destructive">
                {statsError.message || "Failed to load statistics"}
              </p>
              <Button variant="outline" size="sm" onClick={refreshStats}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </Button>
            </CardContent>
          ) : loadingStats || stats === null ? (
            <CardContent className="space-y-6">
              <Skeleton className="h-16 w-44 rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="h-72 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
              </div>
            </CardContent>
          ) : stats.length === 0 ? (
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/40">
                <MousePointerClick
                  className="size-7 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-base font-semibold">No clicks yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Share your short link to start collecting analytics. Clicks will
                appear here in real time.
              </p>
              <CopyButton
                text={shortUrl}
                variant="outline"
                size="sm"
                className="mt-1 gap-2"
              >
                Copy Link
              </CopyButton>
            </CardContent>
          ) : (
            <CardContent className="space-y-8">
              {/* Total clicks */}
              <div className="flex items-end justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
                <div className="min-w-0">
                  <SectionLabel>Total clicks</SectionLabel>
                  <p className="mt-1.5 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
                    {totalClicks.toLocaleString()}
                  </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MousePointerClick className="size-5" aria-hidden="true" />
                </div>
              </div>

              {/* Clicks over time */}
              {clicksOverTime.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Clicks Over Time</h3>
                  <div className="h-56 rounded-2xl border p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={clicksOverTime}
                        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                      >
                        <defs>
                          <linearGradient
                            id="clicksGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={chartColors.primary}
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor={chartColors.primary}
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartColors.grid}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: chartColors.axisText }}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={24}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: chartColors.axisText }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ stroke: chartColors.cursor }}
                          contentStyle={{
                            borderRadius: 10,
                            border: "1px solid var(--border)",
                            background: "var(--popover)",
                            color: "var(--popover-foreground)",
                            fontSize: 13,
                          }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke={chartColors.primary}
                          strokeWidth={2.5}
                          fill="url(#clicksGradient)"
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Location</h3>
                  <LocationStats stats={stats} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Devices</h3>
                  <DeviceStats stats={stats} />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;
