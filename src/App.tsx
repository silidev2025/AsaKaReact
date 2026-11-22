// The app's main screen. Each feature is a component in src/features/, and
// App puts them together. More features are added here as they are built.

import CampusMap from "./features/campus-map/CampusMap";
import s from "./App.module.css";

export default function App() {
  return (
    <div className={s.appLayout}>
      <CampusMap />
    </div>
  );
}
