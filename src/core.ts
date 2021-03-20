import { App, reactive } from "vue";
import config, { mergeConfig, Options } from "./utils/config";
import { colors, Color } from "./utils/colors";
// import * as directives from './directives'

const shadeColor = (col: string, amt: number) => {
  return (
    "#" +
    col
      .slice(1)
      .match(/../g)
      ?.map((x: string) =>
        ((x += `0x${x}` + amt), +x < 0 ? 0 : +x > 255 ? 255 : x)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
};

export default class LeewardUI {
  static instance: null | LeewardUI = null;
  static vueInstance: null | App = null; // Needed until constructor.
  static registered = false;
  static version = "1.0.0";

  // Public breakpoint object. Accessible from this.$waveui.breakpoint.
  breakpoint = {
    name: "",
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  };

  // A public object containing pairs of color-name => color hex.
  // Accessible from anywhere via `this.$lewayui.colors`.
  // These colors generate the CSS in `le-app` on mounted.
  colorsMap: { [K: string]: string } = colors.reduce<Record<string, string>>(
    (obj: Record<string, string>, color: Color) => {
      obj[color.label] = color.color;
      color.shades.forEach((shade) => (obj[shade.label] = shade.color));
      return obj;
    },
    {
      ...config.colors,
      black: "#000",
      white: "#fff",
      transparent: "transparent",
      inherit: "inherit",
    }
  );

  static install(app: App, options: Options) {
    // Register directives.
    // for (const id in directives) {
    //   if (directives[id]) app.directive(id, directives[id])
    // }
    app.directive("focus", {
      // When the bound element is inserted into the DOM...
      mounted: (el) => el.focus(),
    });

    // Register a-la-carte components from the given list.
    const { components } = options || {};
    for (let id in components) {
      const component = components[id];
      if (component.name) {
        app.component(component.name, component);
      }
    }

    // Register mixins.
    // app.mixin({
    //   mounted () {
    //   }
    // })

    LeewardUI.registered = true;
  }

  // Singleton.
  constructor(app: App, options: Options) {
    if (LeewardUI.instance) return LeewardUI.instance;
    else {
      if (!LeewardUI.registered) app.use(LeewardUI);

      // Merge user options into default config.
      mergeConfig(options);

      // Add color shades for each custom color given in options.
      if (!options.disableColorShades) {
        config.colorShades = {};

        for (let color in config.colors) {
          const newColor = {
            label: color,
            color: config.colors[color].replace("#", ""),
          };
          const col = newColor.color;
          if (col.length === 3)
            newColor.color =
              col[0] + "" + col[0] + col[1] + col[1] + col[2] + col[2];

          this.colorsMap[newColor.label] = `#${newColor.color}`;

          for (let i = 1; i <= 3; i++) {
            const lighterColor = shadeColor(`#${newColor.color}`, i * 40);
            const darkerColor = shadeColor(`#${newColor.color}`, -i * 40);
            this.colorsMap[`${newColor.label}-light${i}`] = lighterColor;
            this.colorsMap[`${newColor.label}-dark${i}`] = darkerColor;

            // Adding the shades to the config object to generate the CSS from le-app.
            config.colorShades[`${newColor.label}-light${i}`] = lighterColor;
            config.colorShades[`${newColor.label}-dark${i}`] = darkerColor;
          }
        }
      }

      LeewardUI.instance = this;
      // Make waveui reactive and expose the single instance in Vue.
      app.config.globalProperties.$leewardui = reactive(this);
    }
  }
}

LeewardUI.version = "__VERSION__";
