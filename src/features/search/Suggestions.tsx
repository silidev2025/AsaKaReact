// The dropdown under the search box. What it shows depends on the text:
//
//   box empty, has recent searches ....... "Recent searches"
//   box empty, no recent searches ........ "Trending searches"
//   text typed, something matches ........ the matching buildings and rooms
//   text typed, nothing matches .......... "No CIT-U match found for ..."
//
// When the box is empty the dropdown is always visible, and ends with
// "Browse all buildings" (from the Directory feature). Otherwise it only
// shows while the search box has focus (see Search.module.css).

import OpenDirectoryButton from "../directory/OpenDirectoryButton";
import { CAMPUS } from "../../lib/campus";
import { cx } from "../../lib/cx";
import {
  getSuggestions,
  isKnownSearchItem,
  TRENDING_SEARCHES,
  type SearchItem,
} from "../../lib/search";
import { useQueryStore } from "../../store/queryStore";
import SuggestionItem from "./SuggestionItem";
import s from "./Search.module.css";

/** A key that is the same for the same item on every render. */
function itemKey(item: SearchItem) {
  return `${item.category}:${item.value}`;
}

export default function Suggestions() {
  const inputValue = useQueryStore((state) => state.inputValue);
  const recentSearches = useQueryStore((state) => state.recentSearches);
  const selectResult = useQueryStore((state) => state.selectResult);

  // These are worked out fresh on every render from the store's values.
  // There's no need to keep them in useState: they can always be
  // recalculated, and storing them would risk them going out of date.
  const isEmpty = inputValue === "";
  const suggestions = getSuggestions(inputValue);
  const knownRecentSearches = recentSearches.filter(isKnownSearchItem);

  // A small helper that draws a list of items, used for all three lists.
  function renderItems(items: SearchItem[]) {
    return items.map((item) => (
      <SuggestionItem
        key={itemKey(item)}
        item={item}
        typedText={inputValue}
        onSelect={selectResult}
      />
    ));
  }

  // An early "return" picks what to show inside the dropdown.
  function renderContent() {
    if (isEmpty && knownRecentSearches.length > 0) {
      return (
        <>
          <h2 className={s.heading}>Recent searches</h2>
          {renderItems(knownRecentSearches)}
        </>
      );
    }
    if (isEmpty) {
      return (
        <>
          <h2 className={s.heading}>Trending searches</h2>
          {renderItems(TRENDING_SEARCHES)}
        </>
      );
    }
    if (suggestions.length > 0) {
      return renderItems(suggestions);
    }
    return (
      <p className={s.noMatch}>
        No {CAMPUS.shortName} match found for <strong>{inputValue}</strong>
      </p>
    );
  }

  return (
    <div className={cx(s.suggestions, isEmpty && s.alwaysVisible)}>
      {renderContent()}
      {isEmpty && <OpenDirectoryButton />}
    </div>
  );
}
