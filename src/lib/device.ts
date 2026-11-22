// Questions about the user's device and browser.

export function isIos() {
  const userAgent = navigator.userAgent;
  // iPads report themselves as Macs, but Macs have no touch screen.
  const isIpadAsMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/i.test(userAgent) || isIpadAsMac;
}

export function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

/** True when the app was opened from the home screen as an installed app. */
export function isRunningAsInstalledApp() {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean })
    .standalone;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    iosStandalone === true
  );
}
