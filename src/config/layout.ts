// Screen layout settings shared by several features.

export const LAYOUT = {
  /**
   * Screens this wide or narrower get the phone layout.
   * CSS files can't read this value, so media queries in .css files repeat
   * 48rem. If you change it here, search the .css files for 48rem too.
   */
  mobileBreakpoint: "48rem",
  /**
   * Width of the search box and side panel on computers, in rem (1rem is
   * usually 16px). Home.tsx hands it to the CSS as --side-panel-width.
   */
  sidePanelWidthRem: 25.75,
};

/** Media query for the phone layout, for use with useMediaQuery(). */
export const MOBILE_MEDIA_QUERY = `(max-width: ${LAYOUT.mobileBreakpoint})`;
