import { Link } from "react-router-dom";
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
import { Copy, Delete, Download, ExternalLink, Calendar } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

const LinkCards = ({ url, fetchUrls }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

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
      await fetchUrls();
      toast.success("Link deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  const shortUrl = `${import.meta.env.VITE_APP_URL}/${url?.custom_url || url?.short_url}`;
  const createdDate = url?.created_at ? new Date(url.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5 transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
      {/* QR Code */}
      <div className="flex shrink-0 justify-center w-full sm:w-auto">
        <img
          src={url?.qr}
          alt={`QR Code for ${url?.title || 'link'}`}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg border bg-white p-2 shadow-md transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <Link
        to={`/link/${url?.id}`}
        className="flex flex-1 flex-col space-y-1.5 sm:space-y-2 overflow-hidden w-full sm:w-auto group/link"
      >
        <div className="flex items-center gap-2">
          <h2 className="truncate text-xl sm:text-2xl font-bold transition-colors group-hover/link:text-blue-400">
            {url?.title || 'Untitled Link'}
          </h2>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-center gap-2">
          <p className="truncate text-base sm:text-lg font-medium text-blue-500 hover:text-blue-400 transition-colors">
            {shortUrl}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(shortUrl);
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <p className="truncate text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          {url?.original_url}
        </p>

        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <Calendar className="h-3 w-3" />
          <span>Created {createdDate}</span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0 mt-2 sm:mt-0">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
          onClick={() => copyToClipboard(shortUrl)}
          title="Copy link"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-green-500/10 hover:text-green-500 transition-colors"
          onClick={downloadImage}
          title="Download QR code"
          disabled={!url?.qr}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="Delete link"
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={6} color="#ef4444" />
              ) : (
                <Delete className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <Delete className="h-5 w-5" />
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
    </div>
  );
};

export default LinkCards;