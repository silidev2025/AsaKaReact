// Lets something animate out before it disappears.
//
// Normally, when a component stops being shown, React removes it at once,
// so there is no time for a closing animation. usePresence keeps it on the
// page a little longer:
//
//   const { isMounted, isClosing } = usePresence(isOpen, 250);
//   if (!isMounted) return null;              // fully gone
//   <div className={isClosing ? s.closing : s.opening}>  // pick the animation

import { useEffect, useState } from "react";

export function usePresence(isOpen: boolean, exitDurationMs: number) {
  const [stillVisible, setStillVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setStillVisible(true);
      return;
    }
    // Closing: wait for the animation, then remove it.
    const timer = setTimeout(() => setStillVisible(false), exitDurationMs);
    return () => clearTimeout(timer);
  }, [isOpen, exitDurationMs]);

  return {
    isMounted: isOpen || stillVisible,
    isClosing: !isOpen && stillVisible,
  };
}
