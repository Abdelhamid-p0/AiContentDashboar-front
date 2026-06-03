import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function SelectField({
  label,
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  const ariaLabel = label ?? props.name ?? "Select";

  return (
    <label
      className={`select-field ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <select className="select-input" {...props}>
        {children}
      </select>
      <ChevronDown className="select-icon" size={16} />
    </label>
  );
}
