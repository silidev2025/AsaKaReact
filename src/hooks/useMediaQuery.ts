// A "hook" is a function whose name starts with "use" and that can use
// React features. Components call it to get a value that stays up to date.
//
// useMediaQuery(MOBILE_MEDIA_QUERY) returns true on phone-sized screens and
// re-renders the component when the window is resized past the breakpoint.
//
// useSyncExternalStore is React's way to read something that lives outside
// React (here, the browser's media query). It takes:
//   1. subscribe: start listening for changes, and return a way to stop
//   2. getSnapshot: read the current value

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}
