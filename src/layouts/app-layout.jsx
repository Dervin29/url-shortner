import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import OfflineBanner from "@/components/OfflineBanner";
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

      <Toaster richColors closeButton position="bottom-right" theme={theme} />

      <OfflineBanner />

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

      <footer className="border-t bg-primary">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-background/70 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground">
            <span className="text-secondary">Trimrr</span> · Shorten. Share. Measure.
          </p>
          <p className="font-mono text-xs text-primary-foreground/60">
            Built by{" "}
            <span className="font-bold text-primary-foreground">Alan Derwin</span> · ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
