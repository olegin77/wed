import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

/**
 * A rounded primary button that gracefully switches into a loading state.
 * While loading the control remains focusable but disabled, showing a spinner
 * and accessible label so screen readers announce the progress.
 */
export interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true the spinner is shown and the button is disabled. */
  loading?: boolean;
  /** Textual description announced to assistive technologies. */
  spinnerLabel?: string;
}

function joinClassNames(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { loading = false, spinnerLabel = "Загрузка…", className, disabled, children, ...rest },
    ref,
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        className={joinClassNames("wt-loading-button", loading && "is-loading", className)}
        disabled={loading || disabled}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span aria-hidden="true" className="wt-loading-button__spinner" />
            <span className="wt-loading-button__label">{spinnerLabel}</span>
          </>
        ) : (
          <span className="wt-loading-button__label">{children}</span>
        )}
      </button>
    );
  },
);

export { LoadingButton };
export default LoadingButton;
