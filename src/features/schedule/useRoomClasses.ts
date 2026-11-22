// Gives a component the classes held in a room. They load in the
// background (see loadClassesForRoom in src/lib/catalog.ts), so at first
// there's nothing to show:
//
//   const classes = useRoomClasses("GLE 201");
//   classes === null   still loading
//   classes = []       loaded, the room has no classes
//   classes = [...]    loaded
//
// This is the usual way to load data in React: start loading in a
// useEffect, and put the result in state when it arrives.

import { useEffect, useState } from "react";
import { loadClassesForRoom, type ClassRow } from "../../lib/catalog";

/** What was loaded, and for which room. */
type Loaded = { roomCode: string; classes: ClassRow[] };

export function useRoomClasses(roomCode: string): ClassRow[] | null {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    // If the room changes (or the component goes away) before loading
    // finishes, the cleanup below sets this to false, and the late answer
    // is thrown away instead of showing another room's classes.
    let isStillWanted = true;

    loadClassesForRoom(roomCode).then((classes) => {
      if (isStillWanted) setLoaded({ roomCode, classes });
    });

    return () => {
      isStillWanted = false;
    };
  }, [roomCode]);

  // Classes loaded for a different room don't count: still loading.
  return loaded?.roomCode === roomCode ? loaded.classes : null;
}
