import { App } from "vue";
import type { SFCWithInstall } from "@leeward-ui/utils/types";
import Flex from "./src/flex.vue";

Flex.install = (app: App): void => {
  app.component(Flex.name, Flex);
};

const _Flex: SFCWithInstall<typeof Flex> = Flex;

export default _Flex;
