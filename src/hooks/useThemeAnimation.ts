import { useDark, useToggle } from '@vueuse/core'

export default function useThemeAnimation() {
  const isDark = useDark({
    attribute: 'data-theme',
    initialValue: 'light',
    valueLight: 'light'
  })

  const toggleDark = useToggle(isDark)
  const toggleThemeAnimation = (event: MouseEvent) => {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // 兼容性处理，如果不支持 startViewTransition 方法，则直接退出
    if (!(document as any)?.startViewTransition) {
      return
    }

    const transition = (document as any)?.startViewTransition(async () => {
      toggleDark()
    })

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)'
        }
      )
    })
  }

  return {
    toggleThemeAnimation
  }
}
