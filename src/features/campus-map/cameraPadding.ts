// When the map centers on a building, part of the screen is covered by the
// app's panels: the side panel on the left on computers, and the bottom
// sheet on phones. "Padding" tells MapLibre to center the building in the
// part of the screen that is still visible.

import type { PaddingOptions } from "maplibre-gl";
import { LAYOUT } from "../../config/layout";

/** Converts rem to pixels using the page's real font size (usually 16px). */
function remToPixels(rem: number) {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return rem * rootFontSize;
}

// Required<...> promises that all four sides (top, right, bottom, left) are
// always given, so other code can add to them without checking.
export function getCameraPadding(isMobile: boolean): Required<PaddingOptions> {
  if (isMobile) {
    // The bottom sheet covers the lower part of a phone screen.
    const sheetHeight =
      (window.innerHeight * LAYOUT.phoneSheetHeightPercent) / 100;
    return { top: 0, right: 0, left: 0, bottom: sheetHeight };
  }
  // The side panel covers the left edge on bigger screens.
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: remToPixels(LAYOUT.sidePanelWidthRem),
  };
}
