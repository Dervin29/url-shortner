import { useEffect, useState } from "react";
import Error from "./error";
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
import useFetch from "@/hooks/useFetch";

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (!loading && !error && data) {
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
  }, [loading, error, data, longLink, navigate]);

  const handleSignup = async () => {
    setErrors({});

    const schema = Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      profile_pic: Yup.mixed().required("Profile picture is required"),
    });

    try {
      await schema.validate(formData, { abortEarly: false });

      await fnSignup();
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
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>

          <CardDescription>
            Sign up to start shortening and managing your links.
          </CardDescription>

          {errors.api && <Error message={errors.api} />}
          {error && <Error message={error.message} />}
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>

            <Input
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
            />

            {errors.name && <Error message={errors.name} />}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />

            {errors.email && <Error message={errors.email} />}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            />

            {errors.password && <Error message={errors.password} />}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture</label>

            <Input
              type="file"
              accept="image/*"
              name="profile_pic"
              onChange={handleInputChange}
              className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
            />

            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full h-11 text-base"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
