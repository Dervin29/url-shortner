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
import { Copy, Delete, Download } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCards = ({ url, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);
  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5 transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
      {/* QR */}
      <div className="flex shrink-0 justify-center w-full sm:w-auto">
        <img
          src={url?.qr}
          alt="QR Code"
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg border bg-white p-2 shadow"
        />
      </div>

      {/* Content */}
      <Link
        to={`/link/${url?.id}`}
        className="flex flex-1 flex-col space-y-1.5 sm:space-y-2 overflow-hidden w-full sm:w-auto"
      >
        <h2 className="truncate text-xl sm:text-2xl font-bold transition-colors group-hover:text-blue-400">
          {url?.title}
        </h2>

        <p className="truncate text-base sm:text-lg font-medium text-blue-500">
          {import.meta.env.VITE_APP_URL}/{url?.custom_url || url?.short_url}
        </p>

        <p className="truncate text-sm text-zinc-400">{url?.original_url}</p>

        <p className="text-xs text-zinc-500">
          Created {new Date(url?.created_at).toLocaleDateString()}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0 mt-2 sm:mt-0">
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(
              `${import.meta.env.VITE_APP_URL}/${url?.short_url}`,
            );
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline" onClick={downloadImage}>
          <Download className="h-4 w-4" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <Delete className={loadingDelete ? "animate-spin" : ""} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Link</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this link? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                variant="destructive"
                onClick={() => {
                  toast.success("Link deleted");
                  fnDelete().then(fetchUrls);
                }}
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
    </div>
  );
};

export default LinkCards;
