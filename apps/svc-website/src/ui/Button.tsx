import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function baseClasses(variant: "primary" | "secondary"): string {
  const common =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  if (variant === "secondary") {
    return `${common} bg-[var(--card)] text-[var(--fg)] border border-[var(--muted)]/30 hover:border-[var(--muted)] focus-visible:outline-[var(--muted)]`;
  }
  return `${common} bg-[var(--brand)] text-white hover:opacity-90 focus-visible:outline-[var(--brand)]`;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const widthClass = fullWidth ? "w-full" : "w-auto";
  return (
    <button type={type} className={`${baseClasses(variant)} ${widthClass} ${className ?? ""}`.trim()} {...rest}>
      {children}
    </button>
  );
}

export default Button;
