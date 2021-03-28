import { inject, Ref } from "@vue/runtime-core";
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
  formEl?: Ref<HTMLFormElement>;
}

export function useFormElement(props: FormElementProps) {
  const formRegister: IRegistration = () => {};
  const valid: boolean | null = null;

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
    if (props.formEl?.value) props.formEl.value.validate(props);
  };

  return {
    valid,
    inputName,
    validate,
    formRegister,
  };
}
