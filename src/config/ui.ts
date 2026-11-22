// Timing and behavior of shared pieces of the interface.

export const MODAL_ANIMATION = {
  /** How long the dark background takes to fade in or out. */
  backdropMs: 200,
  /** How long the window takes to slide in or out. */
  windowMs: 200,
  /** The window starts sliding this long after the background starts fading. */
  windowDelayMs: 50,
  /** How far below its final spot the window starts, in pixels. */
  windowSlidePx: 50,
};

export const INSTALL_PROMPT = {
  /**
   * The install prompt only appears on these sites (the testing tunnels),
   * the same as the Astro version. Add your real site here to show it there
   * too. Adding ?installPrompt to any address forces it to show.
   */
  showOnHosts: [/\.trycloudflare\.com$/i, /\.loca\.lt$/i],
  forceParameter: "installPrompt",
  /** After "Later", stay hidden for this many hours. */
  snoozeHours: 24,
  /** Wait this long after the page opens before showing the prompt. */
  showDelayMs: 1400,
  /** Wait this long after a window closes before showing the prompt. */
  afterModalDelayMs: 260,
};
