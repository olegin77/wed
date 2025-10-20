import { forwardRef, useId } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  /** Controlled value of the field. */
  value: string;
  /** Change handler that receives the sanitised string value. */
  onChange: (value: string) => void;
  /** Optional label rendered above the input element. */
  label?: ReactNode;
  /** Optional helper text rendered under the control. */
  helperText?: ReactNode;
  /** Validation error message; sets the invalid state when provided. */
  error?: ReactNode;
  /** Show a clear button that resets the value to an empty string. */
  clearable?: boolean;
}

function normaliseWhitespace(value: string) {
  return value.replace(/\s+/g, " ");
}

/**
 * Input is a controlled text field with optional label, helper text and error states.
 * It normalises whitespace on change and exposes a clear-button shortcut for quick resets.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { value, onChange, label, helperText, error, clearable = true, className = "", ...rest },
  ref,
) {
  const fieldId = rest.id ?? useId();
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(normaliseWhitespace(event.target.value));
  };

  const handleClear = () => {
    onChange("");
  };

  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  const showClear = clearable && value.length > 0 && !rest.readOnly && !rest.disabled;

  return (
    <label htmlFor={fieldId} className={`block text-sm font-medium text-[var(--fg)] ${className}`.trim()}>
      {label ? <span className="mb-1 block text-[var(--muted-strong,#333)]">{label}</span> : null}
      <div className="relative">
        <input
          id={fieldId}
          ref={ref}
          value={value}
          onChange={handleChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-2xl border px-3 py-2 text-base outline-none transition focus:ring-2 focus:ring-[var(--brand)] ${
            error ? "border-red-400 focus:ring-red-400" : "border-black/10"
          } ${showClear ? "pr-10" : "pr-3"}`}
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-1/2 right-3 flex -translate-y-1/2 items-center rounded-full bg-black/5 px-2 text-xs uppercase tracking-wide text-[var(--muted)] transition hover:bg-black/10"
            aria-label="Очистить поле"
          >
            Очистить
          </button>
        ) : null}
      </div>
      {helperText ? (
        <span id={helperId} className="mt-1 block text-xs text-[var(--muted)]">
          {helperText}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="mt-1 block text-xs font-medium text-red-500">
          {error}
        </span>
      ) : null}
    </label>
  );
});

export default Input;
