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
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import DeviceStats from "@/components/DeviceStats";
import Location from "@/components/LocationStats";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {(loading || loadingStats) && (
        <BarLoader className="mb-6" width="100%" color="#36d7b7" />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Section */}
        <div className=" h-full lg:col-span-2 flex flex-col gap-6">
          <div>
            <h1 className="break-words text-3xl font-extrabold sm:text-4xl md:text-5xl">
              {url?.title}
            </h1>

            <a
              href={`${import.meta.env.VITE_APP_URL}/${link}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block break-all text-lg font-semibold text-blue-500 hover:underline sm:text-2xl"
            >
              {import.meta.env.VITE_APP_URL}/{link}
            </a>

            <a
              href={url?.original_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-start gap-2 break-all text-sm text-muted-foreground hover:underline sm:text-base"
            >
              <LinkIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{url?.original_url}</span>
            </a>

            <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
              Created {new Date(url?.created_at).toLocaleString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_URL}/${link}`,
                )
              }
            >
              <Copy className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="outline" onClick={downloadImage}>
              <Download className="h-5 w-5" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <BeatLoader size={6} color="white" />
                  ) : (
                    <Trash className="h-5 w-5" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Link</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this link? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button
                    variant="destructive"
                    onClick={() =>
                      fnDelete().then(() => navigate("/dashboard"))
                    }
                    disabled={loadingDelete}
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

          {/* QR */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={url?.qr}
              alt="QR Code"
              className="w-52 rounded-lg border bg-white p-3 shadow md:w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <Card className="lg:col-span-3 h-fit">
          <CardHeader>
            <CardTitle className="text-2xl font-bold sm:text-3xl">
              Statistics
            </CardTitle>
          </CardHeader>

          {stats?.length ? (
            <CardContent className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-4xl font-bold">{stats.length}</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Location Analytics</h3>
                <Location stats={stats} />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Device Analytics</h3>
                <DeviceStats stats={stats} />
              </div>
            </CardContent>
          ) : (
            <CardContent className="py-10 text-center text-muted-foreground">
              {loadingStats ? "Loading statistics..." : "No statistics yet"}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;
