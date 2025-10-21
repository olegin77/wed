import React from "react";
import type { ReactNode } from "react";

/**
 * Feature cards surfaced on the marketing homepage.
 * Designed to be data-driven, making it easy to reuse across
 * onboarding or release highlight pages while staying accessible.
 */
export interface FeatureItem {
  /** Human-friendly label summarising the capability. */
  title: string;
  /** Supporting explanation that can include inline emphasis. */
  description: ReactNode;
  /** Optional call-to-action link label shown below the copy. */
  ctaLabel?: ReactNode;
  /** Destination for the call-to-action link. */
  ctaHref?: string;
  /** Optional key stat or metric highlighted above the title. */
  stat?: ReactNode;
}

export interface FeatureHighlightsProps {
  /** Main heading for the feature block. */
  title?: ReactNode;
  /** Introductory copy shown under the heading. */
  intro?: ReactNode;
  /** Collection of feature descriptors rendered inside the grid. */
  features: readonly FeatureItem[];
  /** Allow callers to extend styling for different surfaces. */
  className?: string;
}

function joinClassNames(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

export function FeatureHighlights({
  title,
  intro,
  features,
  className,
}: FeatureHighlightsProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <section className={joinClassNames("wt-feature-highlights", className)}>
      {(title || intro) && (
        <header className="wt-feature-highlights__header">
          {title ? <h2>{title}</h2> : null}
          {intro ? <p>{intro}</p> : null}
        </header>
      )}
      <ul className="wt-feature-highlights__list">
        {features.map((feature, index) => (
          <li className="wt-feature-highlights__item" key={index}>
            {feature.stat ? (
              <p className="wt-feature-highlights__stat">{feature.stat}</p>
            ) : null}
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            {feature.ctaLabel && feature.ctaHref ? (
              <a className="wt-feature-highlights__link" href={feature.ctaHref}>
                {feature.ctaLabel}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeatureHighlights;
