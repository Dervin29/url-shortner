import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { useTheme } from "@/context/theme";

const AppLayout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Toaster
        richColors
        closeButton
        position="top-right"
        theme={theme}
        toastOptions={{
          classNames: {
            toast:
              "group-[.toaster]:rounded-lg group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          },
        }}
      />

      <Header />

      <main
        id="main-content"
        className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8"
      >
        <div key={pathname} className="page-enter mt-2">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="border-t bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Built by{" "}
            <span className="font-semibold text-foreground">Alan Derwin</span>{" "}
            <span className="text-primary">© {new Date().getFullYear()}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
