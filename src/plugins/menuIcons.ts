const MENU_ICON_MAP: Record<string, any> = {}

const modules = import.meta.glob('/src/assets/svgs/menus/*.svg', { eager: true })
for (const path in modules) {
  const name = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  MENU_ICON_MAP[name] = (modules[path] as any).default
}

export default MENU_ICON_MAP
