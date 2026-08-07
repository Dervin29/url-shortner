import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import PageLoader from "@/components/PageLoader";
import { UrlState } from "@/context/context";

function RedirectAuthenticated({ children }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (isAuthenticated && loading === false) {
      const params = longLink
        ? `?createNew=${encodeURIComponent(longLink)}`
        : "";
      navigate(`/dashboard${params}`, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, longLink]);

  if (loading) {
    return <PageLoader label="Checking your session..." />;
  }

  if (isAuthenticated) return null;

  return children;
}

export default RedirectAuthenticated;
