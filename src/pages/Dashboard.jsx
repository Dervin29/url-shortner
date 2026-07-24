import CreateLink from "@/components/CreateLink";
import Error from "@/components/Error";
import LinkCards from "@/components/LinkCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Link2, MousePointerClick } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const totalClicks = clicks?.reduce((acc, click) => acc + click.count, 0) || 0;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 py-6">
      {(loading || loadingClicks) && (
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

        {filterUrls?.map((url) => (
          <LinkCards key={url.id} url={url} fetchUrls={fnUrls} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;