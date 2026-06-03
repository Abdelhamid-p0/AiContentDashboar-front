import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function SearchField({
  label,
  className = "",
  ...props
}: SearchFieldProps) {
  const ariaLabel = label ?? props.placeholder ?? "Search";

  return (
    <label
      className={`search-field ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <Search size={16} />
      <input className="search-input" type="search" {...props} />
    </label>
  );
}
