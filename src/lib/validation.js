import * as yup from "yup";

// Central, strict input schemas. Every field checks type, length, and format
// and REJECTS anything that does not match (no silent sanitize/escape). These
// are shared by the forms (inline errors) and the db/* boundary functions
// (defense in depth before anything reaches Supabase).

export const LIMITS = {
  title: { min: 1, max: 120 },
  longUrl: { min: 11, max: 2048 },
  customUrl: { min: 1, max: 40 },
  name: { min: 1, max: 120 },
  email: { max: 254 },
  password: { min: 6, max: 72 },
  profilePic: { maxBytes: 5 * 1024 * 1024 },
  slug: { min: 1, max: 40 },
  bulkIds: { min: 1, max: 100 },
};

const isHttpUrl = (value) => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const hasNoControlChars = (value) => {
  if (typeof value !== "string") return false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return false;
  }
  return true;
};

const isImageFile = (value) => {
  if (value == null) return true;
  const isFile =
    typeof File !== "undefined" && value instanceof File;
  return isFile && typeof value.type === "string" && value.type.startsWith("image/");
};

const isSmallEnough = (value) => value == null || value.size <= LIMITS.profilePic.maxBytes;

// --- Field schemas ---

export const titleSchema = yup
  .string()
  .strict()
  .required("Title is required")
  .matches(/\S/, "Title cannot be empty")
  .max(LIMITS.title.max, `Title must be at most ${LIMITS.title.max} characters`)
  .test(
    "title-no-control-chars",
    "Title contains invalid characters",
    hasNoControlChars,
  );

export const longUrlSchema = yup
  .string()
  .strict()
  .required("Long URL is required")
  .min(LIMITS.longUrl.min, "Please enter a valid URL")
  .max(LIMITS.longUrl.max, `Long URL must be at most ${LIMITS.longUrl.max} characters`)
  .test(
    "long-url-http",
    "Please enter a valid URL (include http:// or https://)",
    isHttpUrl,
  );

export const customUrlSchema = yup
  .mixed()
  .test(
    "custom-url-format",
    "Only letters, numbers, hyphens, and underscores allowed",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      return typeof value === "string" && /^[a-zA-Z0-9-_]{1,40}$/.test(value);
    },
  );

export const nameSchema = yup
  .string()
  .strict()
  .required("Name is required")
  .matches(/\S/, "Name cannot be empty")
  .max(LIMITS.name.max, `Name must be at most ${LIMITS.name.max} characters`)
  .test("name-no-control-chars", "Name contains invalid characters", hasNoControlChars);

export const emailSchema = yup
  .string()
  .strict()
  .required("Email is required")
  .max(LIMITS.email.max, `Email must be at most ${LIMITS.email.max} characters`)
  .email("Please enter a valid email address");

export const passwordSchema = yup
  .string()
  .strict()
  .required("Password is required")
  .min(LIMITS.password.min, "Password must be at least 6 characters")
  .max(LIMITS.password.max, "Password must be at most 72 characters");

export const profilePicSchema = yup
  .mixed()
  .test("profile-pic-file", "Profile picture must be an image file", isImageFile)
  .test("profile-pic-size", "Image must be 5 MB or smaller", isSmallEnough)
  .required("Profile picture is required");

export const uuidSchema = yup
  .string()
  .strict()
  .required("Invalid id")
  .uuid("Invalid id");

const isUrlId = (value) => {
  if (typeof value === "number") return Number.isInteger(value) && value > 0;
  if (typeof value === "string") return /^[1-9]\d{0,17}$/.test(value);
  return false;
};

// URLs and clicks use integer primary keys (urls.id / clicks.url_id). Accept
// the DB's number form and the numeric string form, reject everything else.
export const urlIdSchema = yup
  .mixed()
  .required("Invalid id")
  .test("url-id", "Invalid id", isUrlId);

export const urlIdArraySchema = yup
  .array()
  .of(urlIdSchema)
  .min(LIMITS.bulkIds.min, "Select at least one link")
  .max(LIMITS.bulkIds.max, `Select at most ${LIMITS.bulkIds.max} links at once`);

export const slugSchema = yup
  .string()
  .strict()
  .required("Invalid link")
  .matches(/^[a-zA-Z0-9-_]{1,40}$/, "Invalid link");

// --- Composed object schemas ---

export const urlFormSchema = yup
  .object({
    title: titleSchema,
    longUrl: longUrlSchema,
    customUrl: customUrlSchema,
  })
  .noUnknown();

export const createUrlSchema = yup
  .object({
    title: titleSchema,
    longUrl: longUrlSchema,
    customUrl: customUrlSchema,
    user_id: uuidSchema,
  })
  .noUnknown();

export const updateUrlSchema = yup
  .object({
    title: titleSchema,
    original_url: longUrlSchema,
    custom_url: customUrlSchema.nullable(),
  })
  .noUnknown();

export const loginSchema = yup
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .noUnknown();

export const signupSchema = yup
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    profile_pic: profilePicSchema,
  })
  .noUnknown();

export const resetPasswordSchema = yup
  .object({
    email: emailSchema,
  })
  .noUnknown();

export const clickRecordSchema = yup
  .object({
    id: urlIdSchema,
    originalUrl: longUrlSchema,
  })
  .noUnknown();

// Reject helper for boundary functions: throws a plain Error carrying the
// first validation message so callers surface it as an API error.
export function assertValid(schema, value, message = "Invalid input") {
  try {
    schema.validateSync(value, { abortEarly: false, strict: true });
  } catch (err) {
    if (err?.name === "ValidationError") {
      throw new Error(
        `${message}: ${err.errors?.[0] || "value does not match the expected format"}`,
        { cause: err },
      );
    }
    throw err;
  }
}
