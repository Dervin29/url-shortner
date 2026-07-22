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
  } = useFetch(getClicksForUrls);

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks(urls.map((url) => url.id));
    }
  }, [urls]);

  const filterUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className=" flex flex-col gap-8">
      {(loading || loadingClicks) && <BarLoader width={"100%"} />}
      <div className=" grid grid-cols-2 gap-4 ">
        {" "}
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className=" flex justify-between">
        <h1 className=" text-4xl font-extrabold">Links</h1>
        <CreateLink />
      </div>

      <div className=" relative">
        <Input
          type={"text"}
          placeholder="Filter Link..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className=" w-full border-2 border-input px-4 py-2 rounded-lg"
        />
        {error && <Error message={error.message} />}

        {(filterUrls || []).map((url, i) => {
          return (
            <div key={i} className=" my-4">
              <LinkCards  url={url} fetchUrls={fnUrls} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
