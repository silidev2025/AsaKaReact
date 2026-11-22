// Puts the app together and picks the page to show from the web address.
//
// There are only two pages, so a plain check of the address is enough; a
// routing library can come later if more pages are added.

import { ROUTES } from "./config/routes";
import CampusMap from "./features/campus-map/CampusMap";
import ChangelogPage from "./features/changelog/ChangelogPage";
import Home from "./features/home/Home";
import InstallPrompt from "./features/pwa/InstallPrompt";
import UpdatePrompt from "./features/pwa/UpdatePrompt";
import s from "./App.module.css";

const isChangelogPage = window.location.pathname === ROUTES.changelog;

export default function App() {
  return (
    <>
      {isChangelogPage ? (
        <ChangelogPage />
      ) : (
        <div className={s.appLayout}>
          <CampusMap />
          <Home />
        </div>
      )}

      {/* These two appear on every page. */}
      <UpdatePrompt />
      <InstallPrompt />
    </>
  );
}
