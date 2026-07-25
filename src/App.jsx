import "./App.css";
import { lazy, Suspense } from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import UrlProvider from "./context/context";
import ThemeProvider from "./context/theme";

import AppLayout from "./layouts/app-layout";
import RequireAuth from "./components/require-auth";

import RedirectLink from "./pages/RedirectLink";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import { BarLoader } from "react-spinners";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LinkPage = lazy(() => import("./pages/Link"));

const AuthGuard = ({ children }) => (
  <RequireAuth>
    <Suspense fallback={<BarLoader width="100%" color="#3b82f6" className="mt-4" />}>
      {children}
    </Suspense>
  </RequireAuth>
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
        element: <Auth />,
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
        path: "/link/:id",
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