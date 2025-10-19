import type { HTMLAttributes, ReactNode } from "react";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export function Section({ title, description, children, className, ...rest }: SectionProps) {
  return (
    <section className={`my-10 space-y-4 ${className ?? ""}`.trim()} {...rest}>
      <header className="space-y-1">
        <h2 className="text-3xl font-semibold text-[var(--fg)]">{title}</h2>
        {description ? <p className="max-w-2xl text-base text-[var(--muted)]">{description}</p> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

export default Section;
