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
import { Camera, User, X } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { signup } from "@/db/apiAuth";
import { signupSchema } from "@/lib/validation";
import { UrlState } from "@/context/context";

const schema = signupSchema;

const Signup = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { fetchUser } = UrlState();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (redirectToDashboard) {
      const params = longLink
        ? `?createNew=${encodeURIComponent(longLink)}`
        : "";
      navigate(`/dashboard${params}`);
    }
  }, [redirectToDashboard, navigate, longLink]);

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (!loading && !error && data) {
      toast.success("Account created successfully!");
      fetchUser();
      setRedirectToDashboard(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));

    if (name === "profile_pic") {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(files?.[0] ? URL.createObjectURL(files[0]) : null);
      if (files?.[0]) {
        setTouched((prev) => ({ ...prev, profile_pic: true }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next.profile_pic;
          return next;
        });
      }
    } else if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const removePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, profile_pic: null }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.profile_pic;
      return next;
    });
  };

  const handleBlur = async (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "profile_pic") return;

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setTouched({ name: true, email: true, password: true, profile_pic: true });

    const validationErrors = await validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    await fnSignup();
  };

  const showError = (field) => touched[field] && errors[field];
  const apiError = error?.message || errors.api;

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription>
          Start shortening and tracking links in seconds.
        </CardDescription>
      </CardHeader>

      {apiError && (
        <div className="px-6 pb-2">
          <Error message={apiError} />
        </div>
      )}

      <form onSubmit={handleSignup} noValidate>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              autoComplete="name"
              aria-invalid={showError("name") || undefined}
              aria-describedby={
                showError("name") ? "signup-name-error" : undefined
              }
            />
            <Error
              id="signup-name-error"
              message={showError("name") ? errors.name : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
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
                showError("email") ? "signup-email-error" : undefined
              }
            />
            <Error
              id="signup-email-error"
              message={showError("email") ? errors.email : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              placeholder="At least 6 characters"
              describedBy="signup-password-hint"
              invalid={showError("password")}
            />
            <p
              id="signup-password-hint"
              className="text-xs text-muted-foreground"
            >
              Use at least 6 characters. Strong passwords include a mix of
              letters and numbers.
            </p>
            <Error
              id="signup-password-error"
              message={showError("password") ? errors.password : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_pic">
              Profile Picture <span className="text-destructive">*</span>
            </Label>
            <div
              className={`flex items-center gap-4 rounded-lg border-2 border-dashed p-3 transition-colors ${
                showError("profile_pic")
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <User
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Choose a photo</p>
                <p className="text-xs text-muted-foreground">
                  A photo makes your account easy to recognize.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="profile_pic"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                  >
                    <Camera className="size-3.5" aria-hidden="true" />
                    {previewUrl ? "Change photo" : "Upload"}
                  </label>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-destructive hover:underline"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Input
              id="profile_pic"
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className="sr-only"
              aria-invalid={showError("profile_pic") || undefined}
              aria-describedby={
                showError("profile_pic") ? "signup-profile-error" : undefined
              }
            />
            <Error
              id="signup-profile-error"
              message={
                showError("profile_pic") ? errors.profile_pic : undefined
              }
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/auth?tab=login${longLink ? `&createNew=${encodeURIComponent(longLink)}` : ""}`,
                )
              }
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup;
