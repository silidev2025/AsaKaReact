// "Browse all buildings": the last row of the search dropdown when the
// search box is empty. Opens the Directory window (DirectoryWindow.tsx).

import { List } from "lucide-react";
import { useModalStore } from "../../store/modalStore";
import s from "./Directory.module.css";

export default function OpenDirectoryButton() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <button type="button" className={s.openButton} onClick={() => openModal("directory")}>
      <List size={20} aria-hidden />
      Browse all buildings
    </button>
  );
}
