import React, { type HTMLAttributes, type ReactNode } from "react";

export type CardProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ title, actions, children, className, ...rest }: CardProps) {
  return (
    <div
      className={`card shadow-sm ring-1 ring-black/5 transition hover:shadow-md ${className ?? ""}`.trim()}
      {...rest}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-lg font-semibold text-[var(--fg)]">{title}</h3> : <span />}
          {actions}
        </div>
      )}
      <div className="space-y-3 text-[var(--fg)]">{children}</div>
    </div>
  );
}

export default Card;
