import { defineComponent, getCurrentInstance } from "@vue/runtime-core";
import { computed, ref } from "vue";

export default defineComponent({
  inject: { formRegister: { default: null } },

  props: {
    name: { type: String }, // When sending data through form.
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    required: { type: Boolean },
    validators: { type: Array },
  },

  setup(props) {
    const valid: boolean | null = null;
    const formEl = ref<null | HTMLFormElement>(null);

    const inputName = computed(() => {
      const options = getCurrentInstance()?.appContext.config.globalProperties
        .$options;
      return (
        props.name ||
        `${options.name}--${
          getCurrentInstance()?.appContext.config.globalProperties._.uid
        }`
      );
    });

    const validate = () => {
      if (formEl.value) formEl.value.validate(props);
    };

    return {
      valid,
      inputName,
      validate,
    };
  },
});
