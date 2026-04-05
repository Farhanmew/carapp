export default function InputField({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  helperText = "",
  className = "",
  inputClassName = "",
  ...props
}) {
  const fieldId = id || name;

  return (
    <div className={["space-y-2", className].filter(Boolean).join(" ")}>
      {label ? (
        <label htmlFor={fieldId} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
      ) : null}

      <input
        id={fieldId}
        name={name || fieldId}
        type={type}
        placeholder={placeholder}
        className={[
          "w-full rounded-2xl border border-[var(--color-line-strong)] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-orange-100",
          inputClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {helperText ? <p className="text-xs leading-6 text-[var(--color-text-soft)]">{helperText}</p> : null}
    </div>
  );
}
