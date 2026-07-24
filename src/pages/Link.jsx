import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UrlState } from "@/context/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import DeviceStats from "@/components/DeviceStats";
import Location from "@/components/LocationStats";

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    loading,
    data: url,
    fn: fnGetUrl,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    if (user?.id) {
      fnGetUrl();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!error && !loading && url) {
      fnStats();
    }
  }, [loading, error, url]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load link");
      navigate("/dashboard");
    }
  }, [error, navigate]);

  const downloadImage = () => {
    if (!url?.qr) {
      toast.error("QR code not available");
      return;
    }

    try {
      const imageUrl = url.qr;
      const fileName = url.title || "qrcode";

      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.download = `${fileName}-qrcode.png`;
      anchor.target = "_blank";

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      toast.success("QR code downloaded!");
    } catch (error) {
      toast.error("Failed to download QR code");
      console.error("Download error:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard! 🎉");
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied to clipboard! 🎉");
    }
  };

  const handleDelete = async () => {
    try {
      await fnDelete();
      toast.success("Link deleted successfully");
      setIsDeleteDialogOpen(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  if (!url && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Link not found</p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const shortUrl = url ? `${import.meta.env.VITE_APP_URL}/${url?.custom_url || url?.short_url}` : "";
  const createdDate = url?.created_at ? new Date(url.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {(loading || loadingStats) && (
        <BarLoader className="mb-6" width="100%" color="#3b82f6" />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Section */}
        <div className="h-full lg:col-span-2 flex flex-col gap-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="w-fit -ml-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div>
            <h1 className="break-words text-2xl font-extrabold sm:text-3xl md:text-4xl">
              {url?.title || "Untitled Link"}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-lg font-semibold text-blue-500 hover:underline transition-colors sm:text-xl"
              >
                {shortUrl}
              </a>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard(shortUrl)}
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0"
                title="Open link"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>

            <a
              href={url?.original_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-start gap-2 break-all text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors sm:text-base"
            >
              <LinkIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{url?.original_url}</span>
            </a>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span>Created {createdDate}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(shortUrl)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>

            <Button
              variant="outline"
              onClick={downloadImage}
              disabled={!url?.qr}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR
            </Button>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={loadingDelete} className="gap-2">
                  {loadingDelete ? (
                    <BeatLoader size={6} color="white" />
                  ) : (
                    <>
                      <Trash className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-500">
                    <Trash className="h-5 w-5" />
                    Delete Link
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "<span className="font-medium text-foreground">{url?.title || 'this link'}</span>"?
                    <br />
                    <span className="text-xs text-muted-foreground mt-2 block">
                      This action cannot be undone. All analytics and data will be permanently removed.
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={loadingDelete}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loadingDelete}
                    className="min-w-[80px]"
                  >
                    {loadingDelete ? (
                      <BeatLoader size={6} color="white" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* QR Code */}
          {url?.qr && (
            <div className="flex justify-center lg:justify-start">
              <img
                src={url.qr}
                alt={`QR Code for ${url?.title || 'link'}`}
                className="w-48 rounded-lg border bg-white p-3 shadow-md transition-transform hover:scale-105 sm:w-56 md:w-64"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Stats Section */}
        <Card className="lg:col-span-3 h-fit shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold sm:text-3xl">
              Statistics
            </CardTitle>
          </CardHeader>

          {stats?.length > 0 ? (
            <CardContent className="space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.length}</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Analytics</h3>
                <Location stats={stats} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Device Analytics</h3>
                <DeviceStats stats={stats} />
              </div>
            </CardContent>
          ) : (
            <CardContent className="py-12 text-center text-muted-foreground">
              {loadingStats ? (
                <div className="flex flex-col items-center gap-2">
                  <BeatLoader size={8} color="#3b82f6" />
                  <p className="mt-2">Loading statistics...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <LinkIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p>No statistics yet</p>
                  <p className="text-sm">Share your link to start collecting data</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;