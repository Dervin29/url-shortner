import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Delete, Download } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";

const LinkCards = ({ url, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = fileName;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);
  return (
    <div className="group flex flex-col md:flex-row items-center gap-6 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
      {/* QR */}
      <div className="flex shrink-0 justify-center">
        <img
          src={url?.qr}
          alt="QR Code"
          className="h-28 w-28 rounded-lg border bg-white p-2 shadow"
        />
      </div>

      {/* Content */}
      <Link
        to={`/link/${url?.id}`}
        className="flex flex-1 flex-col space-y-2 overflow-hidden"
      >
        <h2 className="truncate text-2xl font-bold transition-colors group-hover:text-blue-400">
          {url?.title}
        </h2>

        <p className="truncate text-lg font-medium text-blue-500">
          {import.meta.env.VITE_APP_URL}/{url?.custom_url || url?.short_url}
        </p>

        <p className="truncate text-sm text-zinc-400">{url?.original_url}</p>

        <p className="text-xs text-zinc-500">
          Created {new Date(url?.created_at).toLocaleDateString()}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            navigator.clipboard.writeText(
              `${import.meta.env.VITE_APP_URL}/${url?.short_url}`,
            )
          }
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline" onClick={downloadImage}>
          <Download className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={() => fnDelete().then(fetchUrls)}
        >
          <Delete className={loadingDelete ? "animate-spin" : ""} />
        </Button>
      </div>
    </div>
  );
};

export default LinkCards;
