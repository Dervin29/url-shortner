import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/SignUp";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "login";

  return (
    <div className="flex flex-col items-center justify-center  py-10 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          {searchParams.get("createNew")
            ? "Hold up! Let's Login first"
            : "Login / Sign Up"}
        </h1>

        <Tabs
          value={tab}
          onValueChange={(v) => navigate(`/auth?tab=${v}`, { replace: true })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
