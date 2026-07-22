import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Link2, LogOut, LayoutDashboard, Scissors } from "lucide-react";

import { UrlState } from "@/context/context";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user } = UrlState();

  const { loading, fn: fnLogout } = useFetch(logout);
  const { fetchUser } = UrlState();

  const initials =
    user?.user_metadata?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Scissors className="h-6 w-6 text-blue-500" />
            <span>Trimrr</span>
          </Link>

          {/* Right */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-11 w-11">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={user.user_metadata.profile_pic} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-semibold">{user.user_metadata.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer"
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  My Links
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  disabled={loading}
                  onClick={() => {
                    fnLogout().then(async () => {
                      await fetchUser();
                      navigate("/");
                    });
                  }}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>

              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            </div>
          )}
        </div>

        {loading && <BarLoader width="100%" />}
      </header>
    </>
  );
};

export default Header;
