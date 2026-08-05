import { useNavigate, useSearchParams } from "react-router-dom";
import { Scissors, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/SignUp";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "login";
  const longLink = searchParams.get("createNew");

  const switchTab = (value) => {
    const params = new URLSearchParams({ tab: value });
    if (longLink) params.set("createNew", longLink);
    navigate(`/auth?${params.toString()}`, { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-md">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-2.5 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Scissors className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {tab === "signup" ? "Create your account" : "Welcome back to Trimrr"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "signup"
              ? "Shorten, track, and customize your links for free."
              : "Sign in to manage your links and analytics."}
          </p>
        </div>

        {longLink && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
            <Link2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p>
              You're one step away from saving your link.{" "}
              {tab === "signup" ? "Create an account" : "Sign in"}{" "}
              to continue right where you left off.
            </p>
          </div>
        )}

        <Tabs value={tab} onValueChange={switchTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-3">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="mt-3">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
