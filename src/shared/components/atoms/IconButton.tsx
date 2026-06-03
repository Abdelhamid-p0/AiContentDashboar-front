import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "default" | "primary";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  variant?: IconButtonVariant;
  label: string;
};

export function IconButton({
  icon,
  variant = "default",
  label,
  className = "",
  ...props
}: IconButtonProps) {
  const variantClass = variant === "primary" ? "icon-button-primary" : "";

  return (
    <button
      type="button"
      className={`icon-button ${variantClass} ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
