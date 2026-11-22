// The search box at the top of the home screen, with its dropdown of
// suggestions (see Suggestions.tsx) right under it.
//
// Typing updates the query store (src/store/queryStore.ts). Picking a
// suggestion makes it the "result"; later features show that result in the
// side panel and fly the map to it.
//
// Ways to empty the box: the X button, or the Escape key.

import { useEffect, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import searchData from "../../data/search.json";
import { cx } from "../../lib/cx";
import { useModalStore } from "../../store/modalStore";
import { useQueryStore } from "../../store/queryStore";
import Suggestions from "./Suggestions";
import s from "./Search.module.css";

export default function Search() {
  const inputValue = useQueryStore((state) => state.inputValue);
  const queryType = useQueryStore((state) => state.type);
  const setInputValue = useQueryStore((state) => state.setInputValue);
  const clearQuery = useQueryStore((state) => state.clearQuery);

  // useRef can also point at an element on the page. React fills
  // inputRef.current with the <input> below once it is on screen, so we can
  // call inputRef.current.focus() to put the cursor back in the box.
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    clearQuery();
    inputRef.current?.focus(); // "?." skips it if the input isn't there
  }

  // Escape empties the search, unless a pop-up window is open: then Escape
  // belongs to the window, which closes itself (see src/components/Modal.tsx).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // The window already used this key press, or is still open.
      if (event.defaultPrevented || useModalStore.getState().isOpen) return;

      // getState() reads the store's current values. Inside a listener that
      // is safer than the values from the last render, which may be old.
      const { inputValue, type } = useQueryStore.getState();
      if (inputValue !== "" || type === "result") clearQuery();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearQuery]);

  return (
    // While typing (not after picking a result), the suggestions show
    // whenever the box has focus. The CSS file does the showing.
    <div className={cx(s.searchArea, queryType === "query" && s.isTyping)}>
      <div className={s.searchBox}>
        <SearchIcon size={20} className={s.searchIcon} aria-hidden />

        {/* A "controlled" text box: it always shows inputValue from the
            store, and every key press sends the new text to the store. */}
        <input
          ref={inputRef}
          type="text"
          id="search"
          autoComplete="off"
          aria-label="Search"
          placeholder={searchData.placeholder}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className={s.input}
        />

        {inputValue !== "" && (
          <button
            type="button"
            className={s.clearButton}
            aria-label="Clear Search"
            onClick={handleClear}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <Suggestions />
    </div>
  );
}
