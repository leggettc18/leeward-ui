import { inject } from "@vue/runtime-core";
import { computed, getCurrentInstance, ref } from "vue";
import { IRegistration } from "@/utils/types";

// export const FormElementProps = defineComponent({
//   props: {
//     name: { type: String }, // When sending data through form.
//     disabled: { type: Boolean },
//     readonly: { type: Boolean },
//     required: { type: Boolean },
//     validators: { type: Array },
//   },
// });

interface FormElementProps {
  name?: string;
  type?: string;
}

export function useFormElement(props: FormElementProps) {
  const formRegister: IRegistration = () => {};
  const valid: boolean | null = null;
  const formEl = ref<null | HTMLFormElement>(null);

  inject("formRegister", formRegister);

  const inputName = computed(() => {
    //const options = getCurrentInstance()?.appContext.config.globalProperties
    //  .$options;
    return (
      props.name ||
      `${props.type ? props.type : "form-input"}--${getCurrentInstance()?.uid}`
    );
  });

  const validate = () => {
    if (formEl.value) formEl.value.validate(props);
  };

  return {
    valid,
    inputName,
    validate,
    formRegister,
  };
}
