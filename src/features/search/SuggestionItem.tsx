// One row in the suggestions dropdown: an icon for the kind of thing, its
// name with the typed letters in bold, and an arrow.

import {
  ArrowUpRight,
  BookText,
  DoorClosed,
  GraduationCap,
  School,
  University,
  type LucideIcon,
} from "lucide-react";
import { splitByMatch, type SearchCategory, type SearchItem } from "../../lib/search";
import s from "./Search.module.css";

/**
 * Which icon each kind of result gets. A lookup table instead of a chain of
 * if/else: to change an icon, change it here. TypeScript checks that every
 * category has one.
 */
const CATEGORY_ICONS: Record<SearchCategory, LucideIcon> = {
  building: University,
  division: School,
  college: GraduationCap,
  room: DoorClosed,
  class: BookText,
};

type SuggestionItemProps = {
  item: SearchItem;
  /** What the user typed, to bold the matching letters. */
  typedText: string;
  onSelect: (item: SearchItem) => void;
};

export default function SuggestionItem({
  item,
  typedText,
  onSelect,
}: SuggestionItemProps) {
  // A component stored in a variable must start with a capital letter to be
  // used as a tag, so <Icon /> works but <icon /> would not.
  const Icon = CATEGORY_ICONS[item.category];
  const parts = splitByMatch(item.value, typedText);

  return (
    <button type="button" className={s.suggestion} onClick={() => onSelect(item)}>
      <Icon size={20} className={s.icon} aria-hidden />
      <span className={s.suggestionText}>
        {/* Matching parts are wrapped in <strong>, the rest is plain text.
            The list never changes order, so the index is a safe key here. */}
        {parts.map((part, index) =>
          part.isMatch ? <strong key={index}>{part.text}</strong> : part.text,
        )}
      </span>
      <ArrowUpRight size={20} className={s.arrow} aria-hidden />
    </button>
  );
}
