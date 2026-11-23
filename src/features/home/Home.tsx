// The home screen's interface, drawn on top of the campus map.
//
// The layer covers the whole screen but lets taps through to the map
// (pointer-events: none in the CSS); only the panels themselves catch taps.
//
//   ┌──────────────────────────────┐
//   │ search box                   │
//   │ side panel (picked result)   │
//   │                              │
//   │ status bar                   │
//   └──────────────────────────────┘
//
// It also opens the welcome window on a first visit.

import { useEffect, type CSSProperties } from "react";
import Toast from "../../components/Toast";
import { LAYOUT } from "../../config/layout";
import { STORAGE_KEYS } from "../../config/storageKeys";
import { readMockLocation } from "../../lib/mockLocation";
import { readStorage } from "../../lib/storage";
import { useLocationStore } from "../../store/locationStore";
import { useModalStore } from "../../store/modalStore";
import Search from "../search/Search";
import SidePanel from "../search-results/SidePanel";
import ModalHost from "./ModalHost";
import StatusBar from "./StatusBar";
import s from "./Home.module.css";

/** Hands the panel sizes from src/config/layout.ts to the CSS files. */
const LAYOUT_STYLE = {
  "--side-panel-width": `${LAYOUT.sidePanelWidthRem}rem`,
  "--phone-sheet-height": `${LAYOUT.phoneSheetHeightPercent}dvh`,
} as CSSProperties;

export default function Home() {
  const openModal = useModalStore((state) => state.openModal);

  // The list at the end only holds openModal, which never changes, so this
  // runs once, when Home first appears.
  useEffect(() => {
    if (readStorage(STORAGE_KEYS.hideWelcome) !== "true") {
      openModal("welcome");
    }
  }, [openModal]);

  // For testing away from campus: a pretend position from the address
  // (see src/lib/mockLocation.ts). Runs once.
  useEffect(() => {
    const mockLocation = readMockLocation();
    if (mockLocation) useLocationStore.getState().startMockLocation(mockLocation);
  }, []);

  return (
    <>
      {/* <> and </> group elements without adding an extra box to the page. */}
      <div className={s.interfaceLayer} style={LAYOUT_STYLE}>
        <div className={s.panelArea}>
          <Search />
          <SidePanel />
        </div>
        <StatusBar />
      </div>
      <ModalHost />
      <Toast />
    </>
  );
}
