const toneClasses = {
  default: "border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]",
  soft: "border border-[var(--color-line)] bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)] backdrop-blur",
  dark: "border border-slate-800 bg-slate-900 text-white shadow-[var(--shadow-soft)]",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export default function Card({
  as: Component = "div",
  children,
  tone = "default",
  padding = "md",
  className = "",
  ...props
}) {
  return (
    <Component
      className={[
        "rounded-[28px]",
        toneClasses[tone] || toneClasses.default,
        paddingClasses[padding] || paddingClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
