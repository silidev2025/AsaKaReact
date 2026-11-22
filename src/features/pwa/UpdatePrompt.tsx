// A small card in the bottom-right corner that says either:
//   "App ready to work offline"   (the first time everything is saved), or
//   "New content available..."    (a newer version was published), with a
//                                  Reload button to switch to it.
//
// useRegisterSW comes from vite-plugin-pwa. It registers the service worker
// (the background script that makes offline mode work) and tells us when
// either of those two things happens.

import { useRegisterSW } from "virtual:pwa-register/react";
import s from "./UpdatePrompt.module.css";

export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  if (!offlineReady && !needRefresh) return null;

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <div className={s.updatePrompt} role="alert">
      <div className={s.message}>
        {needRefresh
          ? "New content available, click on reload button to update"
          : "App ready to work offline"}
      </div>
      <div className={s.buttons}>
        {needRefresh && (
          <button
            type="button"
            className={s.primary}
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </button>
        )}
        <button
          type="button"
          className={needRefresh ? s.plain : s.primary}
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  );
}
