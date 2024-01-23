import type { ITheme } from '@/types/index'
import { DEFAULT_THEME } from '@/config/index'

const key = 'theme'

export const setTheme = (theme: ITheme) => {
  document.body.classList.remove('light', 'dark')
  document.body.classList.add(theme)

  localStorage.setItem(key, theme)
}

export const getTheme = () => {
  return (localStorage.getItem(key) as ITheme) || DEFAULT_THEME
}

export const initTheme = () => {
  const theme = getTheme()
  setTheme(theme)
}
