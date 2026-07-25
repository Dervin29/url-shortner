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
import { Copy, Delete, Download, ExternalLink, Calendar, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import EditLink from "./EditLink";

const LinkCards = ({ url, fetchUrls, selected, onToggle }) => {
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
      toast.success("Copied to clipboard");
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied to clipboard");
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
    <div className={`
      group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 
      rounded-xl border p-4 sm:p-5 transition-all duration-200
      ${selected 
        ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/5' 
        : 'border-border bg-card/80 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5'
      }
    `}>
      {/* Selection Checkbox */}
      <div className="flex shrink-0 items-center justify-center w-full sm:w-auto sm:self-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={selected || false}
            onChange={() => onToggle(url?.id)}
            className="h-5 w-5 cursor-pointer rounded border-muted-foreground/30 text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
          />
          {selected && (
            <Check className="absolute inset-0 h-5 w-5 text-primary pointer-events-none p-0.5" />
          )}
        </div>
      </div>

      {/* QR Code */}
      <div className="flex shrink-0 justify-center w-full sm:w-auto">
        <img
          src={url?.qr}
          alt={`QR Code for ${url?.title || 'link'}`}
          className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border bg-white p-1.5 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md dark:bg-white"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <Link
        to={`/link/${url?.id}`}
        className="flex flex-1 flex-col space-y-1 overflow-hidden w-full sm:w-auto group/link"
      >
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg sm:text-xl font-semibold transition-colors group-hover/link:text-primary">
            {url?.title || 'Untitled Link'}
          </h2>
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {url?.original_url}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{createdDate}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="capitalize">
            {new Date(url?.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 self-end sm:self-center w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-border pt-3 sm:pt-0 mt-2 sm:mt-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => copyToClipboard(shortUrl)}
          title="Copy link"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
          onClick={downloadImage}
          title="Download QR code"
          disabled={!url?.qr}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>

        <EditLink
          url={url}
          fetchUrls={fetchUrls}
          iconOnly={false}
          buttonVariant="ghost"
          className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500"
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Delete link"
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={4} color="#ef4444" />
              ) : (
                <Delete className="h-3.5 w-3.5" />
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Delete className="h-5 w-5" />
                Delete Link
              </DialogTitle>
              <DialogDescription className="pt-2">
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