// The side panel that shows the picked search result. On computers it is a
// tall card on the left under the search box; on phones it is a sheet along
// the bottom of the screen.
//
// Which panel appears depends on the kind of result (its "category"). The
// RESULT_PANELS table below lists them; a kind that isn't in the table yet
// simply shows no panel. Later features add their own entries (RoomDetails
// adds "room").

import type { ComponentType } from "react";
import type { SearchCategory } from "../../lib/search";
import { useQueryStore } from "../../store/queryStore";
import BuildingResult from "./BuildingResult";
import s from "./SidePanel.module.css";

/**
 * The panel component for each kind of result. Each one gets the picked
 * name as its "value" prop.
 *
 * "Partial" means not every category needs an entry.
 */
const RESULT_PANELS: Partial<
  Record<SearchCategory, ComponentType<{ value: string }>>
> = {
  building: BuildingResult,
};

export default function SidePanel() {
  const category = useQueryStore((state) => state.category);
  const value = useQueryStore((state) => state.value);

  const Panel = category ? RESULT_PANELS[category] : undefined;

  return (
    // The controls row stays even without a panel: it keeps the layout and
    // will also hold the "my location" button in a later feature.
    <div className={s.controls}>
      {Panel && (
        <section className={s.panel} aria-label="Search result">
          {/* A different "key" makes React build a fresh panel, so moving
              from one building to another starts back at page 1 instead
              of keeping the old building's page. */}
          <Panel key={`${category}:${value}`} value={value} />
        </section>
      )}
    </div>
  );
}
