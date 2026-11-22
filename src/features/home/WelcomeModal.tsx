// The welcome window: a banner with the app's name, what the app does, who
// made it, and a "Get Started" button. Ticking "Don't show again" keeps it
// from opening on later visits (it can still be opened from the status bar).
//
// Where its text comes from:
//   app name and description ... .env
//   tagline, banner photo ...... src/data/app-info.json
//   developers ................. src/data/developers.json

import { useState, type CSSProperties, type SyntheticEvent } from "react";
import { APP } from "../../config/app";
import { STORAGE_KEYS } from "../../config/storageKeys";
import appInfo from "../../data/app-info.json";
import developers from "../../data/developers.json";
import { writeStorage } from "../../lib/storage";
import { useModalStore } from "../../store/modalStore";
import s from "./WelcomeModal.module.css";

/**
 * Swaps a broken developer photo for the default profile picture.
 * (Not named "use..." on purpose: that prefix is only for hooks.)
 */
function showDefaultPhoto(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (!image.src.endsWith(appInfo.defaultProfilePhoto)) {
    image.src = appInfo.defaultProfilePhoto;
  }
}

export default function WelcomeModal() {
  const closeModal = useModalStore((state) => state.closeModal);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  function handleGetStarted() {
    if (dontShowAgain) writeStorage(STORAGE_KEYS.hideWelcome, "true");
    closeModal();
  }

  // The banner photo is passed to the CSS as a variable.
  const bannerStyle = {
    "--banner-image": `url("${appInfo.heroImage}")`,
  } as CSSProperties;

  return (
    <div className={s.welcome}>
      <div className={s.banner} style={bannerStyle}>
        <div className={s.bannerOverlay}>
          <h2>{APP.name}</h2>
          <p>{appInfo.tagline}</p>
        </div>
      </div>

      <div className={s.body}>
        <p className={s.description}>{APP.description}</p>

        <section className={s.developers}>
          <h3>Developer</h3>
          <div className={s.developerList}>
            {developers.map((developer) => (
              <a
                key={developer.name}
                className={s.developer}
                href={developer.profileUrl}
                target="_blank"
                rel="noreferrer"
                data-tooltip={developer.name}
              >
                <img
                  src={developer.photo}
                  alt={developer.name}
                  title={developer.name}
                  onError={showDefaultPhoto}
                />
                <span className={s.developerName}>{developer.name}</span>
              </a>
            ))}
          </div>
        </section>

        <div className={s.actions}>
          <button type="button" className={s.primaryButton} onClick={handleGetStarted}>
            Get Started
          </button>
          {/* A "controlled" checkbox: React state holds whether it's ticked. */}
          <label className={s.checkbox}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
            />
            Don't show again
          </label>
        </div>
      </div>
    </div>
  );
}
