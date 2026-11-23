// Draws the message from the toast store (src/store/toastStore.ts) near the
// bottom of the screen, and closes it after TOAST.durationMs
// (src/config/ui.ts) or when the user taps X.

import { useEffect } from "react";
import { Check, CircleAlert, Info, X, type LucideIcon } from "lucide-react";
import { TOAST } from "../config/ui";
import { cx } from "../lib/cx";
import { useToastStore, type ToastType } from "../store/toastStore";
import s from "./Toast.module.css";

/** The icon for each kind of message. */
const TOAST_ICONS: Record<ToastType, LucideIcon> = {
  info: Info,
  error: CircleAlert,
  success: Check,
};

export default function Toast() {
  const toast = useToastStore((state) => state.toast);
  const clearToast = useToastStore((state) => state.clearToast);

  // Start a timer each time a new message appears. The cleanup cancels the
  // old timer, so a newer message gets its full time on screen.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, TOAST.durationMs);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;
  const Icon = TOAST_ICONS[toast.type];

  return (
    // key={toast.id}: a new message is a new element, so its slide-in
    // animation plays again. role="status" makes screen readers read it.
    <div key={toast.id} role="status" className={cx(s.toast, s[toast.type])}>
      <Icon size={20} className={s.icon} aria-hidden />
      <p className={s.message}>{toast.message}</p>
      <button type="button" className={s.closeButton} aria-label="Close message" onClick={clearToast}>
        <X size={16} />
      </button>
    </div>
  );
}
