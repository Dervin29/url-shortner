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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Toaster
        closeButton
        position="bottom-right"
        theme={theme}
        toastOptions={{
          classNames: {
            toast:
              "group-[.toaster]:rounded-lg group-[.toaster]:border-foreground group-[.toaster]:shadow-card group-[.toaster]:font-sans",
            success: "group-[.toaster]:text-foreground",
            error: "group-[.toaster]:text-foreground",
          },
        }}
      />

      <Header />

      <main
        id="main-content"
        className="container mx-auto flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div key={pathname} className="page-enter">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="border-t bg-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-background/70 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-background">
            <span className="text-primary">Trimrr</span> · Shorten. Share. Measure.
          </p>
          <p className="font-mono text-xs text-background/60">
            Built by{" "}
            <span className="font-bold text-background">Alan Derwin</span> · ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
