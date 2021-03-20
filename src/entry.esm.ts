import LeewardUI from "./core";

// Import vue components
import * as components from "@/lib-components/index";
import { Options } from "./utils/config";

const install = LeewardUI.install;
LeewardUI.install = (app, options: Options) =>
  install.call(LeewardUI, app, { components, ...options });

export default LeewardUI;

// install function executed by Vue.use()
// const install: Exclude<Plugin['install'], undefined> = function installLeewardUi(app: App) {
//   Object.entries(components).forEach(([componentName, component]) => {
//     app.component(componentName, component);
//   });
// };

// // Create module definition for Vue.use()
// export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from "@/lib-components/index";
