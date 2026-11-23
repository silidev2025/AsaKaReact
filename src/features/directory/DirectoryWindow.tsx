// The Directory window: every CIT-U building, A to Z, with its rooms, and a
// box to narrow the list down. Tapping a building or a room closes the
// window and shows it like a search result (side panel and map).
//
// Opened by "Browse all buildings" in the search dropdown
// (OpenDirectoryButton.tsx), and listed in src/features/home/ModalHost.tsx.

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { DIRECTORY_COUNTS, filterDirectory } from "../../lib/directory";
import { countLabel } from "../../lib/format";
import type { SearchItem } from "../../lib/search";
import { useModalStore } from "../../store/modalStore";
import { useQueryStore } from "../../store/queryStore";
import BuildingCard from "./BuildingCard";
import s from "./Directory.module.css";

export default function DirectoryWindow() {
  // The filter text belongs to this window only, so it is plain useState,
  // not a store. It starts empty every time the window opens.
  const [filterText, setFilterText] = useState("");
  const selectResult = useQueryStore((state) => state.selectResult);
  const closeModal = useModalStore((state) => state.closeModal);

  const entries = filterDirectory(filterText);

  /** Shows the picked building or room as the search result. */
  function handlePick(item: SearchItem) {
    selectResult(item);
    closeModal();
  }

  return (
    <div className={s.directory}>
      <header className={s.header}>
        <h2 className={s.title}>Directory</h2>
        <p className={s.subtitle}>
          {countLabel(DIRECTORY_COUNTS.buildings, "building")},{" "}
          {countLabel(DIRECTORY_COUNTS.rooms, "room")}. Tap one to see it on the
          map.
        </p>
      </header>

      {/* A <label> around the input makes a click anywhere on it, even on
          the icon, put the cursor in the box. */}
      <label className={s.filter}>
        <SearchIcon size={18} aria-hidden />
        <input
          type="text"
          className={s.filterInput}
          placeholder="Filter buildings or rooms"
          aria-label="Filter buildings or rooms"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
      </label>

      {entries.length === 0 ? (
        <p className={s.empty}>Nothing matches "{filterText}".</p>
      ) : (
        <ul className={s.list}>
          {entries.map((entry) => (
            <BuildingCard key={entry.building.name} entry={entry} onPick={handlePick} />
          ))}
        </ul>
      )}
    </div>
  );
}
