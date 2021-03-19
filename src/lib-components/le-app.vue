<template lang="pug">
.le-app(:class="{ 'theme--dark': dark, 'd-block': block }")
  slot
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
} from "@vue/runtime-core";
import config from "../utils/config";
import { onMounted } from "vue";

const breakpointsNames = Object.keys(config.breakpoints);
const breakpointsValues = Object.values(config.breakpoints);
const gridSystem = 12;

export default defineComponent({
  name: "le-app",
  props: {
    dark: { type: Boolean },
    block: { type: Boolean },
  },
  setup() {
    let currentBreakpoint: string | null = null;
    const leewayui = getCurrentInstance()?.appContext.config.globalProperties
      .$leewayui;
    const getBreakpoint = () => {
      const width = window.innerWidth;
      const breakpoints = breakpointsValues.slice(0);
      // Most performant lookup.
      breakpoints.push(width);
      breakpoints.sort((a, b) => a - b);
      const breakpoint = breakpointsNames[breakpoints.indexOf(width)] || "xl";

      if (breakpoint !== currentBreakpoint) {
        currentBreakpoint = breakpoint;
        leewayui.breakpoint = {
          name: breakpoint,
          xs: breakpoint === "xs",
          sm: breakpoint === "sm",
          md: breakpoint === "md",
          lg: breakpoint === "lg",
          xl: breakpoint === "xl",
          width,
        };
      }

      leewayui.breakpoint.width = width;
    };

    const dynamicStyles = () => {
      let styles = "";
      const { info, warning, success, error, ...colors } = config.colors;
      for (const color in colors) {
        styles +=
          `.le-app .${color}--bg{background-color:${config.colors[color]}}` +
          `.le-app .${color}{color:${config.colors[color]}}`;
      }
      if (config.colorShades) {
        Object.entries(config.colorShades).forEach(([label, color]) => {
          styles +=
            `.le-app .${label}--bg{background-color:${color}}` +
            `.le-app .${label}{color:${color}}`;
        });
      }

      const statusColors = { info, warning, success, error };

      for (const color in statusColors) {
        styles +=
          `.le-app .${color}--bg{background-color:${config.colors[color]}}` +
          `.le-app .${color}{color:${config.colors[color]}}`;
      }

      const cssVariables = [];
      cssVariables.push(`--primary: ${config.colors.primary}`);
      styles += `:root {${cssVariables.join(";")}}`;

      const entries = Object.entries(config.breakpoints);
      entries.forEach(([label], i) => {
        if (entries[i - 1]) {
          styles += `@media (min-width: ${
            (entries[i - 1] && entries[i - 1][1]) || 0
          }px){`;
          for (let i = 0; i < gridSystem; i++) {
            styles += `.le-app .${label}${gridSystem - i}{width:${parseFloat(
              (((gridSystem - i) * 100) / gridSystem).toFixed(4)
            )}%;}`;
          }
          styles += "}";
        }
      });

      return styles;
    };

    onMounted(() => {
      if (!document.getElementById("leeway-ui-styles")) {
        const css = document.createElement("style");
        css.id = "leeway-ui-styles";
        css.innerHTML = dynamicStyles();

        document.head.appendChild(css);
      }

      getBreakpoint();
      window.addEventListener("resize", getBreakpoint);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", getBreakpoint);
    });

    return { currentBreakpoint, getBreakpoint, dynamicStyles };
  },
});
</script>

<style lang="scss">
@import "@/scss/index";

.le-app {
  position: relative; // Make the .le-app a referential for tooltips / menus.
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &.d-block {
    display: block;
  }
}
</style>