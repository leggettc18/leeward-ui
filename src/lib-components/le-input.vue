<template lang="pug">
component(
  ref="formEl",
  :is="formRegister ? 'le-form-element' : 'div'",
  v-bind="formRegister && { validators, inputValue, disabled, readonly, isFocused }",
  v-model:valid="valid",
  @reset="$emit('update:modelValue', (inputValue = '')); $emit('input', '')",
  :class="classes"
)
  input(
    v-if="type === 'hidden'",
    type="hidden",
    :name="name || null",
    v-model="inputValue"
  )
  template(v-else)
    //- Left label.
    template(v-if="labelPosition === 'left'")
      label.le-input__label.le-input__label--left.le-form-el-shakable(
        v-if="$slots.default",
        :for="`le-input--${_.uid}`"
      )
        slot
      label.le-input__label.le-input__label--left.le-form-el-shakable(
        v-else-if="label",
        :for="`le-input--${_.uid}`",
        v-html="label"
      )

    //- Input wrapper.
    .le-input__input-wrap(:class="inputWrapClasses")
      le-icon.le-input__icon.le-input__icon--inner-left(
        v-if="innerIconLeft",
        tag="label",
        :for="`le-input--${_.uid}`",
        @click="$emit('click:inner-icon-left', $event)"
      ) {{ innerIconLeft }}
      input.le-input__input(
        v-model="inputValue",
        v-on="listeners",
        @input="onInput",
        @focus="onFocus",
        @blur="onBlur",
        :id="`le-input--${_.uid}`",
        :type="type",
        :name="inputName",
        :placeholder="placeholder || null",
        :step="step || null",
        :min="min || null",
        :max="max || null",
        :minlength="minlength || null",
        :maxlength="maxlength || null",
        :readonly="readonly || null",
        :aria-readonly="readonly ? 'true' : 'false'",
        :disabled="disabled || null",
        :required="required || null",
        v-bind="attrs"
      )
      template(v-if="labelPosition === 'inside' && showLabelInside")
        label.le-input__label.le-input__label--inside.le-form-el-shakable(
          v-if="$slots.default",
          :for="`le-input--${_.uid}`",
          :class="isFocused && { [valid === false ? 'error' : color]: color || valid === false }"
        )
          slot
        label.le-input__label.le-input__label--inside.le-form-el-shakable(
          v-else-if="label",
          :for="`le-input--${_.uid}`",
          v-html="label",
          :class="isFocused && { [valid === false ? 'error' : color]: color || valid === false }"
        )
      le-icon.le-input__icon.le-input__icon--inner-right(
        v-if="innerIconRight",
        tag="label",
        :for="`le-input--${_.uid}`",
        @click="$emit('click:inner-icon-right', $event)"
      ) {{ innerIconRight }}

    //- Right label.
    template(v-if="labelPosition === 'right'")
      label.le-input__label.le-input__label--right.le-form-el-shakable(
        v-if="$slots.default",
        :for="`le-input--${_.uid}`"
      )
        slot
      label.le-input__label.le-input__label--right.le-form-el-shakable(
        v-else-if="label",
        :for="`le-input--${_.uid}`",
        v-html="label"
      )
</template>

<script lang="ts">
/**
 * @todo Share the common parts between le-input, le-textarea & le-select.
 **/

import { defineComponent } from "@vue/runtime-core";
import { computed, ref, watch } from "vue";
import FormElementMixin from "@/mixins/form-elements";

export default defineComponent({
  name: "le-input",
  mixins: [FormElementMixin],

  props: {
    modelValue: { default: "" },
    type: { type: String, default: "text" },
    label: { type: String },
    labelPosition: { type: String, default: "inside" },
    innerIconLeft: { type: String },
    innerIconRight: { type: String },
    // When label is inside, allows to move the label above on focus or when filled.
    staticLabel: { type: Boolean },
    placeholder: { type: String },
    color: { type: String, default: "primary" },
    bgColor: { type: String },
    minlength: { type: [Number, String] },
    maxlength: { type: [Number, String] },
    step: { type: [Number, String] },
    min: { type: [Number, String] },
    max: { type: [Number, String] },
    dark: { type: Boolean },
    outline: { type: Boolean },
    round: { type: Boolean },
    shadow: { type: Boolean },
    tile: { type: Boolean },
    // Also name, disabled, readonly, required and validators in the mixin.
  },

  emits: [
    "input",
    "update:modelValue",
    "focus",
    "blur",
    "click:inner-icon-left",
    "click:inner-icon-right",
  ],

  setup(props, ctx) {
    const inputValue = ref(props.modelValue);
    const inputNumberError = ref(false);
    const isFocused = ref(false);
    const formEl = ref<null | HTMLFormElement>(null);

    const listeners = computed(() => {
      const { input, focus, blur, ...listeners } = ctx.attrs;
      return listeners;
    });

    const attrs = computed(() => {
      const { class: Class, ...htmlAttrs } = ctx.attrs;
      return htmlAttrs;
    });

    const hasValue = computed(() => {
      return (
        inputValue.value ||
        ["date", "time"].includes(props.type) ||
        (props.type === "number" && inputNumberError.value)
      );
    });

    const hasLabel = computed(() => {
      return props.label || ctx.slots.default;
    });

    const showLabelInside = computed(() => {
      return !props.staticLabel || (!hasValue.value && !props.placeholder);
    });

    const classes = computed(() => {
      return {
        "le-input": true,
        "le-input--disabled": props.disabled,
        "le-input--readonly": props.readonly,
        [`le-input--${hasValue.value ? "filled" : "empty"}`]: true,
        "le-input--focused": isFocused.value,
        "le-input--dark": props.dark,
        "le-input--floating-label":
          hasLabel.value &&
          props.labelPosition === "inside" &&
          !props.staticLabel &&
          !(props.readonly && !hasValue.value),
        "le-input--no-padding":
          !props.outline && !props.bgColor && !props.shadow && !props.round,
        "le-input--has-placeholder": props.placeholder,
        "le-input--inner-icon-left": props.innerIconLeft,
        "le-input--inner-icon-right": props.innerIconRight,
      };
    });

    const inputWrapClasses = computed(() => {
      return {
        [formEl?.value?.valid === false ? "error" : props.color]:
          props.color || formEl?.value?.valid === false,
        [`${props.bgColor}--bg`]: props.bgColor,
        "le-input__input-wrap--round": props.round,
        "le-input__input-wrap--tile": props.tile,
        "le-input__input-wrap--box":
          props.outline || props.bgColor || props.shadow,
        "le-input__input-wrap--underline": !props.outline,
        "le-input__input-wrap--shadow": props.shadow,
        "le-input__input-wrap--no-padding":
          !props.outline && !props.bgColor && !props.shadow && !props.round,
      };
    });

    const onInput = (e: Event) => {
      const element = e?.target as HTMLObjectElement;
      inputNumberError.value = element.validity.badInput;
      ctx.emit("update:modelValue", inputValue.value);
      ctx.emit("input", inputValue.value);
    };
    const onFocus = (e: Event) => {
      isFocused.value = true;
      ctx.emit("focus", e);
    };
    const onBlur = (e: Event) => {
      isFocused.value = false;
      ctx.emit("blur", e);
    };

    watch(
      () => props.modelValue,
      (value) => {
        inputValue.value = value;
      }
    );

    return {
      onInput,
      onFocus,
      onBlur,
      inputWrapClasses,
      classes,
      showLabelInside,
      inputValue,
      listeners,
      attrs,
      isFocused,
      hasValue,
      hasLabel,
    };
  },
});
</script>

<style lang="scss">
$inactive-color: #777;

.le-input {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-items: center;
  font-size: $base-font-size;

  // Input field wrapper.
  // ------------------------------------------------------
  &__input-wrap {
    position: relative;
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
    height: $form-field-height;
    border-radius: $border-radius;
    border: $border;
    transition: border $transition-duration;

    .le-input--floating-label & {
      margin-top: 3 * $base-increment;
    }
    .le-input[class^="bdrs"] &,
    .le-input[class*=" bdrs"] & {
      border-radius: inherit;
    }

    &--underline {
      border-bottom-left-radius: initial;
      border-bottom-right-radius: initial;
      border-width: 0 0 1px;
    }

    &--round {
      border-radius: 9em;
    }
    &--tile {
      border-radius: initial;
    }
    &--shadow {
      box-shadow: $box-shadow;
    }

    .le-input--focused & {
      border-color: currentColor;
    }

    // Underline.
    &--underline:after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 0;
      border-bottom: 2px solid currentColor;
      transition: $transition-duration;
      transform: scaleX(0);
      pointer-events: none;
    }

    .le-input--focused &--underline:after {
      transform: scaleX(1);
    }
    &--round.le-input__input-wrap--underline:after {
      border-radius: 9em;
      transition: $transition-duration, height 0.035s;
    }
    .le-input--focused &--round.le-input__input-wrap--underline:after {
      height: 100%;
      transition: $transition-duration,
        height 0s ($transition-duration - 0.035s);
    }
  }

  // Input field.
  // ------------------------------------------------------
  &__input {
    width: 100%;
    height: 100%;
    font-size: inherit;
    color: inherit;
    text-align: inherit;
    background: none;
    border: none;
    outline: none;
    padding-left: 2 * $base-increment;
    padding-right: 2 * $base-increment;

    // For type="search" on Safari.
    -webkit-appearance: none;
    &::-webkit-search-decoration {
      -webkit-appearance: none;
    }
  }

  &--no-padding &__input {
    padding-left: 0;
    padding-right: 0;
  }

  &__input-wrap--round &__input {
    padding-left: 3 * $base-increment;
    padding-right: 3 * $base-increment;
  }

  &--inner-icon-left &__input {
    padding-left: 27px;
  }
  &--inner-icon-right &__input {
    padding-right: 27px;
  }

  &--disabled &__input {
    color: $disabled-color;
    cursor: not-allowed;
    -webkit-tap-highlight-color: transparent;
  }

  &--disabled input::placeholder {
    color: inherit;
  }

  // Icons inside.
  // ------------------------------------------------------
  &__icon {
    position: absolute;
  }
  &__icon--inner-left {
    left: 6px;
  }
  &__icon--inner-right {
    right: 6px;
  }
  &--no-padding &__icon--inner-left {
    left: 1px;
  }
  &--no-padding &__icon--inner-right {
    right: 1px;
  }

  .le-input--focused &__icon {
    color: currentColor;
  }

  &--disabled &__icon {
    color: $disabled-color;
    cursor: not-allowed;
    -webkit-tap-highlight-color: transparent;
  }

  // Label.
  // ------------------------------------------------------
  &__label {
    transition: color $transition-duration;
    cursor: pointer;

    &--left {
      margin-right: 2 * $base-increment;
    }
    &--right {
      margin-left: 2 * $base-increment;
    }

    .le-input--disabled & {
      color: $disabled-color;
      cursor: not-allowed;
      -webkit-tap-highlight-color: transparent;
    }
    .le-input--readonly.le-input--empty & {
      opacity: 0.5;
      cursor: auto;
    }
  }

  &__label--inside {
    position: absolute;
    top: 50%;
    left: 0;
    padding-left: 2 * $base-increment;
    transform: translateY(-50%);
    pointer-events: none;

    .le-input--no-padding & {
      left: 0;
      padding-left: 0;
      padding-right: 0;
    }
    .le-input__input-wrap--round & {
      padding-left: round(3 * $base-increment);
      padding-right: round(3 * $base-increment);
    }
    .le-input--inner-icon-left & {
      left: 18px;
    }
    .le-input--no-padding.le-input--inner-icon-left & {
      left: 26px;
    }

    .le-input--floating-label & {
      transform-origin: 0 0;
      transition: $transition-duration ease;
    }

    // move label with underline style.
    .le-input--focused.le-input--floating-label &,
    .le-input--filled.le-input--floating-label &,
    .le-input--has-placeholder.le-input--floating-label & {
      transform: translateY(-160%) scale(0.85);
    }
    // Chrome & Safari - Must remain in a separated rule as Firefox discard the whole rule seeing -webkit-.
    .le-input--floating-label .le-input__input:-webkit-autofill & {
      transform: translateY(-160%) scale(0.85);
    }
    // Move label with outline style or with shadow.
    .le-input--focused.le-input--floating-label .le-input__input-wrap--box &,
    .le-input--filled.le-input--floating-label .le-input__input-wrap--box &,
    .le-input--has-placeholder.le-input--floating-label
      .le-input__input-wrap--box
      & {
      transform: translateY(-180%) scale(0.85);
    }
    .le-input--focused.le-input--floating-label.le-input--inner-icon-left &,
    .le-input--filled.le-input--floating-label.le-input--inner-icon-left & {
      left: 0;
    }
    // Chrome & Safari - Must remain in a separated rule as Firefox discard the whole rule seeing -webkit-.
    .le-input--floating-label.le-input--inner-icon-left
      .le-input__input:-webkit-autofill
      & {
      left: 0;
    }

    .le-input--focused & {
      color: currentColor;
    }
  }
}
</style>