import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Spinner from "@/components/ui/spinner";
import Error from "./Error";
import PasswordInput from "./PasswordInput";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { login } from "@/db/apiAuth";
import { loginSchema } from "@/lib/validation";
import { UrlState } from "@/context/context";

const schema = loginSchema;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const { fetchUser } = UrlState();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const emailRef = useRef(null);

  const { data, error, loading, fn: fnLogin } = useFetch(login, formData);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (redirectToDashboard) {
      const params = longLink
        ? `?createNew=${encodeURIComponent(longLink)}`
        : "";
      navigate(`/dashboard${params}`);
    }
  }, [redirectToDashboard, navigate, longLink]);

  useEffect(() => {
    if (!loading && !error && data) {
      toast.success("Welcome back!");
      fetchUser();
      setRedirectToDashboard(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = async (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    try {
      await schema.validateAt(name, formData);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const validate = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      return null;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      return validationErrors;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setTouched({ email: true, password: true });

    const validationErrors = await validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    await fnLogin();
  };

  const showError = (field) => touched[field] && errors[field];
  const apiError = error?.message || errors.api;

  return (
    <Card className="w-full border-border/70">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to continue to your account.</CardDescription>
      </CardHeader>

      {apiError && (
        <div className="px-6 pb-2">
          <Error message={apiError} />
        </div>
      )}

      <form onSubmit={handleLogin} noValidate>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              autoComplete="email"
              aria-invalid={showError("email") || undefined}
              aria-describedby={
                showError("email") ? "login-email-error" : undefined
              }
            />
            <Error
              id="login-email-error"
              message={showError("email") ? errors.email : undefined}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              describedBy={
                showError("password") ? "login-password-error" : undefined
              }
              invalid={showError("password")}
            />
            <Error
              id="login-password-error"
              message={showError("password") ? errors.password : undefined}
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/auth?tab=signup${longLink ? `&createNew=${encodeURIComponent(longLink)}` : ""}`,
                )
              }
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create one
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
