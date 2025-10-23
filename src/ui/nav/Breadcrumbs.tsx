import React from "react";
import type { ReactNode } from "react";

/**
 * Breadcrumb navigation used across catalog and marketing pages.
 * Each crumb becomes a focusable link except for the final item,
 * which is marked as the current location for assistive tech.
 */
export interface BreadcrumbItem {
  /** URL to navigate to when the crumb is activated. */
  href?: string;
  /** User facing label displayed inside the navigation trail. */
  label: ReactNode;
}

export interface BreadcrumbsProps {
  /** Ordered list of crumbs rendered inside the navigation trail. */
  items: readonly BreadcrumbItem[];
  /** Optional override for the visual separator displayed between crumbs. */
  separator?: ReactNode;
  /** Additional class names merged with the default breadcrumb styling. */
  className?: string;
}

function joinClassNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function Breadcrumbs({
  items,
  separator = "›",
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Хлебные крошки" className={joinClassNames("wt-breadcrumbs", className)}>
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = isLast ? (
            <span aria-current="page" className="wt-breadcrumbs__current">
              {item.label}
            </span>
          ) : (
            <a className="wt-breadcrumbs__link" href={item.href}>
              {item.label}
            </a>
          );

          return (
            <li key={index}>
              {content}
              {!isLast && <span className="wt-breadcrumbs__separator">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
