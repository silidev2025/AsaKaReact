// Lets code read colors from src/styles/theme.css.
//
// Most of the app uses CSS variables (var(--color-primary)) in .css files.
// But some things are drawn by code, not CSS, like the route line on the map
// (MapLibre paints it on a canvas). Reading the value from the theme keeps
// theme.css the one place where colors are set.

/** The value of a CSS variable from theme.css, like "hsl(5, 53%, 32%)". */
export function readThemeColor(variableName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}
