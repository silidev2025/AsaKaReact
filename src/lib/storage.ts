// Safe wrappers around localStorage, the browser's small key-value store
// that survives page reloads.
//
// localStorage can throw an error (for example in private browsing, or when
// the user blocks site data). These helpers catch that, so a missing
// "remember me" setting never breaks the app. Use them with STORAGE_KEYS
// from src/config/storageKeys.ts.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Can't save; the app just won't remember this next time.
  }
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}
