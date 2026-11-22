// A list of rooms, a page at a time, with Previous and Next buttons when
// there are more rooms than fit on one page (SEARCH_CONFIG.roomsPerPage).
// Tapping a room picks it as the new search result.

import { useState } from "react";
import { SEARCH_CONFIG } from "../../config/search";
import type { CampusRoom } from "../../lib/campus";
import { useQueryStore } from "../../store/queryStore";
import RoomRow from "./RoomRow";
import s from "./RoomList.module.css";

type RoomListProps = {
  title: string;
  rooms: CampusRoom[];
  /** Shown instead of the list when there are no rooms. */
  emptyText: string;
};

export default function RoomList({ title, rooms, emptyText }: RoomListProps) {
  const selectResult = useQueryStore((state) => state.selectResult);

  // Which page is showing, counting from 0 (so page 0 is shown as "1").
  const [pageIndex, setPageIndex] = useState(0);

  // Worked out from the rooms and the page on every render.
  const { roomsPerPage } = SEARCH_CONFIG;
  const pageCount = Math.max(1, Math.ceil(rooms.length / roomsPerPage));
  const firstRoom = pageIndex * roomsPerPage;
  const roomsOnPage = rooms.slice(firstRoom, firstRoom + roomsPerPage);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pageCount - 1;

  return (
    <>
      <div className={s.section}>
        <h3 className={s.subtitle}>{title}</h3>
        <div className={s.list}>
          {roomsOnPage.map((room) => (
            <RoomRow
              key={room.code}
              roomCode={room.code}
              onSelect={() => selectResult({ category: "room", value: room.code })}
            />
          ))}
          {rooms.length === 0 && <p className={s.empty}>{emptyText}</p>}
        </div>
      </div>

      {pageCount > 1 && (
        <nav className={s.pagination} aria-label="Room pages">
          <button
            type="button"
            className={s.pageButton}
            disabled={isFirstPage}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Previous
          </button>
          <span className={s.pageInfo}>
            {pageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            className={s.pageButton}
            disabled={isLastPage}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
