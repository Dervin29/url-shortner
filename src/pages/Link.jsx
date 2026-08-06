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
  Copy,
  Check,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Share2,
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

// Bento Card Components
const BentoCard = ({ children, className, variant = "default" }) => (
  <Card
    className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      variant === "primary" && "border-primary/20 bg-primary/5",
      variant === "accent" && "border-accent/20 bg-accent/5",
      className
    )}
  >
    {children}
  </Card>
);

const BentoMetric = ({ icon: Icon, label, value, change, trend }) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend === "up" ? "text-emerald-600" : "text-red-600"
          )}
        >
          {change}
        </p>
      )}
    </div>
    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
      <Icon className="size-4.5" />
    </div>
  </div>
);

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { theme } = useTheme();
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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
        <div className="rounded-full bg-destructive/10 p-4">
          <LinkIcon className="size-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Link not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This link may have been removed or you don't have access to it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fnGetUrl()}>
            <RefreshCw className="mr-2 size-4" />
            Retry
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 size-4" />
            Dashboard
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
    grid: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(24, 24, 27, 0.06)",
    axisText: isDark ? "rgba(161, 161, 170, 0.8)" : "rgba(113, 113, 122, 0.8)",
    cursor: isDark ? "rgba(161, 161, 170, 0.3)" : "rgba(113, 113, 122, 0.3)",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="size-4" />
              Dashboard
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium truncate max-w-[200px]">
                {url?.title || "Untitled Link"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Active
              </span>
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
              <RefreshCw
                className={cn("size-3.5", loadingStats && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Row */}
          <BentoCard variant="primary" className="lg:col-span-1">
            <CardContent className="p-6">
              <BentoMetric
                icon={MousePointerClick}
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
              <CardTitle className="text-base font-semibold">Link Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Short Link
                </label>
                <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border bg-muted/30 p-2 pl-3">
                  <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">
                    {shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Destination
                </label>
                <a
                  href={url?.original_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 flex items-start gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
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
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={downloadImage}
                  disabled={!url?.qr}
                >
                  <Download className="size-3.5" />
                  QR
                </Button>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={loadingDelete}
                      className="gap-2"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
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
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
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
              <CardTitle className="text-base font-semibold">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {url?.qr ? (
                <div className="rounded-xl border bg-white p-4 dark:bg-gray-900">
                  <img
                    src={url.qr}
                    alt="QR Code"
                    className="size-40 rounded-lg"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="rounded-full bg-muted/30 p-3">
                    <Share2 className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No QR code available</p>
                </div>
              )}
            </CardContent>
          </BentoCard>

          {/* Chart - Full Width */}
          <BentoCard className="md:col-span-2 lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
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
                    <TrendingUp className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No clicks yet. Share your link to start tracking!
                  </p>
                </div>
              ) : (
                <div className="h-56 rounded-xl border p-3">
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
                            stopOpacity={0.3}
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
              <CardTitle className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Globe className="size-4" />
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
              <CardTitle className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Smartphone className="size-4" />
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