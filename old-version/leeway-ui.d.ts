import { DefineComponent, Plugin } from "vue";

declare const LeewardUi: Exclude<Plugin["install"], undefined>;
export default LeewardUi;

export const LeewardUiSample: DefineComponent<{}, {}, any>;
