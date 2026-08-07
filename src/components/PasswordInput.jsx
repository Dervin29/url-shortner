import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = "Enter your password",
  describedBy,
  invalid,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={name === "password" ? "current-password" : "new-password"}
        className="pr-10"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        disabled={disabled}
      >
        {show ? (
          <EyeSlash weight="bold" className="size-4" aria-hidden="true" />
        ) : (
          <Eye weight="bold" className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
