<template>
  <component
    class="le-button"
    :is="route ? 'a' : 'button'"
    :type="!route && type"
    :href="(route && (externalLink ? route : resolvedRoute)) || null"
    :class="classes"
    :disabled="!!disabled || null"
    v-on="listeners"
    :style="styles"
  >
    <le-icon v-if="icon">{{ icon }}</le-icon>
    <slot v-else></slot>
    <transition name="scale-fade" class="le-button__loader" v-if="loading">
      <slot name="loading">
        <svg viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="transparent"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </slot>
    </transition>
  </component>
</template>

<script lang='ts'>
import { computed, defineComponent, getCurrentInstance, PropType } from "vue";

export interface ILeButtonProps {
  color?: string;
  bgColor?: string;
  dark?: boolean;
  outline?: boolean;
  text?: boolean;
  round?: boolean;
  shadow?: boolean;
  tile?: boolean;
  route?: string | Object;
  forceLink?: boolean;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string | null;
  absolute?: boolean;
  fixed?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  zIndex?: number | string;
  width?: number | string;
  height?: number | string;
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
}

export default defineComponent({
  name: "le-button",

  props: {
    color: { type: String },
    bgColor: { type: String },
    dark: { type: Boolean },
    outline: { type: Boolean },
    text: { type: Boolean },
    round: { type: Boolean },
    shadow: { type: Boolean },
    tile: { type: Boolean },
    route: { type: [String, Object] as PropType<Object> }, // Creates a link.
    // Force use of `a` instead of router-link.
    // Router link does not go to a url starting with `#` with history mode.
    forceLink: { type: Boolean },
    type: { type: String, default: "button" },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    // If an icon is passed, no text will display.
    icon: { type: String, default: null },
    // Positions.
    absolute: { type: Boolean },
    fixed: { type: Boolean },
    top: { type: Boolean },
    bottom: { type: Boolean },
    left: { type: Boolean },
    right: { type: Boolean },
    zIndex: { type: [Number, String] },
    // Sizes.
    width: { type: [Number, String] },
    height: { type: [Number, String] },
    xs: { type: Boolean },
    sm: { type: Boolean },
    md: { type: Boolean },
    lg: { type: Boolean },
    xl: { type: Boolean },
  },

  setup(props: ILeButtonProps, ctx) {
    const instance = getCurrentInstance();
    const attrs = ctx.attrs;
    const router = instance?.appContext.config.globalProperties.$router;
    const hasRouter = computed(() => !!router);
    const resolvedRoute = computed(() => {
      return hasRouter ? router.resolve(props.route).href : props.route;
    });
    const listeners = computed(() => {
      return props.route && hasRouter && !props.forceLink && !externalLink
        ? {
            ...attrs,
            click: (e: Event) => {
              if (attrs.click) {
                const click = attrs.click as EventListener;
                click(e);
              }
              router.push(props.route);
              e.stopPropagation();
              e.preventDefault();
            },
          }
        : attrs;
    });
    const size = computed(() => {
      return (
        (props.xs && "xs") ||
        (props.sm && "sm") ||
        (props.lg && "lg") ||
        (props.xl && "xl") ||
        "md"
      );
    });
    const position = computed(() => {
      return [
        (props.top && "top") || (props.bottom && "bottom") || "top",
        (props.left && "left") || (props.right && "right") || "right",
      ];
    });
    const externalLink = computed(() => {
      if (typeof props.route === "string")
        return /^(https?:)?\/\//.test(props.route);
    });
    const classes = computed(() => {
      return {
        "primary--bg":
          !props.bgColor &&
          !props.color &&
          !props.dark &&
          !(props.outline || props.text),
        primary:
          !props.bgColor &&
          !props.color &&
          !props.dark &&
          (props.outline || props.text),
        [`${props.color}`]: !!props.color,
        [`${props.bgColor}--bg`]: !!props.bgColor,
        "le-button--dark": props.dark && !props.outline,
        "le-button--outline": !!props.outline,
        "le-button--text": !!props.text,
        "le-button--round": !!props.round,
        "le-button--tile": !!props.tile,
        "le-button--shadow": !!props.shadow,
        "le-button--loading": !!props.loading,
        "le-button--icon": !!props.icon,
        [`size--${size.value}`]: true,
        "le-button--absolute": !!props.absolute,
        "le-button--fixed": !!props.fixed,
        [`le-button--${position.value.join(" le-button--")}`]:
          props.absolute || props.fixed,
      } as { [K: string]: boolean };
    });
    const styles = computed(() => {
      return {
        width:
          (typeof props.width === "number" && !isNaN(props.width)
            ? `${props.width}px`
            : props.width) || null,
        height:
          (typeof props.height === "number" && !isNaN(props.height)
            ? `${props.height}px`
            : props.height) || null,
        zIndex: props.zIndex || props.zIndex === 0 || null,
      };
    });

    return {
      hasRouter,
      resolvedRoute,
      listeners,
      size,
      position,
      externalLink,
      classes,
      styles,
    };
  },

  emits: [],
});
</script>

<style lang="scss">
$spinner-size: 40;

.le-button {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  outline: none;
  border-radius: $border-radius;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding-left: 2 * $base-increment;
  padding-right: 2 * $base-increment;
  box-shadow: 0 0 0 transparent;
  vertical-align: middle;
  align-self: center;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;
  color: inherit; // Override the default color in Safari.
  font-family: inherit;
  z-index: 1;
  // Background-color must not transition to not affect the hover & focus states
  // in :before & :after.
  transition: $transition-duration, background-color 0s, padding 0s;

  // In le-flex wrapper, allow overriding the default `align-self: center`.
  .le-flex.align-start > & {
    align-self: flex-start;
  }
  .le-flex.align-end > & {
    align-self: flex-end;
  }

  // Position.
  &--absolute {
    position: absolute;
  }
  &--fixed {
    position: fixed;
  }
  &--top {
    top: 2 * $base-increment;
  }
  &--bottom {
    bottom: 2 * $base-increment;
  }
  &--left {
    left: 2 * $base-increment;
  }
  &--right {
    right: 2 * $base-increment;
  }

  &--dark {
    color: rgba(255, 255, 255, 0.95);
    background-color: rgba(255, 255, 255, 0.15);
  }
  &--outline {
    background-color: transparent;
    border-color: currentColor;
  }
  &--text {
    background-color: transparent;
    border-color: transparent;
  }
  &--round {
    border-radius: 9em;
    padding-left: 3 * $base-increment;
    padding-right: 3 * $base-increment;
  }
  &--icon {
    border-radius: 9em;
    padding: 0;
  }
  &--tile {
    border-radius: initial;
  }
  &--shadow {
    box-shadow: $box-shadow;
  }
  &--loading {
    cursor: wait;
    opacity: 0.8;
  }
  &[disabled] {
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.4;
    -webkit-tap-highlight-color: transparent;
  }
  &--dark[disabled] {
    background-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.3);
  }

  // Sizes adjustments (always an even number for easier vertical alignments).
  &.size--xs {
    height: round(1.25 * $base-font-size / 2) * 2;
  }
  &.size--sm {
    height: round(1.55 * $base-font-size / 2) * 2;
  }
  &.size--md {
    height: round(1.85 * $base-font-size / 2) * 2;
  }
  &.size--lg {
    height: round(2.2 * $base-font-size / 2) * 2;
  }
  &.size--xl {
    height: round(2.5 * $base-font-size / 2) * 2;
  }

  &.size--xs {
    padding-left: $base-increment;
    padding-right: $base-increment;
  }
  &.size--xl {
    padding-left: 3 * $base-increment;
    padding-right: 3 * $base-increment;
  }
  &--round.size--xs {
    padding-left: round(1.5 * $base-increment);
    padding-right: round(1.5 * $base-increment);
  }
  &--round.size--xl {
    padding-left: round(4.5 * $base-increment);
    padding-right: round(4.5 * $base-increment);
  }
  &--icon.size--xs {
    width: round(1.25 * $base-font-size / 2) * 2;
  }
  &--icon.size--sm {
    width: round(1.55 * $base-font-size / 2) * 2;
  }
  &--icon.size--md {
    width: round(1.85 * $base-font-size / 2) * 2;
  }
  &--icon.size--lg {
    width: round(2.2 * $base-font-size / 2) * 2;
  }
  &--icon.size--xl {
    width: round(2.5 * $base-font-size / 2) * 2;
  }

  // Overlay to mark the focus, hover and active state.
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background-color: #000;
    border-radius: inherit;
    @include default-transition;
  }

  &--dark:before,
  &.primary--bg:before,
  &.success--bg:before,
  &.error--bg:before,
  &.warning--bg:before,
  &.info--bg:before {
    background-color: #fff;
  }
  &--outline:before,
  &--text:before {
    background-color: currentColor;
  }

  // Button states.
  // ------------------------------------------------------
  // Hover & focus states - inside button.
  &:hover:before,
  &:focus:before {
    opacity: 0.08;
  }
  &--dark:hover:before,
  &--dark:focus:before {
    opacity: 0.2;
  }
  &--outline:hover:before,
  &--outline:focus:before,
  &--text:hover:before,
  &--text:focus:before {
    opacity: 0.12;
  }

  // Focus state - outside button.
  &:after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background-color: inherit;
    opacity: 0;
    border-radius: inherit;
    z-index: -1;
    transition: opacity 0.2s cubic-bezier(0.45, 0.05, 0.55, 0.95),
      transform 0.25s ease-in;
    transform: scale(0.85, 0.7);
  }
  &:focus:after {
    opacity: 0.4;
    transform: scale(1);
    transition: opacity 0.2s cubic-bezier(0.45, 0.05, 0.55, 0.95),
      transform 0.25s ease-out;
  }
  &--dark:focus:after {
    opacity: 0.2;
  }

  // Active state.
  &:active:before {
    opacity: 0.2;
  }
  &--dark:active:before,
  &.primary--bg:active:before {
    opacity: 0.25;
  }

  // Disable visual feedback on loading and disabled buttons.
  &--loading:hover:before,
  &--loading:focus:before,
  &--loading:active:before,
  &[disabled]:before {
    opacity: 0;
  }
  // ------------------------------------------------------

  // Disable events binding on nested content.
  & * {
    pointer-events: none;
  }

  &__loader {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: inherit;

    svg {
      height: 75%;
    }
    circle {
      stroke-dasharray: (3.14 * $spinner-size);
      transform-origin: 50%;
      animation: spinner 2s linear infinite;
    }
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: (0.66 * $spinner-size);
  }
  50% {
    transform: rotate(720deg);
    stroke-dashoffset: (3.14 * $spinner-size);
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: (0.66 * $spinner-size);
  }
}
</style>