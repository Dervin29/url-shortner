import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { updateUrl } from "@/db/apiUrls";
import Error from "./Error";
import { Pencil } from "lucide-react";

const EditLink = ({ url, fetchUrls, open, onOpenChange }) => {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: url?.title || "",
    longUrl: url?.original_url || "",
    customUrl: url?.custom_url || "",
  });

  useEffect(() => {
    setFormValues({
      title: url?.title || "",
      longUrl: url?.original_url || "",
      customUrl: url?.custom_url || "",
    });
    setErrors({});
  }, [url, open]);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Please enter a valid URL (include http:// or https://)")
      .required("Long URL is required"),
    customUrl: yup
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .matches(
        /^[a-zA-Z0-9\-_]+$/,
        "Only letters, numbers, hyphens, and underscores allowed",
      ),
  });

  const {
    loading,
    error,
    fn: fnUpdateUrl,
  } = useFetch(updateUrl, url?.id);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });

      const updates = {
        title: formValues.title,
        original_url: formValues.longUrl,
        custom_url: formValues.customUrl || null,
      };

      await fnUpdateUrl(updates);
      toast.success("Link updated successfully");
      fetchUrls();
      onOpenChange(false);
    } catch (e) {
      if (e?.name === "YupValidationError") {
        const newErrors = {};
        e?.inner?.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);

        const firstErrorField = Object.keys(newErrors)[0];
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          if (element) element.focus();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Link
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
          </div>

          {error && (
            <Error message={error.message || "Failed to update link"} />
          )}
        </div>

        <DialogFooter className="sm:justify-start gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 min-w-[100px]"
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLink;
