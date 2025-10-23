import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export type ToastTone = "info" | "success" | "error";

export interface ToastOptions {
  /** Textual content displayed inside the toast bubble. */
  message: ReactNode;
  /** Tone affects background colour. */
  tone?: ToastTone;
  /** Auto-dismiss duration in milliseconds. Defaults to 2500ms. */
  duration?: number;
}

type ToastState = ToastOptions & { id: number };

type Subscriber = (toast: ToastState | null) => void;

const subscribers = new Set<Subscriber>();
let nextId = 1;

function emitToast(toast: ToastState | null) {
  subscribers.forEach((callback) => callback(toast));
}

/**
 * Triggers a toast message visible in every mounted ToastHost instance.
 */
export function toast(options: ToastOptions | string) {
  const payload: ToastState = {
    id: nextId++,
    tone: "info",
    duration: 2500,
    ...(typeof options === "string" ? { message: options } : options),
  };

  emitToast(payload);

  const timeout = setTimeout(() => {
    emitToast(null);
  }, payload.duration);

  return () => {
    clearTimeout(timeout);
    emitToast(null);
  };
}

function toneClass(tone: ToastTone = "info") {
  switch (tone) {
    case "success":
      return "bg-emerald-600";
    case "error":
      return "bg-red-600";
    default:
      return "bg-slate-900";
  }
}

/**
 * ToastHost renders toast notifications for the current React tree.
 * Place it near the root of the application, e.g. in _app.tsx for Next.js.
 */
export function ToastHost() {
  const [toastState, setToastState] = useState<ToastState | null>(null);

  useEffect(() => {
    const listener: Subscriber = (toast) => {
      setToastState(toast);
    };
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  }, []);

  if (!toastState) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-lg ${toneClass(
          toastState.tone,
        )}`}
        role="status"
        aria-live="polite"
      >
        {toastState.message}
      </div>
    </div>
  );
}

export default ToastHost;
