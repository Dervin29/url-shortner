import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Scissors } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { UrlState } from "@/context/context";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";
import { useState } from "react";
import Spinner from "./ui/spinner";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { loading, fn: fnLogout } = useFetch(logout);

  const initials =
    user?.user_metadata?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await fnLogout();
      await fetchUser();
      toast.success("Logged out successfully");
      setIsLogoutDialogOpen(false);
      navigate("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
            aria-label="Trimrr home"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
              <Scissors className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Trimrr</span>
          </Link>

          {user && (
            <nav aria-label="Main navigation">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                Dashboard
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="relative size-10 rounded-full p-0"
                      aria-label="Open account menu"
                    >
                      <Avatar className="size-10 border-2 border-primary/10">
                        <AvatarImage
                          src={user.user_metadata?.profile_pic}
                          alt={user.user_metadata?.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.user_metadata?.profile_pic}
                        alt={user.user_metadata?.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.user_metadata?.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={loading}
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 size-4" aria-hidden="true" />
                    {loading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <LogOut className="size-5" aria-hidden="true" />
                      Confirm Logout
                    </DialogTitle>
                    <DialogDescription className="pt-1">
                      Are you sure you want to log out? You'll need to sign in
                      again to access your links.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-2">
                    <DialogClose
                      render={
                        <Button variant="outline" disabled={loading}>
                          Cancel
                        </Button>
                      }
                    />
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={loading}
                      className="min-w-24"
                    >
                      {loading ? (
                        <>
                          <Spinner />
                          Logging out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth?tab=login")}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button onClick={() => navigate("/auth?tab=signup")}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
