type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "accent";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-white shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg active:scale-[0.98]",
  secondary:
    "bg-white text-[var(--fg)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--primary-light)]",
  ghost:
    "bg-transparent text-[var(--fg-muted)] border border-transparent hover:bg-white hover:border-[var(--border)]",
  danger:
    "bg-[var(--danger)] text-white shadow-md hover:brightness-110 active:scale-[0.98]",
  success:
    "bg-[var(--success)] text-white shadow-md hover:brightness-110 active:scale-[0.98]",
  accent:
    "bg-[var(--accent)] text-white shadow-md hover:brightness-110 active:scale-[0.98]",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-xl min-h-10",
  md: "px-5 py-3 text-sm rounded-2xl min-h-12",
  lg: "px-6 py-4 text-base rounded-2xl min-h-14",
  xl: "px-8 py-5 text-lg rounded-2xl font-bold min-h-16",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
