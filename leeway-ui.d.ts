import { DefineComponent, Plugin } from 'vue';


declare const LeewayUi: Exclude<Plugin['install'], undefined>;
export default LeewayUi;

export const LeewayUiSample: DefineComponent<{}, {}, any>;
