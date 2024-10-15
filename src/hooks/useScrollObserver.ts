import { useResizeObserver } from '@vueuse/core'

export default function useScrollObserver<T extends HTMLElement | SVGElement = HTMLElement>(
  key = 'elementRef'
) {
  const elementRef = useTemplateRef<T>(key)
  const scrollDirection = ref<'vertical' | 'horizontal' | 'all' | null>(null)

  const updateScrollDirection = () => {
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = elementRef.value!

    if (scrollWidth > clientWidth && scrollHeight > clientHeight) {
      scrollDirection.value = 'all'
    } else if (scrollWidth > clientWidth) {
      scrollDirection.value = 'horizontal'
    } else if (scrollHeight > clientHeight) {
      scrollDirection.value = 'vertical'
    } else {
      scrollDirection.value = null
    }

    return scrollDirection.value
  }

  useResizeObserver(elementRef, updateScrollDirection)

  return {
    elementRef,
    scrollDirection,
    updateScrollDirection
  }
}
