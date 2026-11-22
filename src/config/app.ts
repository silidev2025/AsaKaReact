// Basic facts about the app, gathered from the files that already hold them:
// the name and description from .env, the version from package.json.

import { version } from "../../package.json";

export const APP = {
  name: import.meta.env.VITE_APP_NAME,
  description: import.meta.env.VITE_APP_DESCRIPTION,
  version,
  /** The version as shown to users, like "v1.4.0". */
  versionLabel: `v${version}`,
};
