// The home screen's interface, drawn on top of the campus map.
//
// The layer covers the whole screen but lets taps through to the map
// (pointer-events: none in the CSS); only the panels themselves catch taps.
//
//   ┌──────────────────────────────┐
//   │ search box                   │
//   │ (the side panel goes here    │
//   │ in a later feature)          │
//   │ status bar                   │
//   └──────────────────────────────┘
//
// It also opens the welcome window on a first visit.

import { useEffect, type CSSProperties } from "react";
import { LAYOUT } from "../../config/layout";
import { STORAGE_KEYS } from "../../config/storageKeys";
import { readStorage } from "../../lib/storage";
import { useModalStore } from "../../store/modalStore";
import Search from "../search/Search";
import ModalHost from "./ModalHost";
import StatusBar from "./StatusBar";
import s from "./Home.module.css";

/** Hands the side panel width from src/config/layout.ts to the CSS files. */
const LAYOUT_STYLE = {
  "--side-panel-width": `${LAYOUT.sidePanelWidthRem}rem`,
} as CSSProperties;

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
      <div className={s.interfaceLayer} style={LAYOUT_STYLE}>
        <div className={s.panelArea}>
          <Search />
          {/* The side panel is added here by a later feature. */}
        </div>
        <StatusBar />
      </div>
      <ModalHost />
    </>
  );
}
