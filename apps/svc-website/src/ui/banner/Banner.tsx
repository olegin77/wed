import React, { type HTMLAttributes, type ReactNode } from "react";

export type BannerVariant = "info" | "success" | "warning";

export interface BannerAction {
  readonly href: string;
  readonly label: string;
  readonly description?: string;
}

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Main message shown inside the banner. Keep it concise and actionable.
   */
  readonly message: string;
  /**
   * Optional visual element (icon/emoji) rendered before the message.
   */
  readonly icon?: ReactNode;
  /**
   * Optional action that will be presented as a subtle link button.
   */
  readonly action?: BannerAction;
  /**
   * Controls background color to match the tone of the announcement.
   */
  readonly variant?: BannerVariant;
}

const VARIANT_STYLES: Record<BannerVariant, string> = {
  info: "bg-sky-50 text-sky-900 ring-sky-200",
  success: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
};

/**
 * Banner is a reusable site-wide announcement component used to promote launch
 * updates, beta programs or seasonal offers. It keeps layout stable on mobile
 * by falling back to a single column when there is not enough horizontal space.
 */
export default function Banner({
  message,
  icon,
  action,
  variant = "info",
  className = "",
  ...rest
}: BannerProps) {
  const baseClasses = VARIANT_STYLES[variant];
  return (
    <div
      role="status"
      className={`border-b border-black/5 px-4 py-3 text-sm shadow-sm sm:px-6 ${baseClasses} ${className}`.trim()}
      {...rest}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          {icon ? <span aria-hidden>{icon}</span> : null}
          <span className="font-medium leading-6">{message}</span>
        </p>
        {action ? (
          <a
            href={action.href}
            aria-label={action.description ?? action.label}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand)]/80"
          >
            {action.label}
            <span aria-hidden>→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
