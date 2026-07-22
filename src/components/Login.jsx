import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { BeatLoader } from "react-spinners";

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

import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Error from "./Error";

import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { login } from "@/db/apiAuth";
import { UrlState } from "@/context/context";

const schema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const { fetchUser } = UrlState();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const emailRef = useRef(null);

  const { data, error, loading, fn: fnLogin } = useFetch(login, formData);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (redirectToDashboard) {
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
  }, [redirectToDashboard, navigate, longLink]);

  useEffect(() => {
    const handleSuccess = async () => {
      if (!loading && !error && data) {
        toast.success("Welcome back!");
        await fetchUser();
        setRedirectToDashboard(true);
      }
    };

    handleSuccess();
  }, [loading, error, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>

          <CardDescription>
            Sign in to continue to your account.
          </CardDescription>

          {errors.api && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.api}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error.message}</span>
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleLogin}>
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
                aria-invalid={showError("email") || undefined}
              />

              {showError("email") && <Error message={errors.email} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  aria-invalid={showError("password") || undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {showError("password") && <Error message={errors.password} />}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <BeatLoader size={8} color="white" /> : "Login"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <span
                className="cursor-pointer text-primary font-medium hover:underline"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Create one
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
