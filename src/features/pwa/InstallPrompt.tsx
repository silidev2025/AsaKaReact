// The "Install YourRoute" bar at the bottom of the screen. The logic of when
// and how to show it lives in useInstallPrompt.ts; this file only draws it.
// It waits while a pop-up window is open, so the two never overlap.

import { useEffect, useState } from "react";
import { APP } from "../../config/app";
import { INSTALL_PROMPT } from "../../config/ui";
import { isAndroid } from "../../lib/device";
import { useModalStore } from "../../store/modalStore";
import { useInstallPrompt, type InstallMode } from "./useInstallPrompt";
import s from "./InstallPrompt.module.css";

/** The message and button text for each install mode. */
function getText(mode: InstallMode) {
  switch (mode) {
    case "native":
      return {
        message: "Open faster next time and keep offline access ready.",
        action: "Install",
      };
    case "ios":
      return {
        message: "On iPhone or iPad: tap Share, then Add to Home Screen.",
        action: "Got it",
      };
    case "fallback":
      return {
        message: isAndroid()
          ? "If the install button is unavailable, use Chrome menu, then Add to Home screen."
          : `Use your browser menu to add ${APP.name} to your home screen.`,
        action: "Got it",
      };
  }
}

export default function InstallPrompt() {
  const { mode, install, dismiss } = useInstallPrompt();
  const modalIsOpen = useModalStore((state) => state.isOpen);
  const [modalIsGone, setModalIsGone] = useState(!modalIsOpen);

  // After a window closes, wait a moment before showing the prompt.
  useEffect(() => {
    if (modalIsOpen) {
      setModalIsGone(false);
      return;
    }
    const timer = setTimeout(
      () => setModalIsGone(true),
      INSTALL_PROMPT.afterModalDelayMs,
    );
    return () => clearTimeout(timer);
  }, [modalIsOpen]);

  if (!mode || !modalIsGone) return null;
  const text = getText(mode);

  return (
    <div className={s.installPrompt} role="dialog" aria-live="polite" aria-label={`Install ${APP.name}`}>
      <div className={s.copy}>
        <strong>Install {APP.name}</strong>
        <span>{text.message}</span>
      </div>
      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={install}>
          {text.action}
        </button>
        <button type="button" className={s.secondary} onClick={dismiss}>
          Later
        </button>
      </div>
    </div>
  );
}
