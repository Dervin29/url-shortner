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
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
import EditLink from "@/components/EditLink";
import CopyButton from "@/components/CopyButton";
import { useTheme } from "@/context/theme";

const LinkPage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = UrlState();
  const { theme } = useTheme();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [hasRequestedUrl, setHasRequestedUrl] = useState(false);

  const { loading, data: url, fn: fnGetUrl, error } = useFetch(getUrl, {
    id,
    user_id: user?.id,
  });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
    error: statsError,
  } = useFetch(getClicksForUrl, id);

  useEffect(() => {
    if (user?.id && id && !hasRequestedUrl) {
      setHasRequestedUrl(true);
      fnGetUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, id, hasRequestedUrl]);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-full max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-28" />
            ))}
          </div>
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </CardContent>
        </Card>
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
    primary: isDark ? "#60A5FA" : "#2563EB",
    grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.08)",
    axisText: isDark ? "rgba(148, 163, 184, 1)" : "rgba(100, 116, 139, 1)",
    cursor: isDark ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.4)",
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* Left: link details */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Button
          variant="ghost"
          className="-ml-2 w-fit gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Dashboard
        </Button>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
              {url?.title || "Untitled Link"}
            </h1>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Active
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 break-all font-mono text-lg font-semibold text-primary hover:underline"
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

          <a
            href={url?.original_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-start gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline sm:text-base"
          >
            <LinkIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{url?.original_url}</span>
          </a>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" aria-hidden="true" />
            <span>Created {createdDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={shortUrl}
            variant="outline"
            size="default"
            label="Copy Link"
            successLabel="Copied"
            className="gap-2"
          >
            Copy Link
          </CopyButton>

          <Button variant="outline" onClick={downloadImage} disabled={!url?.qr}>
            <Download className="size-4" aria-hidden="true" />
            Download QR
          </Button>

          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
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
                  className="gap-2"
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
                  ? This action cannot be undone and all analytics data will be
                  permanently removed.
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
          <div className="flex justify-center lg:justify-start">
            <img
              src={url.qr}
              alt={`QR code for ${url?.title || "link"}`}
              className="w-48 rounded-xl border bg-white p-3 shadow-sm transition-transform hover:scale-105 sm:w-56"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Right: statistics */}
      <Card className="h-fit lg:col-span-3">
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
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
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
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clicks
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                {totalClicks.toLocaleString()}
              </p>
            </div>

            {/* Clicks over time */}
            {clicksOverTime.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Clicks Over Time</h3>
                <div className="h-56 rounded-xl border p-4">
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

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Location Analytics</h3>
              <LocationStats stats={stats} />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Device Analytics</h3>
              <DeviceStats stats={stats} />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LinkPage;
