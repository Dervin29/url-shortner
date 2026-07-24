import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { BeatLoader } from "react-spinners";
import { QRCode } from "react-qrcode-logo";
import { UrlState } from "@/context/context";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { createUrl } from "@/db/apiUrls";
import Error from "./Error";
import { Plus, Link2, Sparkles } from "lucide-react";

export function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(!!longLink);
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Please enter a valid URL (include http:// or https://)")
      .required("Long URL is required"),
    customUrl: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\-_]+$/,
        "Only letters, numbers, hyphens, and underscores allowed",
      ),
  });

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user?.id });

  useEffect(() => {
    if (error === null && data) {
      toast.success("🎉 Link created successfully!");
      navigate(`/link/${data[0]?.id}`);
    }
  }, [error, data, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleDialogOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchParams({});
      setFormValues({
        title: "",
        longUrl: "",
        customUrl: "",
      });
      setErrors({});
    }
  };

  const createNewLink = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });

      let qrBlob = null;
      try {
        if (qrRef.current?.canvasRef?.current) {
          const canvas = qrRef.current.canvasRef.current;
          qrBlob = await new Promise((resolve) => canvas.toBlob(resolve));
        }
      } catch (qrError) {
        console.warn("QR code generation failed:", qrError);
      }

      await fnCreateUrl(qrBlob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);

      // Focus on first error field
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) element.focus();
      }
    }
  };

  const resetForm = () => {
    setFormValues({
      title: "",
      longUrl: "",
      customUrl: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          Create New Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Link
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* QR Code Preview */}
          {formValues.longUrl && (
            <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
              <QRCode
                ref={qrRef}
                size={180}
                value={formValues.longUrl}
                bgColor="#ffffff"
                fgColor="#1e293b"
                level="H"
                includeMargin={false}
              />
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="e.g., My Awesome Link"
              value={formValues.title}
              onChange={handleChange}
              className="focus:border-primary transition-colors"
              disabled={loading}
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          {/* Long URL Input */}
          <div className="space-y-1">
            <label htmlFor="longUrl" className="text-sm font-medium">
              Long URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="longUrl"
              placeholder="https://example.com/your-very-long-url"
              value={formValues.longUrl}
              onChange={handleChange}
              className="focus:border-primary transition-colors"
              disabled={loading}
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>

          {/* Custom URL Input */}
          <div className="space-y-1">
            <label htmlFor="customUrl" className="text-sm font-medium">
              Custom Slug{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <Card className="p-2 bg-muted/50 whitespace-nowrap text-sm font-mono">
                {import.meta.env.VITE_APP_URL}/
              </Card>
              <Input
                id="customUrl"
                placeholder="my-custom-link"
                value={formValues.customUrl}
                onChange={handleChange}
                className="flex-1 focus:border-primary transition-colors"
                disabled={loading}
              />
            </div>
            {errors.customUrl && <Error message={errors.customUrl} />}
            {!errors.customUrl && formValues.customUrl && (
              <p className="text-xs text-muted-foreground">
                Your link will be: {import.meta.env.VITE_APP_URL}/
                {formValues.customUrl}
              </p>
            )}
          </div>

          {error && (
            <Error message={error.message || "Failed to create link"} />
          )}
        </div>

        <DialogFooter className="sm:justify-start gap-2">
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 min-w-[100px]"
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Create Link"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
