import React from "react";

/**
 * ContextSwitch renders a minimal toggle that lets operators jump between their
 * personal workspace and an agency profile. The component is intentionally
 * self-contained so it can be dropped into any account header while we hook it
 * up to real session data.
 */
export type ContextSwitchProps = {
  /**
   * Initial context rendered for the current viewer. Defaults to a personal
   * profile so existing single-account users see a familiar state.
   */
  defaultContext?: "me" | "agency";
  /**
   * Optional callback fired whenever a different context is selected. Useful
   * for wiring the switch to router/navigation logic.
   */
  onChange?: (context: "me" | "agency") => void;
};

const LABELS: Record<"me" | "agency", string> = {
  me: "Личный",
  agency: "Агентство",
};

/**
 * Shared tailwind-inspired tokens allow custom themes without rewriting the
 * component. The active style leans on the CSS variable used across the website
 * for primary actions.
 */
const BASE_BUTTON_CLASSES =
  "px-3 py-1 text-sm font-medium rounded-2xl transition-colors duration-150";

const ACTIVE_CLASSES = "bg-[var(--brand)] text-white shadow-sm";
const INACTIVE_CLASSES = "bg-gray-200 text-gray-700 hover:bg-gray-300";

/**
 * Helper for deriving the class list for a button depending on its state. The
 * function keeps logic pure for easier unit testing later on.
 */
function getButtonClasses(active: boolean): string {
  return `${BASE_BUTTON_CLASSES} ${active ? ACTIVE_CLASSES : INACTIVE_CLASSES}`;
}

/**
 * ContextSwitch
 * @example
 * ```tsx
 * <ContextSwitch onChange={(context) => console.log(context)} />
 * ```
 */
export default function ContextSwitch({
  defaultContext = "me",
  onChange,
}: ContextSwitchProps) {
  const [context, setContext] = React.useState<"me" | "agency">(defaultContext);

  const handleSelect = (next: "me" | "agency") => {
    setContext(next);
    onChange?.(next);
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Переключение контекста аккаунта">
      {(Object.keys(LABELS) as Array<"me" | "agency">).map((option) => (
        <button
          key={option}
          type="button"
          className={getButtonClasses(context === option)}
          onClick={() => handleSelect(option)}
          aria-pressed={context === option}
          data-context={option}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
}

export { getButtonClasses };
