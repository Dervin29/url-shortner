import { useRouteError, useNavigate } from "react-router-dom";
import { FallbackUI } from "@/components/ErrorBoundary";

const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleReset = () => {
    navigate("/");
  };

  return <FallbackUI error={error} onReset={handleReset} />;
};

export default RouteError;
