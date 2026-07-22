import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mt-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Built by{" "}
          <span className="font-semibold text-foreground">
            Alan Derwin
          </span>{" "}
          <span className="text-primary">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;