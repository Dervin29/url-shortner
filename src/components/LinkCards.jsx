import { Link } from "react-router-dom";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { useState } from "react";
import { Calendar, MousePointerClick, Trash2, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import CopyButton from "./CopyButton";
import EditLink from "./EditLink";

const LinkCards = ({ url, fetchUrls, selected, onToggle, clickCount = 0 }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

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
      await fetchUrls();
      toast.success("Link deleted");
      setIsDeleteDialogOpen(false);
    } else {
      toast.error("Failed to delete link");
    }
  };

  const shortUrl = `${import.meta.env.VITE_APP_URL}/${
    url?.custom_url || url?.short_url
  }`;
  const createdDate = url?.created_at
    ? new Date(url.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <article
      className={cn(
        "group flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 sm:gap-5 sm:p-5",
        selected
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30 hover:shadow-md",
      )}
    >
      {/* Selection checkbox */}
      <div className="shrink-0">
        <input
          type="checkbox"
          checked={selected || false}
          onChange={() => onToggle?.(url?.id)}
          aria-label={`Select ${url?.title || "link"}`}
          className="size-4.5 cursor-pointer rounded border-muted-foreground/30 text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* QR code */}
      <Link
        to={`/link/${url?.custom_url || url?.short_url}`}
        className="shrink-0"
        aria-label={`View stats for ${url?.title || "link"}`}
      >
        <img
          src={url?.qr}
          alt={`QR code for ${url?.title || "link"}`}
          className="size-20 rounded-lg border bg-white p-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105 sm:size-24"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="min-w-0 flex-1 basis-56">
        <Link
          to={`/link/${url?.custom_url || url?.short_url}`}
          className="group/link block"
          aria-label={`View stats for ${url?.title || "link"}`}
        >
          <h2 className="truncate text-base font-semibold transition-colors group-hover/link:text-primary sm:text-lg">
            {url?.title || "Untitled Link"}
          </h2>
        </Link>

        <div className="mt-1 flex min-w-0 items-center gap-1.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 truncate font-mono text-sm text-primary hover:underline"
            title={shortUrl}
          >
            {shortUrl}
          </a>
          <CopyButton
            text={shortUrl}
            size="icon-xs"
            className="shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          />
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Open shortened link in new tab"
            title="Open link"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {url?.original_url}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={url?.created_at}>{createdDate}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="size-3.5" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">
                {clickCount.toLocaleString()}
              </span>{" "}
              click{clickCount === 1 ? "" : "s"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Active
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:self-center">
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
          onClick={downloadImage}
          title="Download QR code"
          aria-label="Download QR code"
          disabled={!url?.qr}
        >
          <Download className="size-4" aria-hidden="true" />
        </Button>

        <EditLink
          url={url}
          fetchUrls={fetchUrls}
          iconOnly
          buttonVariant="ghost"
          className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete link"
                aria-label="Delete link"
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-destructive/40 border-t-destructive" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
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
    </article>
  );
};

export default LinkCards;
