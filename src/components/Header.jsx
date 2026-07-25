import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BarLoader, BeatLoader } from "react-spinners";
import { Link2, LogOut, LayoutDashboard, Scissors } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import { UrlState } from "@/context/context";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { loading, fn: fnLogout } = useFetch(logout);

  const initials = user?.user_metadata?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const handleLogout = async () => {
    await fnLogout();
    await fetchUser();
    toast.success("Logged out successfully");
    setIsLogoutDialogOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Trimrr</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        {user ? (<>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage 
                    src={user.user_metadata?.profile_pic} 
                    alt={user.user_metadata?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold">{user.user_metadata?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={loading}
                onClick={() => setIsLogoutDialogOpen(true)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {loading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-5 w-5" />
                  Confirm Logout
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    You will need to sign in again to access your links.
                  </span>
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={loading}
                  className="min-w-[80px]"
                >
                  {loading ? (
                    <BeatLoader size={6} color="white" />
                  ) : (
                    "Logout"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex"
            >
              Login
            </Button>

            <Button 
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        )}
        </div>
      </div>

      {loading && <BarLoader width="100%" color="#3b82f6" />}
    </header>
  );
};

export default Header;