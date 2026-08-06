import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { updateUrl } from "@/db/apiUrls";
import { urlFormSchema } from "@/lib/validation";
import Error from "./Error";
import useFetch from "@/hooks/useFetch";

const schema = urlFormSchema;

const EditLinkForm = ({ url, loading, error, onSave, onCancel }) => {
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  const [formValues, setFormValues] = useState({
    title: url?.title || "",
    longUrl: url?.original_url || "",
    customUrl: url?.custom_url || "",
  });

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const focusFirstError = (fieldErrors) => {
    const firstErrorField = Object.keys(fieldErrors)[0];
    if (firstErrorField) {
      const element = document.getElementById(`edit-${firstErrorField}`);
      element?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formValues, { abortEarly: false });
      onSave(formValues);
    } catch (err) {
      if (err?.name === "YupValidationError") {
        const newErrors = {};
        err.inner.forEach((fieldError) => {
          newErrors[fieldError.path] = fieldError.message;
        });
        setErrors(newErrors);
        focusFirstError(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="mb-4">
          <Error message={error.message || "Failed to update link"} />
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            ref={titleRef}
            id="edit-title"
            name="title"
            placeholder="e.g., My Awesome Link"
            value={formValues.title}
            onChange={handleChange}
            onClick={(e) => e.target.select()}
            disabled={loading}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "edit-title-error" : undefined}
          />
          <Error id="edit-title-error" message={errors.title} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-longUrl">
            Long URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-longUrl"
            name="longUrl"
            placeholder="https://example.com/your-very-long-url"
            value={formValues.longUrl}
            onChange={handleChange}
            onClick={(e) => e.target.select()}
            disabled={loading}
            aria-invalid={errors.longUrl ? true : undefined}
            aria-describedby={errors.longUrl ? "edit-longUrl-error" : undefined}
          />
          <Error id="edit-longUrl-error" message={errors.longUrl} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-customUrl">
            Custom Slug{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <div className="flex items-stretch gap-2">
            <div className="flex shrink-0 items-center rounded-lg border bg-muted px-3 font-mono text-sm text-muted-foreground">
              {import.meta.env.VITE_APP_URL}/
            </div>
            <Input
              id="edit-customUrl"
              name="customUrl"
              placeholder="my-custom-link"
              value={formValues.customUrl}
              onChange={handleChange}
              onClick={(e) => e.target.select()}
              disabled={loading}
              aria-invalid={errors.customUrl ? true : undefined}
              aria-describedby={
                errors.customUrl ? "edit-customUrl-error" : undefined
              }
            />
          </div>
          <Error id="edit-customUrl-error" message={errors.customUrl} />
          {!errors.customUrl && formValues.customUrl && (
            <p className="break-all text-xs text-muted-foreground">
              Your link will be: {import.meta.env.VITE_APP_URL}/
              {formValues.customUrl}
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="mt-5 gap-2 sm:gap-2">
        <Button type="submit" disabled={loading} className="min-w-28">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
};

const EditLink = ({
  url,
  fetchUrls,
  open,
  onOpenChange,
  iconOnly = true,
  buttonVariant = "ghost",
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const { loading, error, fn: fnUpdateUrl } = useFetch(updateUrl, url?.id);

  const handleOpenChange = (nextOpen) => {
    if (isControlled) {
      onOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const handleSave = async (formValues) => {
    const updates = {
      title: formValues.title,
      original_url: formValues.longUrl,
      custom_url: formValues.customUrl || null,
    };

    try {
      const result = await fnUpdateUrl(updates);
      if (result) {
        toast.success("Link updated");
        if (fetchUrls) fetchUrls();
        handleOpenChange(false);
      }
    } catch {
      toast.error("Failed to update link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button
              type="button"
              variant={buttonVariant}
              size={iconOnly ? "icon-sm" : "default"}
              className={className}
              aria-label="Edit link"
              title="Edit link"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
        />
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Pencil className="size-5 text-primary" aria-hidden="true" />
            Edit Link
          </DialogTitle>
          <DialogDescription>
            Update the details for this shortened link.
          </DialogDescription>
        </DialogHeader>

        <EditLinkForm
          key={`${url?.id}-${isOpen}`}
          url={url}
          loading={loading}
          error={error}
          onSave={handleSave}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditLink;
