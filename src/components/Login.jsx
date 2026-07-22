import { useEffect, useState } from "react";
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

import Error from "./Error";

import useFetch from "@/hooks/useFetch";
import { login } from "@/db/apiAuth";
import { UrlState } from "@/context/context";

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

  const {
    data,
    error,
    loading,
    fn: fnLogin,
  } = useFetch(login, formData);

  useEffect(() => {
    const handleSuccess = async () => {
      if (!loading && !error && data) {
        await fetchUser();

        navigate(
          `/dashboard${longLink ? `?createNew=${longLink}` : ""}`
        );
      }
    };

    handleSuccess();
  }, [loading, error, data, longLink, navigate, fetchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setErrors({});

    const schema = Yup.object({
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });

    try {
      await schema.validate(formData, {
        abortEarly: false,
      });

      await fnLogin();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        setErrors(validationErrors);
      } else {
        setErrors({
          api: err.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to continue to your account.
          </CardDescription>

          {errors.api && <Error message={errors.api} />}
          {error && <Error message={error.message} />}
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />

            {errors.email && <Error message={errors.email} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />

            {errors.password && <Error message={errors.password} />}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader size={8} color="white" />
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-primary font-medium hover:underline"
              onClick={() => navigate("/auth")}
            >
              Create one
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;