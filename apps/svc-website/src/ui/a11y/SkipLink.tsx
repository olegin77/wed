import React from "react";

export interface SkipLinkProps {
  /**
   * Identifier of the element that receives focus when the link is activated.
   * The value can be passed with or without the leading `#` symbol.
   */
  targetId?: string;
  /**
   * Accessible label displayed to users. Provide a translated message when the
   * interface language changes.
   */
  label?: string;
  /** Optional className for styling overrides. */
  className?: string;
}

function normaliseTarget(target?: string): string {
  const fallback = "main-content";
  if (!target) {
    return fallback;
  }
  return target.startsWith("#") ? target.slice(1) : target;
}

/**
 * Accessible skip link that becomes visible on focus and allows keyboard and
 * assistive technology users to jump straight to the main content region.
 */
export function SkipLink({ targetId, label = "Перейти к основному контенту", className }: SkipLinkProps) {
  const href = `#${normaliseTarget(targetId)}`;
  const classes = ["skip-link", className].filter(Boolean).join(" ");
  return (
    <a href={href} className={classes} data-testid="skip-link">
      {label}
    </a>
  );
}

export default SkipLink;
