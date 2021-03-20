<template lang="pug">
component.le-flex-wrap(v-if="gap", :is="tag")
  .le-flex(:class="classes")
    slot
component.le-flex(v-else, :class="classes", :is="tag")
  slot
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

interface IFlexProps {
  tag?: String;
  column?: boolean;
  grow?: boolean;
  noGrow?: boolean;
  shrink?: boolean;
  noShrink?: boolean;
  fillHeight?: boolean;
  wrap?: boolean;
  alignStart?: boolean;
  alignCenter?: boolean;
  alignEnd?: boolean;
  justifyStart?: boolean;
  justifyCenter?: boolean;
  justifyEnd?: boolean;
  justifySpaceBetween?: boolean;
  justifySpaceAround?: boolean;
  basisZero?: boolean;
  gap?: number;
}

export default defineComponent({
  name: "le-flex",
  props: {
    tag: { type: String, default: "div" },
    column: { type: Boolean },
    grow: { type: Boolean },
    noGrow: { type: Boolean },
    shrink: { type: Boolean },
    noShrink: { type: Boolean },
    fillHeight: { type: Boolean },
    wrap: { type: Boolean },
    alignStart: { type: Boolean },
    alignCenter: { type: Boolean },
    alignEnd: { type: Boolean },
    justifyStart: { type: Boolean },
    justifyCenter: { type: Boolean },
    justifyEnd: { type: Boolean },
    justifySpaceBetween: { type: Boolean },
    justifySpaceAround: { type: Boolean },
    basisZero: { type: Boolean },
    gap: { type: Number, default: 0 },
  },
  setup(props: IFlexProps) {
    const classes = computed(() => {
      return {
        column: props.column,
        grow: props.grow,
        "no-grow": props.noGrow,
        "fill-height": props.fillHeight,
        wrap: props.wrap,
        "align-start": props.alignStart,
        "align-center": props.alignCenter,
        "align-end": props.alignEnd,
        "justify-start": props.justifyStart,
        "justify-center": props.justifyCenter,
        "justify-end": props.justifyEnd,
        "justify-space-between": props.justifySpaceBetween,
        "justify-space-around": props.justifySpaceAround,
        "basis-zero": props.basisZero,
        [`le-flex--gap${props.gap}`]: props.gap,
      };
    });
    return {
      classes,
    };
  },
});
</script>

<style lang="scss">
.le-flex {
  display: flex;
  flex: 1 1 auto;
  &.row {
    flex-direction: row;
  }
  &.column {
    flex-direction: column;
  }
  &.wrap {
    flex-wrap: wrap;
  }
  &.basis-zero > * {
    flex-basis: 0;
    flex-grow: 1;
  }
  @for $i from 1 through 12 {
    // Divide by 2 as there are 2 elements having this space.
    $space: round($base-increment * $i / 2);
    &--gap#{$i} {
      margin: -$space;
    }
    &--gap#{$i} > * {
      margin: $space;
    }
  }
}
</style>