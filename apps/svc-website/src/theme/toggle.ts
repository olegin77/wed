const STORAGE_KEY = "theme";

function getRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.documentElement;
}

export function applyTheme(dark: boolean) {
  const root = getRoot();
  if (!root) return;
  root.classList.toggle("dark", dark);
  try {
    window.localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Unable to persist theme preference", error);
    }
  }
}

export function initTheme() {
  const root = getRoot();
  if (!root) return;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  const prefersDark =
    stored === "dark" ||
    (stored === null && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", !!prefersDark);
  return prefersDark;
}
