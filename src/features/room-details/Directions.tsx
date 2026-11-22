// A paragraph of directions. When nobody has written them yet, it asks the
// user to contribute them instead, with a link to the Contribute form
// (contributeUrl in src/data/app-info.json).
//
// Used twice in the room panel: for the room, and for its building.

import { APP } from "../../config/app";
import appInfo from "../../data/app-info.json";
import { cx } from "../../lib/cx";
import s from "./RoomDetails.module.css";

type DirectionsProps = {
  /** The directions, or undefined if there are none yet. */
  text: string | undefined;
};

export default function Directions({ text }: DirectionsProps) {
  if (text) {
    return <p className={s.directions}>{text}</p>;
  }

  return (
    <p className={cx(s.directions, s.noDirections)}>
      No directions?{" "}
      {/* target="_blank" opens a new tab. rel="noreferrer" stops that tab
          from seeing or controlling this page, which is safer. */}
      <a href={appInfo.contributeUrl} target="_blank" rel="noreferrer">
        <strong>Contribute to {APP.name}</strong>
      </a>
    </p>
  );
}
