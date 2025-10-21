'use client';

import React from "react";

type LanguageCode = "ru" | "uz";

export interface LanguageSwitcherProps {
  /** Explicitly set the initial language (defaults to stored preference or RU). */
  defaultLanguage?: LanguageCode;
  /** Called whenever the selected language changes. */
  onChange?: (language: LanguageCode) => void;
  /** Optional id for associating the control with external labels. */
  id?: string;
  className?: string;
}

export const SUPPORTED_LANGUAGES: ReadonlyArray<{
  code: LanguageCode;
  label: string;
}> = [
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O‘zbekcha" },
];

function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === "undefined") {
    return "ru";
  }
  const languages = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language];
  for (const entry of languages) {
    if (!entry) continue;
    const lowered = entry.toLowerCase();
    if (lowered.startsWith("uz")) {
      return "uz";
    }
  }
  return "ru";
}

function readStoredLanguage(): LanguageCode | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const value = window.localStorage.getItem("wt:lang");
    return value === "ru" || value === "uz" ? value : null;
  } catch (error) {
    console.warn("language preference read failed", error);
    return null;
  }
}

export function LanguageSwitcher({ defaultLanguage, onChange, id, className }: LanguageSwitcherProps) {
  const initial = React.useMemo(() => {
    return defaultLanguage ?? readStoredLanguage() ?? detectBrowserLanguage();
  }, [defaultLanguage]);
  const [language, setLanguage] = React.useState<LanguageCode>(initial);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("wt:lang", language);
      } catch (error) {
        console.warn("language preference write failed", error);
      }
    }
    onChange?.(language);
  }, [language, onChange]);

  const handleSelect = React.useCallback(
    (next: LanguageCode) => {
      setLanguage(next);
    },
    [],
  );

  const classes = ["wt-language-switcher", className].filter(Boolean).join(" ");

  return (
    <div
      id={id}
      className={classes}
      role="radiogroup"
      aria-label="Выбор языка интерфейса"
      data-testid="language-switcher"
    >
      {SUPPORTED_LANGUAGES.map((option) => {
        const isActive = option.code === language;
        return (
          <button
            key={option.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`wt-language-switcher__option${isActive ? " is-active" : ""}`}
            onClick={() => handleSelect(option.code)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
