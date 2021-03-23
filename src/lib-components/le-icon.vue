<template lang="pug">
component.le-icon(
  :is="tag || 'i'",
  :class="classes",
  v-on="$attrs",
  role="icon",
  aria-hidden="true",
  :style="styles"
)
  template(v-if="ligature") {{ ligature.icon }}
</template>

<script lang="ts">
import config from "../utils/config";
import { computed, defineComponent, onBeforeUpdate, onMounted, ref } from "vue";

export default defineComponent({
  name: "le-icon",

  props: {
    tag: { type: String, default: "i" },
    color: { type: String },
    bgColor: { type: String },
    xs: { type: Boolean },
    sm: { type: Boolean },
    md: { type: Boolean },
    lg: { type: Boolean },
    xl: { type: Boolean },
    spin: { type: Boolean },
    rotate135a: { type: Boolean },
    rotate90a: { type: Boolean },
    rotate45a: { type: Boolean },
    rotate45: { type: Boolean },
    rotate90: { type: Boolean },
    rotate135: { type: Boolean },
    rotate180: { type: Boolean },
    flipX: { type: Boolean },
    flipY: { type: Boolean },
    size: { type: [Number, String] },
  },

  emits: [],

  setup(props, ctx) {
    const icon = ref("");
    const ligature = computed(() => {
      if (!config.iconsLigature) return false;

      const [fontName, fontIcon] = icon.value.split(" ");
      return fontName === config.iconsLigature && { fontName, fontIcon };
    });
    const forcedSize = computed(() => {
      return (
        props.size &&
        (typeof props.size === "number" && !isNaN(props.size)
          ? `${props.size}px`
          : props.size)
      );
    });
    const presetSize = computed(() => {
      return (
        (props.xs && "xs") ||
        (props.sm && "sm") ||
        (props.md && "md") ||
        (props.lg && "lg") ||
        (props.xl && "xl") ||
        null
      );
    });
    const classes = computed(() => {
      return {
        [icon.value]: true,
        [`${props.color}`]: true,
        [`${props.bgColor}--bg`]: props.bgColor,
        [`size--${presetSize.value}`]: presetSize.value && !forcedSize,
        "le-icon--spin": props.spin,
        "le-icon--rotate45": props.rotate45,
        "le-icon--rotate90": props.rotate90,
        "le-icon--rotate135": props.rotate135,
        "le-icon--rotate180": props.rotate180,
        "le-icon--rotate-45": props.rotate45a,
        "le-icon--rotate-90": props.rotate90a,
        "le-icon--rotate-135": props.rotate135a,
        "le-icon--flip-x": props.flipX,
        "le-icon--flip-y": props.flipY,
        [`${ligature.value && ligature.value.fontName}`]: ligature.value,
      };
    });
    const styles = computed(() => {
      return forcedSize.value && `font-size: ${forcedSize.value}`;
    });

    onMounted(() => {
      const { default: slotContent } = ctx.slots;
      const children = slotContent ? slotContent()[0].children : "";
      icon.value = typeof children === "string" ? children.trim() : "";
    });

    onBeforeUpdate(() => {
      const { default: slotContent } = ctx.slots;
      const children = slotContent ? slotContent()[0].children : "";
      icon.value = typeof children === "string" ? children.trim() : "";
    });

    return {
      classes,
      styles,
      ligature,
    };
  },
});
</script>

<style lang="scss">
.le-icon {
  position: relative;
  display: inline-flex;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  user-select: none;
  line-height: 1;
  font-size: 1.2em;
  width: 1em;
  height: 1em;

  &.size--xs {
    font-size: round(0.85 * $base-font-size);
  }
  &.size--sm {
    font-size: round(1.15 * $base-font-size);
  }
  &.size--md {
    font-size: round(1.4 * $base-font-size);
  }
  &.size--lg {
    font-size: round(1.7 * $base-font-size);
  }
  &.size--xl {
    font-size: 2 * $base-font-size;
  }

  // In w-button and w-alert.
  // .w-button &, .w-alert & {font-size: round(1.4 * $base-font-size);}
  // Always an even number to vertical align well in button.
  .le-button.size--xs & {
    font-size: round(0.95 * $base-font-size / 2) * 2;
  }
  .le-alert.size--xs & {
    font-size: $base-font-size;
  }
  .le-button.size--sm &,
  .le-alert.size--sm & {
    font-size: round(1.15 * $base-font-size);
  }
  // .w-button.size--md &, .w-alert.size--md & {font-size: round(1.4 * $base-font-size);}
  .le-button.size--lg &,
  .le-alert.size--lg & {
    font-size: round(1.7 * $base-font-size);
  }
  .le-button.size--xl &,
  .le-alert.size--xl & {
    font-size: 2 * $base-font-size;
  }

  &--spin:before {
    animation: le-icon--spin 2s infinite linear;
  }
  &--rotate45:before {
    transform: rotate(45deg);
  }
  &--rotate90:before {
    transform: rotate(90deg);
  }
  &--rotate135:before {
    transform: rotate(135deg);
  }
  &--rotate180:before {
    transform: rotate(180deg);
  }
  &--rotate-45:before {
    transform: rotate(-45deg);
  }
  &--rotate-90:before {
    transform: rotate(-90deg);
  }
  &--rotate-135:before {
    transform: rotate(-135deg);
  }
  &--flip-x:before {
    transform: scaleX(-1);
  }
  &--flip-y:before {
    transform: scaleY(-1);
  }
}

@keyframes le-icon--spin {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>