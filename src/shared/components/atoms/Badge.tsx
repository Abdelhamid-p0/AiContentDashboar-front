type BadgeVariant = "neutral" | "success" | "warning" | "danger";

type BadgeProps = {
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
}: BadgeProps) {
  const dotClass = dot ? "badge-dot" : "";

  return (
    <span className={`badge badge-${variant} ${dotClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
