import LeewayUI from "./core";

// Import vue components
import * as components from "@/lib-components/index";
import { Options } from "./utils/config";

const install = LeewayUI.install;
LeewayUI.install = (app, options: Options) =>
  install.call(LeewayUI, app, { components, ...options });

export default LeewayUI;

// install function executed by Vue.use()
// const install: Exclude<Plugin['install'], undefined> = function installLeewayUi(app: App) {
//   Object.entries(components).forEach(([componentName, component]) => {
//     app.component(componentName, component);
//   });
// };

// // Create module definition for Vue.use()
// export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from "@/lib-components/index";
