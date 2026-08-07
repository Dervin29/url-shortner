import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowsDownUp,
  CaretLeft,
  CaretRight,
  Tray,
  LinkSimple,
  CursorClick,
  MagnifyingGlass,
  Trash,
  X,
} from "@phosphor-icons/react";
import CreateLink from "@/components/CreateLink";
import Error from "@/components/Error";
import EmptyState from "@/components/EmptyState";
import LinkCards from "@/components/LinkCards";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UrlState } from "@/context/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls, deleteUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";

const ITEMS_PER_PAGE = 5;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "mostClicks", label: "Most clicks" },
  { value: "title", label: "Title (A-Z)" },
];

const APP_URL = import.meta.env.VITE_APP_URL;

const StatCard = ({ icon: Icon, label, value, loading, hint }) => (
  <Card className="transition-all hover:shadow-card-hover">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </CardTitle>
      <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted/40">
        <Icon weight="bold" className="size-4" aria-hidden="true" />
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="font-mono text-3xl font-semibold tracking-tight">
          {value}
        </p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </CardContent>
  </Card>
);

const LinkCardSkeleton = () => (
  <div className="flex items-center gap-4 rounded-lg border border-border p-4 sm:p-5">
    <Skeleton className="size-5 shrink-0 rounded" />
    <Skeleton className="hidden size-20 shrink-0 rounded-lg sm:block sm:size-24" />
    <div className="flex-1 space-y-2.5">
      <Skeleton className="h-5 w-2/3 max-w-xs" />
      <Skeleton className="h-4 w-1/2 max-w-[200px]" />
      <Skeleton className="h-3 w-1/3 max-w-[140px]" />
    </div>
    <Skeleton className="size-9 shrink-0 rounded-lg" />
  </div>
);

const Dashboard = () => {
  const { user } = UrlState();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const clicksByUrl = useMemo(() => {
    const map = {};
    clicks?.forEach((click) => {
      map[click.url_id] = (map[click.url_id] || 0) + 1;
    });
    return map;
  }, [clicks]);

  useEffect(() => {
    if (user?.id) {
      fnUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (urls?.length) {
      fnClicks(urls.map((url) => url.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls]);

  const visibleUrls = useMemo(() => {
    if (!urls) return [];
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? urls.filter((url) => {
          const slug = url?.custom_url || url?.short_url;
          const searchable = [
            url?.title,
            url?.original_url,
            url?.custom_url,
            url?.short_url,
            `${APP_URL}/${slug}`,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return searchable.includes(query);
        })
      : urls;

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "mostClicks":
          return (clicksByUrl[b.id] || 0) - (clicksByUrl[a.id] || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  }, [urls, searchQuery, sortBy, clicksByUrl]);

  const totalClicks = clicks?.length || 0;
  const totalPages = Math.max(1, Math.ceil(visibleUrls.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUrls = visibleUrls.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const allVisibleSelected =
    paginatedUrls.length > 0 &&
    paginatedUrls.every((url) => selectedIds.includes(url.id));

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedUrls.some((url) => url.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...paginatedUrls.map((url) => url.id)]),
      ]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleBulkDelete = async () => {
    const result = await fnBulkDelete(selectedIds);
    if (result) {
      toast.success(
        `${selectedIds.length} link${selectedIds.length > 1 ? "s" : ""} deleted`,
      );
      setSelectedIds([]);
      setIsBulkDeleteDialogOpen(false);
      await fnUrls();
    } else {
      toast.error("Failed to delete selected links");
    }
  };

  const isLoading = loading || loadingClicks;

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            Your Links
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Manage and track all your shortened URLs
          </p>
        </div>
        <CreateLink fetchUrls={fnUrls} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <LinkCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-danger-surface px-6 py-12 text-center">
          <Error message={error.message || "Failed to load your links"} />
          <Button variant="outline" onClick={() => fnUrls()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              icon={LinkSimple}
              label="Total Links"
              value={(urls?.length || 0).toLocaleString()}
              loading={loading}
              hint={
                urls?.length === 0
                  ? "No links yet"
                  : `${urls?.length} link${urls?.length > 1 ? "s" : ""} created`
              }
            />
            <StatCard
              icon={CursorClick}
              label="Total Clicks"
              value={totalClicks.toLocaleString()}
              loading={loadingClicks}
              hint={
                totalClicks === 0
                  ? "No clicks yet"
                  : `${totalClicks.toLocaleString()} total click${
                      totalClicks > 1 ? "s" : ""
                    }`
              }
            />
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlass
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search by title, URL, or slug..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 pl-9 pr-9"
                aria-label="Search links"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X weight="bold" className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="justify-between sm:w-44">
                    <span className="flex items-center gap-2">
                      <ArrowsDownUp weight="bold" className="size-4" aria-hidden="true" />
                      {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                  className="size-4 cursor-pointer rounded border-muted-foreground/40 accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <span className="text-sm font-medium">
                  {selectedIds.length} selected
                </span>
              </label>
              <div className="flex-1" />
              {allVisibleSelected ? (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Clear selection
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Select this page
                </button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash weight="bold" className="size-4" aria-hidden="true" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Empty state: no links at all */}
          {!loading && urls?.length === 0 && !searchQuery && (
            <EmptyState
              icon={Tray}
              title="No links yet"
              description="Turn your first long URL into a short, shareable link with analytics."
              className="py-16"
            >
              <ol className="mt-5 space-y-3 text-left text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground">
                    1
                  </span>
                  <span>
                    Paste a long URL and give it a{" "}
                    <span className="font-medium text-foreground">title</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground">
                    2
                  </span>
                  <span>
                    Optionally set a{" "}
                    <span className="font-medium text-foreground">
                      custom slug
                    </span>{" "}
                    like{" "}
                    <span className="font-mono text-xs">
                      {APP_URL}/my-link
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground">
                    3
                  </span>
                  <span>
                    Share it and{" "}
                    <span className="font-medium text-foreground">
                      track clicks
                    </span>{" "}
                    by device and location
                  </span>
                </li>
              </ol>
              <div className="mt-6">
                <CreateLink fetchUrls={fnUrls} />
              </div>
            </EmptyState>
          )}

          {/* Empty state: no search results */}
          {!loading &&
            urls?.length > 0 &&
            visibleUrls.length === 0 &&
            searchQuery && (
              <EmptyState
                icon={MagnifyingGlass}
                title="No matching links"
                description={`Nothing found for "${searchQuery}". Try a different search term.`}
                action={
                  <Button variant="outline" onClick={() => handleSearchChange("")}>
                    Clear search
                  </Button>
                }
              />
            )}

          {/* Link list */}
          {visibleUrls.length > 0 && (
            <div className="flex flex-col gap-3">
              {paginatedUrls.map((url, index) => (
                <div
                  key={url.id}
                  className="stagger-item"
                  style={{ "--i": index }}
                >
                  <LinkCards
                    url={url}
                    clickCount={clicksByUrl[url.id] || 0}
                    fetchUrls={fnUrls}
                    selected={selectedIds.includes(url.id)}
                    onToggle={toggleSelect}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {visibleUrls.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-mono font-medium text-foreground">
                  {(safePage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(safePage * ITEMS_PER_PAGE, visibleUrls.length)}
                </span>{" "}
                of{" "}
                <span className="font-mono font-medium text-foreground">
                  {visibleUrls.length}
                </span>{" "}
                link{visibleUrls.length > 1 ? "s" : ""}
              </p>
              <nav
                className="flex items-center gap-1"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="size-9"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <CaretLeft weight="bold" className="size-4" aria-hidden="true" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === safePage ? "default" : "outline"}
                      size="icon-sm"
                      className="size-9 font-mono"
                      aria-current={page === safePage ? "page" : undefined}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="size-9"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  aria-label="Next page"
                >
                  <CaretRight weight="bold" className="size-4" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash weight="bold" className="size-5" aria-hidden="true" />
              Delete {selectedIds.length} Link{selectedIds.length > 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription className="pt-1">
              Are you sure you want to delete {selectedIds.length} selected
              link{selectedIds.length > 1 ? "s" : ""}? This action cannot be
              undone and all analytics data will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose
              render={
                <Button variant="outline" disabled={loadingBulkDelete}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={loadingBulkDelete}
              className="min-w-24"
            >
              {loadingBulkDelete ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
