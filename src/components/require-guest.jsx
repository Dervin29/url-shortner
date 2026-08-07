import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageLoader from "@/components/PageLoader";
import { UrlState } from "@/context/context";

function RequireGuest({ children }) {
  const navigate = useNavigate();

  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (isAuthenticated && loading === false) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <PageLoader label="Checking your session..." />;
  }

  if (!isAuthenticated) return children;

  return null;
}

export default RequireGuest;
