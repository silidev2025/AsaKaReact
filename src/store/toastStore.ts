// Short messages ("toasts") that pop up near the bottom of the screen, like
// "Location found!". Only one shows at a time; a new one replaces the old.
//
// Show one from anywhere:
//   useToastStore.getState().showToast("Location found!", "success");
//
// src/components/Toast.tsx draws it and closes it after a few seconds.

import { create } from "zustand";

/** Decides the color and icon: blue info, red error, green success. */
export type ToastType = "info" | "error" | "success";

export type ToastMessage = {
  /** A new number for every message, so React can tell two messages apart
   *  even when their text is the same. */
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toast: ToastMessage | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
};

let nextId = 1;

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  showToast: (message, type = "info") => {
    set({ toast: { id: nextId, message, type } });
    nextId += 1;
  },
  clearToast: () => set({ toast: null }),
}));

/** A shortcut for code outside components, like other stores. */
export function showToast(message: string, type?: ToastType) {
  useToastStore.getState().showToast(message, type);
}
