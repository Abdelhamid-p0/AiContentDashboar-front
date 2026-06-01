type BadgeVariant = "neutral" | "success" | "warning" | "danger";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
};

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
