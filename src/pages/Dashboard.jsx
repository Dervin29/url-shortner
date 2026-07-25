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
import { ChevronLeft, ChevronRight, Link2, MousePointerClick, Trash2, Search, Filter } from "lucide-react";
import {
  Dialog,
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
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
      {(loading || loadingClicks || loadingBulkDelete) && (
        <BarLoader width="100%" color="#3b82f6" className="mb-2" />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-950/20 dark:to-gray-900/10 border-gray-200/50 dark:border-gray-800/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Links
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Link2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{urls?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {urls?.length === 0 ? "No links yet" : `${urls?.length} link${urls?.length > 1 ? 's' : ''} created`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <MousePointerClick className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalClicks}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalClicks === 0 ? "No clicks yet" : `${totalClicks} total click${totalClicks > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header with Create Link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your shortened URLs
          </p>
        </div>
        <CreateLink fetchUrls={fnUrls} />
      </div>

      {/* Search and Links List */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search links by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-muted bg-muted/30 focus:bg-background focus:border-primary transition-all duration-200 rounded-lg"
          />
          {searchQuery && filterUrls?.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              No links found matching "<span className="font-medium">{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 px-1 py-2 bg-muted/30 rounded-lg border border-muted">
            <input
              type="checkbox"
              checked={
                paginatedUrls?.length > 0 &&
                selectedIds.length === paginatedUrls.length
              }
              onChange={toggleSelectAll}
              className="h-4 w-4 cursor-pointer rounded border-muted-foreground/30 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex-1" />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="gap-2 h-8 px-3 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </Button>
          </div>
        )}

        {error && <Error message={error.message} />}

        {!loading && !error && filterUrls?.length === 0 && !searchQuery && (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-xl">
            <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No links created yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first link to get started!
            </p>
          </div>
        )}

        {/* Link Cards */}
        <div className="space-y-3">
          {paginatedUrls?.map((url) => (
            <LinkCards
              key={url.id}
              url={url}
              fetchUrls={fnUrls}
              selected={selectedIds.includes(url.id)}
              onToggle={toggleSelect}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
              Delete {selectedIds.length} Link{selectedIds.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete {selectedIds.length} selected link{selectedIds.length > 1 ? 's' : ''}?
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