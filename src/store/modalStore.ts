// Which pop-up window ("modal") is open. Only one can be open at a time.
//
// Open one from anywhere:   useModalStore.getState().openModal("welcome")
// or inside a component:    const openModal = useModalStore((s) => s.openModal);
//
// To add a new kind of window: add its name to ModalType below, then show
// its content in src/features/home/ModalHost.tsx.

import { create } from "zustand";

export type ModalType = "welcome";

type ModalState = {
  /** The window to show. It stays set while the window animates closed. */
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  type: null,
  isOpen: false,
  openModal: (type) => set({ type, isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
