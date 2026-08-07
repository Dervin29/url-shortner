import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UrlProvider from "./context/context";
import ThemeProvider from "./context/theme";

import AppLayout from "./layouts/app-layout";
import RequireAuth from "./components/require-auth";
import RequireGuest from "./components/require-guest";
import PageLoader from "./components/PageLoader";

import RedirectLink from "./pages/RedirectLink";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LinkPage = lazy(() => import("./pages/Link"));

const AuthGuard = ({ children }) => (
  <RequireAuth>
    <Suspense fallback={<PageLoader label="Loading..." />}>{children}</Suspense>
  </RequireAuth>
);

const GuestGuard = ({ children }) => (
  <RequireGuest>
    <Suspense fallback={<PageLoader label="Loading..." />}>{children}</Suspense>
  </RequireGuest>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: (
          <GuestGuard>
            <Auth />
          </GuestGuard>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: "/link/:slug",
        element: (
          <AuthGuard>
            <LinkPage />
          </AuthGuard>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <UrlProvider>
        <RouterProvider router={router} />
      </UrlProvider>
    </ThemeProvider>
  );
}

export default App;
