import Link from "next/link";

const variantClasses = {
  primary:
    "bg-[var(--color-brand)] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)]",
  secondary:
    "border border-[var(--color-line-strong)] bg-white/90 text-slate-800 backdrop-blur-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white",
  ghost: "bg-white/45 text-slate-700 backdrop-blur-sm hover:bg-white/70",
};

const sizeClasses = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

export default function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) {
  // Build one shared class string so links and buttons look the same.
  const buttonClasses = [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
