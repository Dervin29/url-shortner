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
  DownloadSimple,
  ArrowSquareOut,
  LinkSimple,
  CursorClick,
  PencilSimple,
  ArrowsClockwise,
  Trash,
  Copy,
  Check,
  Globe,
  DeviceMobile,
  Clock,
  TrendUp,
  Users,
  Eye,
  ShareNetwork,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Bento Card Components
const BentoCard = ({ children, className, variant = "default" }) => (
  <Card
    className={cn(
      "transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
      variant === "primary" && "bg-primary text-primary-foreground",
      className
    )}
  >
    {children}
  </Card>
);

const BentoMetric = ({ icon: Icon, label, value, change, trend }) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-current opacity-60">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-1 text-xs font-bold",
            trend === "up" ? "text-foreground bg-success border border-foreground shadow-card rounded-sm px-2 py-0.5  " : "text-destructive"
          )}
        >
          {change}
        </p>
      )}
    </div>
    <div className="rounded-[4px] border border-foreground bg-background p-2.5 shadow-button-sm">
      <Icon weight="bold" className="size-4.5 text-foreground" />
    </div>
  </div>
);

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { slug } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  }, [user?.id, slug]);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  const refreshStats = () => fnStats();

  useEffect(() => {
    if (url) {
      fnStats();
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;
    const handleVisibility = () => {
      if (!document.hidden) fnStats();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-8 h-5 w-32" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl md:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-full bg-danger-surface p-4">
          <LinkSimple weight="bold" className="size-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Link not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This link may have been removed or you don't have access to it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fnGetUrl()}>
            <ArrowsClockwise weight="bold" className="mr-2 size-4" />
            Retry
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft weight="bold" className="mr-2 size-4" />
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const shortUrl = `${import.meta.env.VITE_APP_URL.replace(/\/+$/, "")}/${
    url?.custom_url || url?.short_url
  }`;

  const totalClicks = stats?.length || 0;

  const chartColors = {
    primary: "var(--chart-1)",
    grid: "var(--border)",
    axisText: "var(--muted-foreground)",
    cursor: "color-mix(in oklab, var(--muted-foreground) 40%, transparent)",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft weight="bold" className="size-4" />
              Dashboard
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-3">
              <span className="max-w-[200px] truncate text-sm font-medium">
                {url?.title || "Untitled Link"}
              </span>
              <Badge variant="success" className="hidden sm:block">Active</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={refreshStats}
              disabled={loadingStats}
            >
              <ArrowsClockwise
                weight="bold"
                className={cn("size-3.5", loadingStats && "animate-spin")}
              />
              <span className=" hidden sm:block">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Row */}
          <BentoCard variant="primary" className="lg:col-span-1">
            <CardContent className="p-6">
              <BentoMetric
                icon={CursorClick}
                label="Total Clicks"
                value={totalClicks.toLocaleString()}
                change="+12% from last month"
                trend="up"
              />
            </CardContent>
          </BentoCard>

          <BentoCard className="lg:col-span-1">
            <CardContent className="p-6">
              <BentoMetric
                icon={Users}
                label="Unique Visitors"
                value={stats ? new Set(stats.map(s => s.ip)).size : 0}
                change="+8% from last month"
                trend="up"
              />
            </CardContent>
          </BentoCard>

          <BentoCard className="lg:col-span-1">
            <CardContent className="p-6">
              <BentoMetric
                icon={Eye}
                label="Avg. Views/Day"
                value={clicksOverTime.length > 0 ? Math.round(totalClicks / clicksOverTime.length) : 0}
              />
            </CardContent>
          </BentoCard>

          <BentoCard className="lg:col-span-1">
            <CardContent className="p-6">
              <BentoMetric
                icon={Clock}
                label="Created"
                value={new Date(url.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </CardContent>
          </BentoCard>

          {/* Link Details - Large Card */}
          <BentoCard className="md:col-span-2 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base font-bold">
                Link Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Short Link
                </label>
                <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-2 pl-3">
                  <LinkSimple weight="bold" className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">
                    {shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <Check weight="bold" className="size-3.5 text-success" />
                    ) : (
                      <Copy weight="bold" className="size-3.5" />
                    )}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ArrowSquareOut weight="bold" className="size-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <label className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Destination
                </label>
                <a
                  href={url?.original_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 flex items-start gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowSquareOut weight="bold" className="mt-0.5 size-3.5 shrink-0" />
                  <span className="line-clamp-2">{url?.original_url}</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <PencilSimple weight="bold" className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={downloadImage}
                  disabled={!url?.qr}
                >
                  <DownloadSimple weight="bold" className="size-3.5" />
                  QR
                </Button>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={loadingDelete}
                        className="gap-2"
                      />
                    }
                  >
                    <Trash weight="bold" className="size-3.5" />
                    Delete
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Link</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{url?.title}"? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loadingDelete}
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
            </CardContent>
          </BentoCard>

          {/* QR Code Card */}
          <BentoCard className="md:col-span-2 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base font-bold">
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {url?.qr ? (
                <div className="rounded-lg border border-border bg-white p-4 dark:bg-card">
                  <img
                    src={url.qr}
                    alt="QR Code"
                    className="size-40 rounded-md"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="rounded-full bg-muted/30 p-3">
                    <ShareNetwork weight="bold" className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No QR code available</p>
                </div>
              )}
            </CardContent>
          </BentoCard>

          {/* Chart - Full Width */}
          <BentoCard className="md:col-span-2 lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base font-bold">
                Clicks Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsError ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <p className="text-sm text-destructive">Failed to load stats</p>
                  <Button variant="outline" size="sm" onClick={refreshStats}>
                    Retry
                  </Button>
                </div>
              ) : loadingStats || stats === null ? (
                <Skeleton className="h-48 w-full rounded-xl" />
              ) : stats.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="rounded-full bg-muted/30 p-3">
                    <TrendUp weight="bold" className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No clicks yet. Share your link to start tracking!
                  </p>
                </div>
              ) : (
                <div className="h-56 rounded-lg border border-border p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={clicksOverTime}
                      margin={{ top: 4, right: 4, bottom: 0, left: -8 }}
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
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor={chartColors.primary}
                            stopOpacity={0.01}
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
                        tick={{
                          fontSize: 11,
                          fill: chartColors.axisText,
                        }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={20}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fontSize: 11,
                          fill: chartColors.axisText,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ stroke: chartColors.cursor }}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={chartColors.primary}
                        strokeWidth={2}
                        fill="url(#clicksGradient)"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </BentoCard>

          {/* Location & Devices - Side by Side */}
          <BentoCard className="md:col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base font-bold">
                <div className="flex items-center gap-2">
                  <Globe weight="bold" className="size-4" />
                  Location
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.length > 0 ? (
                <LocationStats stats={stats} />
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">No location data</p>
                </div>
              )}
            </CardContent>
          </BentoCard>

          <BentoCard className="md:col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base font-bold">
                <div className="flex items-center gap-2">
                  <DeviceMobile weight="bold" className="size-4" />
                  Devices
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.length > 0 ? (
                <DeviceStats stats={stats} />
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">No device data</p>
                </div>
              )}
            </CardContent>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

export default LinkPage;
