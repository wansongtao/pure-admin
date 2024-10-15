import type { FormInst } from 'naive-ui'

export default function useFormValidate(key = 'formRef') {
  const formRef = useTemplateRef<FormInst>(key)

  const validateForm = <T = string>(validatePartial?: (key: T) => boolean) => {
    return new Promise<boolean>((resolve) => {
      formRef.value?.validate(
        (valid) => {
          if (!valid) {
            resolve(true)
            return
          }

          resolve(false)
        },
        (rule) => {
          if (validatePartial && rule.key) {
            return validatePartial(rule.key as T)
          }
          return true
        }
      )
    })
  }

  return {
    formRef,
    validateForm
  }
}
