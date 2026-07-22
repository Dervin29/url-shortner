import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/SignUp";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "login";
  return (
    <div className=" flex flex-col items-center justify-center gap-8 sm:gap-10 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center">
        {searchParams.get("createNew")
          ? "Hold up! Let's Login first"
          : "Login / Sign Up"}
      </h1>

      <Tabs
        value={tab}
        onValueChange={(v) => navigate(`/auth?tab=${v}`, { replace: true })}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <div className="mt-2">
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Auth;
