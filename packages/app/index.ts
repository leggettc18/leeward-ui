import { App } from "vue";
import type { SFCWithInstall } from "@leeward-ui/utils/types";
import LeApp from "./src/app.vue";

LeApp.install = (app: App): void => {
  app.component(LeApp.name, LeApp);
};

const _LeApp: SFCWithInstall<typeof LeApp> = LeApp;

export default _LeApp;
