<template lang="pug">
form.le-form(@submit="onSubmit", @reset="reset", novalidate, :class="classes")
  slot
</template>

<script lang="ts">
import { defineComponent, PropType, provide } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import { IRegistration, IValidateElement } from "@/utils/types";

export default defineComponent({
  name: "le-form",

  props: {
    modelValue: { type: Object as PropType<boolean> },
    allowSubmit: { type: Boolean },
    noKeyupValidation: { type: Boolean },
    noBlurValidation: { type: Boolean },
    errorPlaceholders: { type: Boolean },
  },

  emits: [
    "submit",
    "before-validate",
    "validate",
    "success",
    "error",
    "reset",
    "input",
    "update:modelValue",
    "update:errorsCount",
  ],

  setup(props, ctx) {
    const formElements = ref<Array<HTMLFormElement>>([]);
    const status = ref<boolean | null>(null);
    const errorsCount = ref<number | null>(0);

    const classes = computed(() => {
      return {
        "le-form--pristine": status.value === null,
        "le-form--error": status.value === false,
        "le-form--success": status.value === true,
        "le-form--error-placeholders": props.errorPlaceholders,
      };
    });

    const register: IRegistration = (formElement: HTMLFormElement) => {
      formElements.value.push(formElement);
    };

    const unregister: IRegistration = (formElement: HTMLFormElement) => {
      formElements.value.push(formElement);
    };

    const validate = (e: Event) => {
      ctx.emit("before-validate");
      const errorsCount = formElements.value.reduce((total, el) => {
        const {
          validators,
          Validation = {},
          inputValue,
          readonly,
          disabled,
        } = el;

        if (!validators || disabled || readonly) return total;

        validators.some((validator: any) => {
          const result =
            typeof validator === "function" && validator(inputValue);

          Validation.isValid = typeof result !== "string";
          Validation.message = Validation.isValid ? "" : result;
          return !Validation.isValid;
        });

        el.hasJustReset = false;

        el.$emit("update:valid", Validation.isValid);
        return total + ~~!Validation.isValid;
      }, 0);
      updateErrorsCount(errorsCount);

      status.value = !errorsCount;

      ctx.emit("validate", { e, errorsCount });
      ctx.emit(status.value ? "success" : "error", { e, errorsCount });
      return status.value;
    };

    const validateElement: IValidateElement = (el: HTMLFormElement) => {
      el.validators.some((validator: any) => {
        const result =
          typeof validator === "function" && validator(el.inputValue);

        el.Validation.isValid = typeof result !== "string";
        el.Validation.message = el.Validation.isValid ? "" : result;
        return !el.Validation.isValid;
      });

      el.hasJustReset = false;
      updateErrorsCount();

      return el.Validation.isValid;
    };

    const reset = (e?: Event) => {
      if (!e) return;
      status.value = null;

      formElements.value.forEach(
        (item) => !item.disabled && !item.readonly && item.reset()
      );
      updateErrorsCount(0, true);
      ctx.emit("reset", e);
    };

    const updateErrorsCount = (count: number | null = null, reset = false) => {
      errorsCount.value =
        count !== null
          ? count
          : formElements.value.reduce(
              (sum, el) => sum + ~~(el.Validation.isValid === false),
              0
            );
      status.value = reset ? null : !errorsCount.value;

      ctx.emit("update:modelValue", status.value);
      ctx.emit("input", status.value);
      ctx.emit("update:errorsCount", errorsCount.value);
    };

    const onSubmit = (e: Event) => {
      validate(e);
      ctx.emit("submit", e);
      if (!props.allowSubmit || !status.value) e.preventDefault();
    };

    provide("formRegister", register);
    provide("formUnregister", unregister);
    provide("validateElement", validateElement);
    provide("noKeyupValidation", props.noKeyupValidation);
    provide("noBlurValidation", props.noBlurValidation);

    onMounted(() => {
      status.value = !!props.modelValue || null;
    });

    watch(
      () => props.modelValue,
      (currentValue) => {
        if (
          (status.value === false && currentValue) ||
          (currentValue === null && status.value !== null)
        )
          reset();
        if (currentValue) status.value = currentValue;
      }
    );

    return {
      onSubmit,
      validateElement,
      register,
      unregister,
      classes,
    };
  },
});
</script>