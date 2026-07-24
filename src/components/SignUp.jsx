import { useEffect, useRef, useState } from "react";
import Error from "./Error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import { AlertCircle, Eye, EyeOff, User } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { UrlState } from "@/context/context";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  profile_pic: Yup.mixed().required("Profile picture is required"),
});

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const { fetchUser } = UrlState();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
  }, [redirectToDashboard, navigate, longLink]);

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    const handleSuccess = async () => {
      if (!loading && !error && data) {
        toast.success("Account created successfully!");
        await fetchUser();
        setRedirectToDashboard(true);
      }
    };

    handleSuccess();
  }, [loading, error, data]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));

    if (name === "profile_pic" && files?.[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
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
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
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

  return (
    <Card className="w-full shadow-xl border-0">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>

        <CardDescription>
          Sign up to start shortening and managing your links.
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

      <form onSubmit={handleSignup}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>

            <Input
              ref={nameRef}
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              aria-invalid={showError("name") || undefined}
            />

            {showError("name") && <Error message={errors.name} />}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              type="email"
              name="email"
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
            <label className="text-sm font-medium">Password</label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture</label>

            <div className="flex items-center gap-4">
              <div className="shrink-0 size-14 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-muted-foreground" />
                )}
              </div>

              <Input
                type="file"
                accept="image/*"
                name="profile_pic"
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className="flex-1 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                aria-invalid={showError("profile_pic") || undefined}
              />
            </div>

            {showError("profile_pic") && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full h-11 text-base"
            type="submit"
            disabled={loading}
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Create Account"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-primary font-medium hover:underline"
              onClick={() => navigate("/auth?tab=login")}
            >
              Sign in
            </span>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup;