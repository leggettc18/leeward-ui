<template lang="pug" ref="formEl">
div(:class="classes")
  .le-flex.grow(:class="column ? 'column' : 'align-center'")
    slot

  //- Error message.
  le-transition-expand(y)
    template(v-if="Validation.message")
      .le-form-el__error.error.le-form-el__error.le-form-el__error(
        v-if="$slots['error-message']"
      )
        slot(name="error-message", :message="Validation.message")
      .le-form-el__error.error.le-form-el__error.le-form-el__error(
        v-else,
        v-html="Validation.message"
      )
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from "@vue/runtime-core";
import { ref, inject, watch, onMounted } from "vue";
import { IRegistration, IValidateElement } from "@/utils/types";

export default defineComponent({
  name: "le-form-element",

  props: {
    valid: { required: true },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    inputValue: { required: true }, // The form element's input value.
    validators: { type: Array },
    isFocused: { default: false }, // Watched.
    column: { default: false }, // Flex direction of the embedded component: column or row by default.
  },

  emits: ["reset", "update:valid"],

  setup(props, ctx) {
    const formRegister: IRegistration = () => {};
    const formUnregister: IRegistration = () => {};
    const validateElement: IValidateElement = () => {};
    const noKeyupValidation = ref<boolean | null>(null);
    const noBlurValidation = ref<boolean | null>(null);

    inject("formRegister", formRegister);
    inject("formUnregister", formUnregister);
    inject("validateElement", validateElement);
    inject("noKeyupValidation", noKeyupValidation);
    inject("noBlurValidation", noBlurValidation);

    const formEl = ref<HTMLFormElement | null>(null);

    const Validation = ref({
      isValid: null,
      message: "",
    });
    const hasJustReset = ref(false);

    const classes = computed(() => {
      const classes = [
        "le-form-el--error error",
        "le-form-el--success",
        "le-form-el--pristine",
      ];
      const isValid = Validation.value.isValid;
      if (isValid) {
        return classes[~~isValid];
      } else {
        return classes[2];
      }
    });

    const reset = () => {
      ctx.emit("reset");
      ctx.emit("update:valid", null);
      Validation.value.message = "";
      Validation.value.isValid = null;
      hasJustReset.value = true;
    };
    const validate = () => {
      if (formEl.value) ctx.emit("update:valid", validateElement(formEl.value));
    };

    watch(
      () => props.inputValue,
      () => {
        if (hasJustReset.value) return (hasJustReset.value = false);
        if (!noKeyupValidation.value && props.validators && formEl.value) {
          ctx.emit("update:valid", validateElement(formEl.value));
        }
      }
    );
    watch(
      () => props.isFocused,
      (val) => {
        if (val) hasJustReset.value = false;
        else if (!noBlurValidation.value && props.validators && formEl.value) {
          ctx.emit("update:valid", validateElement(formEl.value));
        }
      }
    );

    onMounted(() => {
      if (formRegister && formEl.value) formRegister(formEl.value);
    });

    onBeforeUnmount(() => {
      if (formUnregister && formEl.value) formUnregister(formEl.value);
    });

    return {
      validate,
      reset,
      classes,
      Validation,
    };
  },
});
</script>

<style lang="scss">
div.le-form-el {
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.le-form-el {
  .le-form--error-placeholders & {
    position: relative;
    padding-bottom: 1.2rem;
  }
  &--has-error input::placeholder {
    color: inherit;
  }

  &-shakable {
    position: relative;
  }
  &--error &-shakable {
    animation: le-form-el-shake 0.3s $transition-duration ease-in-out;
  }

  // Error message.
  // ------------------------------------------------------
  &__error {
    width: 100%;
    flex-grow: 1;
    font-size: 0.775rem;
    margin-top: $base-increment;

    .le-form--error-placeholders & {
      position: absolute;
      bottom: 0;
    }
  }
}

@keyframes le-form-el-shake {
  0% {
    left: 0;
  }
  20%,
  60% {
    left: 2px;
  }
  40%,
  80% {
    left: -2px;
  }
}
</style>