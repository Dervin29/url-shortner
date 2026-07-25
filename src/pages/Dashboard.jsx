import CreateLink from "@/components/CreateLink";
import Error from "@/components/Error";
import LinkCards from "@/components/LinkCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls, deleteUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BarLoader, BeatLoader } from "react-spinners";
import { ChevronLeft, ChevronRight, Link2, MousePointerClick, Trash2 } from "lucide-react";
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

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { user } = UrlState();
  
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch((_, urlIds) => getClicksForUrls(urlIds));

  const {
    loading: loadingBulkDelete,
    fn: fnBulkDelete,
  } = useFetch((_, ids) => deleteUrls(ids));

  useEffect(() => {
    if (user?.id) {
      fnUrls();
    }
  }, [user?.id]);

  useEffect(() => {
    if (urls?.length) {
      const urlIds = urls.map((url) => url.id);
      fnClicks(urlIds);
    }
  }, [urls]);

  const filterUrls = urls?.filter((url) =>
    url?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClicks = clicks?.length || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((filterUrls?.length || 0) / ITEMS_PER_PAGE);
  const paginatedUrls = filterUrls?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!paginatedUrls) return;
    if (selectedIds.length === paginatedUrls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUrls.map((u) => u.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await fnBulkDelete(selectedIds);
      toast.success(`${selectedIds.length} link(s) deleted successfully`);
      setSelectedIds([]);
      setIsBulkDeleteDialogOpen(false);
      fnUrls();
    } catch (error) {
      toast.error("Failed to delete selected links");
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 py-6">
      {(loading || loadingClicks || loadingBulkDelete) && (
        <BarLoader width="100%" color="#3b82f6" className="mb-4" />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Links Created
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{urls?.length || 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Header with Create Link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Links</h1>
        <CreateLink />
      </div>

      {/* Search and Links List */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-input px-4 py-2 rounded-lg focus:border-primary transition-colors"
          />
          {searchQuery && filterUrls?.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              No links found matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              checked={
                paginatedUrls?.length > 0 &&
                selectedIds.length === paginatedUrls.length
              }
              onChange={toggleSelectAll}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="ml-auto gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        {error && <Error message={error.message} />}

        {!loading && !error && filterUrls?.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No links created yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first link to get started!
            </p>
          </div>
        )}

        {paginatedUrls?.map((url) => (
          <LinkCards
            key={url.id}
            url={url}
            fetchUrls={fnUrls}
            selected={selectedIds.includes(url.id)}
            onToggle={toggleSelect}
          />
        ))}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete {selectedIds.length} Link(s)
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} selected link(s)?
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                This action cannot be undone. All analytics and data will be permanently removed.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={loadingBulkDelete}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={loadingBulkDelete}
              className="min-w-[80px]"
            >
              {loadingBulkDelete ? (
                <BeatLoader size={6} color="white" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;