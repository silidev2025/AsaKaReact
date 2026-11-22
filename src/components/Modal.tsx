// A pop-up window ("modal") over a dimmed background. Shared by every
// feature that needs one: put any content inside it.
//
//   <Modal isOpen={open} onClose={close} label="Welcome" variant="banner">
//     ...content...
//   </Modal>
//
// It closes when the user clicks the dimmed background or presses Escape,
// and it animates in and out. Timings are in src/config/ui.ts.
//
// "children" is a special prop: whatever you put between <Modal> and
// </Modal> arrives here as children.

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { X } from "lucide-react";
import { MODAL_ANIMATION } from "../config/ui";
import { usePresence } from "../hooks/usePresence";
import { cx } from "../lib/cx";
import s from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Read out by screen readers to say what the window is. */
  label: string;
  /**
   * "standard": padded window with a close (X) button.
   * "banner": no padding or X, for content that fills the window edge to
   * edge and has its own button, like the welcome window.
   */
  variant?: "standard" | "banner";
  children: ReactNode;
};

const { backdropMs, windowMs, windowDelayMs, windowSlidePx } = MODAL_ANIMATION;
/** The closing animation ends when the slower of the two parts finishes. */
const EXIT_DURATION_MS = Math.max(backdropMs, windowDelayMs + windowMs);

/** Hands the timings from config to the CSS file as CSS variables. */
const ANIMATION_STYLE = {
  "--backdrop-ms": `${backdropMs}ms`,
  "--window-ms": `${windowMs}ms`,
  "--window-delay-ms": `${windowDelayMs}ms`,
  "--window-slide": `${windowSlidePx}px`,
} as CSSProperties;

export default function Modal({
  isOpen,
  onClose,
  label,
  variant = "standard",
  children,
}: ModalProps) {
  const { isMounted, isClosing } = usePresence(isOpen, EXIT_DURATION_MS);

  // Close on Escape. The listener is only added while the window is open,
  // and the cleanup function removes it again.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Marks the key press as used, so other Escape listeners (like the
      // search box, which empties itself on Escape) leave it alone.
      event.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Returning null means "show nothing".
  if (!isMounted) return null;

  return (
    <div
      className={cx(s.modalSet, isClosing && s.closing)}
      style={ANIMATION_STYLE}
      data-modal-open
    >
      <button
        type="button"
        className={s.backdrop}
        aria-label="Close window"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cx(s.window, variant === "banner" && s.banner)}
      >
        {variant === "standard" && (
          <button
            type="button"
            className={s.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
