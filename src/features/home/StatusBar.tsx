// The status bar at the bottom of the home screen:
//   - how many rooms have written directions, as a progress bar
//   - when the room data was last updated
//   - Contact, Developer (opens the welcome window) and the app version,
//     which links to the changelog
//
// On phones it folds into a small "Status" pill that opens when tapped.

import { useState } from "react";
import { ChevronDown, ChevronRight, GitFork, MessageCircle } from "lucide-react";
import { APP } from "../../config/app";
import { ROUTES } from "../../config/routes";
import appInfo from "../../data/app-info.json";
import { ROOM_STATS } from "../../lib/catalog";
import { cx } from "../../lib/cx";
import { useModalStore } from "../../store/modalStore";
import s from "./StatusBar.module.css";

const directionsPercent = Math.floor(
  (ROOM_STATS.withDirections / ROOM_STATS.total) * 100,
);

export default function StatusBar() {
  const openModal = useModalStore((state) => state.openModal);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cx(s.statusBar, isOpen && s.isOpen)}>
      {/* Only visible on phones (see the CSS). */}
      <button
        type="button"
        className={s.toggle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span>Status</span>
      </button>

      <div className={s.content}>
        <div className={s.progress}>
          Rooms with directions
          <div
            className={s.progressTrack}
            role="progressbar"
            aria-valuenow={directionsPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={s.progressValue}
              style={{ width: `${directionsPercent}%` }}
            />
          </div>
          <div>
            {ROOM_STATS.withDirections} / {ROOM_STATS.total}
          </div>
        </div>

        {/* Each item gets a thin line after it (see .item in the CSS). */}
        <div className={s.links}>
          <div className={cx(s.item, s.dataUpdated)}>
            Course and room information is updated regularly. Last updated:{" "}
            <strong>{appInfo.dataLastUpdated}.</strong>
          </div>
          <div className={s.item}>
            <a
              href={appInfo.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              <MessageCircle size={18} />
              <span>Contact</span>
            </a>
          </div>
          <div className={s.item}>
            <button
              type="button"
              className={s.link}
              onClick={() => openModal("welcome")}
            >
              Developer
            </button>
          </div>
          <div className={s.item}>
            <a href={ROUTES.changelog} className={s.link}>
              <GitFork size={18} />
              <span>{APP.versionLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
