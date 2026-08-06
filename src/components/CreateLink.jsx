import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, QrCode, Sparkles } from "lucide-react";
import { QRCode } from "react-qrcode-logo";
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
import { createUrl } from "@/db/apiUrls";
import { urlFormSchema } from "@/lib/validation";
import Error from "./Error";
import useFetch from "@/hooks/useFetch";
import { UrlState } from "@/context/context";

const schema = urlFormSchema;

const emptyForm = { title: "", longUrl: "", customUrl: "" };

export function CreateLink({ fetchUrls }) {
  const { user } = UrlState();
  const qrRef = useRef(null);
  const titleRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(!!longLink);
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const {
    loading,
    error,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {
    ...formValues,
    user_id: user?.id,
  });

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => titleRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDialogOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchParams({});
      setFormValues(emptyForm);
      setErrors({});
    }
  };

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
    const first = Object.keys(fieldErrors)[0];
    if (first) document.getElementById(`create-${first}`)?.focus();
  };

  const createNewLink = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formValues, { abortEarly: false });
    } catch (err) {
      if (err?.name === "YupValidationError") {
        const newErrors = {};
        err.inner.forEach((fieldError) => {
          newErrors[fieldError.path] = fieldError.message;
        });
        setErrors(newErrors);
        focusFirstError(newErrors);
      }
      return;
    }

    try {
      let qrBlob = null;
      try {
        if (qrRef.current?.canvasRef?.current) {
          const canvas = qrRef.current.canvasRef.current;
          qrBlob = await new Promise((resolve) => canvas.toBlob(resolve));
        }
      } catch (qrError) {
        console.warn("QR code generation failed:", qrError);
      }
      const result = await fnCreateUrl(qrBlob);
      if (result) {
        toast.success("Link created");
        handleDialogOpenChange(false);
        fetchUrls?.();
      }
    } catch (err) {
      // API errors surface through the `error` state and are rendered inline
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger
        render={
          <Button className="gap-2 shadow-sm transition-all hover:shadow-md">
            <Plus className="size-4" aria-hidden="true" />
            Create New Link
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            Create New Link
          </DialogTitle>
          <DialogDescription>
            Shorten a long URL and get a shareable link with analytics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={createNewLink} noValidate>
          <div className="space-y-4">
            {formValues.longUrl && (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/40 p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <QrCode className="size-3.5" aria-hidden="true" />
                  QR code preview
                </p>
                <QRCode
                  ref={qrRef}
                  size={160}
                  value={formValues.longUrl}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="H"
                  includeMargin={false}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="create-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={titleRef}
                id="create-title"
                name="title"
                placeholder="e.g., My Awesome Link"
                value={formValues.title}
                onChange={handleChange}
                onClick={(e) => e.target.select()}
                disabled={loading}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={
                  errors.title ? "create-title-error" : undefined
                }
              />
              <Error id="create-title-error" message={errors.title} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-longUrl">
                Long URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-longUrl"
                name="longUrl"
                placeholder="https://example.com/your-very-long-url"
                value={formValues.longUrl}
                onChange={handleChange}
                onClick={(e) => e.target.select()}
                disabled={loading}
                aria-invalid={errors.longUrl ? true : undefined}
                aria-describedby={
                  errors.longUrl ? "create-longUrl-error" : undefined
                }
              />
              <Error id="create-longUrl-error" message={errors.longUrl} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-customUrl">
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
                  id="create-customUrl"
                  name="customUrl"
                  placeholder="my-custom-link"
                  value={formValues.customUrl}
                  onChange={handleChange}
                  onClick={(e) => e.target.select()}
                  disabled={loading}
                  aria-invalid={errors.customUrl ? true : undefined}
                  aria-describedby={
                    errors.customUrl ? "create-customUrl-error" : undefined
                  }
                />
              </div>
              <Error id="create-customUrl-error" message={errors.customUrl} />
              {!errors.customUrl && formValues.customUrl && (
                <p className="break-all text-xs text-muted-foreground">
                  Your link will be: {import.meta.env.VITE_APP_URL}/
                  {formValues.customUrl}
                </p>
              )}
            </div>

            {error && (
              <Error message={error.message || "Failed to create link"} />
            )}
          </div>

          <DialogFooter className="mt-5 gap-2 sm:gap-2">
            <Button type="submit" disabled={loading} className="min-w-28">
              {loading ? "Creating..." : "Create Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
