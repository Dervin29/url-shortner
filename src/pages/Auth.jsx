import { useNavigate, useSearchParams } from "react-router-dom";
import { Scissors, LinkSimple } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/SignUp";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "signup" ? "signup" : "login";
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
          <div className="mb-2.5 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Scissors weight="bold" className="size-5" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
            {tab === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {tab === "signup"
              ? "Shorten, track, and customize your links."
              : "Sign in to manage your links and analytics."}
          </p>
        </div>

        {longLink && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <LinkSimple
              weight="bold"
              className="mt-0.5 size-4 shrink-0 text-foreground"
              aria-hidden="true"
            />
            <p className="text-muted-foreground">
              You're one step away from saving your link.{" "}
              {tab === "signup" ? "Create an account" : "Sign in"}{" "}
              to continue right where you left off.
            </p>
          </div>
        )}

        <Tabs value={tab} onValueChange={switchTab} className="w-full">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="mt-5">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
