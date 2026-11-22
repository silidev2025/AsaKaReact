// Returns true while the browser has an internet connection, and updates
// when it goes on or off line. Works the same way as useMediaQuery.

import { useSyncExternalStore } from "react";

export function useOnlineStatus() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("online", onChange);
      window.addEventListener("offline", onChange);
      return () => {
        window.removeEventListener("online", onChange);
        window.removeEventListener("offline", onChange);
      };
    },
    () => navigator.onLine,
  );
}
