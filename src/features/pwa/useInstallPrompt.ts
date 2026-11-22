// Decides whether to offer "Install YourRoute", and how.
//
// Browsers handle installing differently, so there are three kinds ("modes"):
//   native   - Chrome/Edge gave us an install event; our button opens the
//              browser's real install dialog.
//   ios      - iPhone/iPad Safari has no install event; we explain the
//              Share > Add to Home Screen steps instead.
//   fallback - Android without the event; we explain the browser menu.
//
// Settings (which sites, how long to wait, snooze time): INSTALL_PROMPT in
// src/config/ui.ts.

import { useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "../../config/storageKeys";
import { INSTALL_PROMPT } from "../../config/ui";
import { isAndroid, isIos, isRunningAsInstalledApp } from "../../lib/device";
import { readStorage, writeStorage } from "../../lib/storage";

export type InstallMode = "native" | "ios" | "fallback";

/** The browser's install event. TypeScript doesn't know it, so we describe it. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const HOUR_MS = 60 * 60 * 1000;

function isForced() {
  return new URLSearchParams(window.location.search).has(
    INSTALL_PROMPT.forceParameter,
  );
}

function wasSnoozed() {
  const dismissedAt = Number(readStorage(STORAGE_KEYS.installPromptDismissedAt) ?? 0);
  return Date.now() - dismissedAt < INSTALL_PROMPT.snoozeHours * HOUR_MS;
}

function rememberDismissed() {
  writeStorage(STORAGE_KEYS.installPromptDismissedAt, String(Date.now()));
}

/** Should this visit offer the install prompt at all? */
function shouldOffer() {
  if (isRunningAsInstalledApp()) return false;
  if (isForced()) return true;
  const onAllowedSite = INSTALL_PROMPT.showOnHosts.some((pattern) =>
    pattern.test(window.location.hostname),
  );
  return onAllowedSite && !wasSnoozed();
}

export function useInstallPrompt() {
  const [mode, setMode] = useState<InstallMode | null>(null);
  // The install event is saved for later (when the user taps Install).
  // It isn't something to draw, so a ref is enough.
  const installEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!shouldOffer()) return;

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault(); // stop the browser's own mini prompt
      installEvent.current = event as BeforeInstallPromptEvent;
      setMode("native");
    };
    const handleInstalled = () => {
      installEvent.current = null;
      rememberDismissed();
      setMode(null);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    // If the browser never sends the event, explain how to install by hand.
    const timer = setTimeout(() => {
      // setMode can take a function: it gets the current value, so an
      // already chosen "native" mode is kept.
      setMode((current) => {
        if (current) return current;
        if (isIos()) return "ios";
        if (isAndroid() || isForced()) return "fallback";
        return null;
      });
    }, INSTALL_PROMPT.showDelayMs);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      clearTimeout(timer);
    };
  }, []);

  /** "Later" (or "Got it"): hide and stay hidden for the snooze time. */
  function dismiss() {
    rememberDismissed();
    setMode(null);
  }

  /** "Install": open the browser's install dialog when it offered one. */
  async function install() {
    const event = installEvent.current;
    if (!event) {
      dismiss();
      return;
    }
    installEvent.current = null;
    setMode(null);
    await event.prompt();
    try {
      await event.userChoice;
    } finally {
      rememberDismissed();
    }
  }

  return { mode, install, dismiss };
}
