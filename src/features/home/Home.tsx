// The home screen's interface, drawn on top of the campus map.
//
// The layer covers the whole screen but lets taps through to the map
// (pointer-events: none in the CSS); only the panels themselves catch taps.
//
//   ┌──────────────────────────────┐
//   │ panel area (Search and the   │
//   │ side panel go here next)     │
//   │                              │
//   │ status bar                   │
//   └──────────────────────────────┘
//
// It also opens the welcome window on a first visit.

import { useEffect } from "react";
import { STORAGE_KEYS } from "../../config/storageKeys";
import { readStorage } from "../../lib/storage";
import { useModalStore } from "../../store/modalStore";
import ModalHost from "./ModalHost";
import StatusBar from "./StatusBar";
import s from "./Home.module.css";

export default function Home() {
  const openModal = useModalStore((state) => state.openModal);

  // The empty list [] at the end means "run once, when Home first appears".
  useEffect(() => {
    if (readStorage(STORAGE_KEYS.hideWelcome) !== "true") {
      openModal("welcome");
    }
  }, [openModal]);

  return (
    <>
      {/* <> and </> group elements without adding an extra box to the page. */}
      <div className={s.interfaceLayer}>
        <div className={s.panelArea}>
          {/* Search and the side panel are added here by later features. */}
        </div>
        <StatusBar />
      </div>
      <ModalHost />
    </>
  );
}
