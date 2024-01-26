import type { ITheme } from '@/types/index'

const key = 'theme'
export const setTheme = (theme: ITheme) => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(key, theme)
}

export const getTheme = () => {
  return (localStorage.getItem(key) as ITheme) ?? 'light'
}
