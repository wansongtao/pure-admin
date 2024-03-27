/**
 * @description: Automatically import route components
 */
const COMPONENT_MAP = import.meta.glob(['@/views/**/*.vue', '!@/views/**/components/*.vue'])

for (const path in COMPONENT_MAP) {
  const name = path.replace('/src/views', '')
  COMPONENT_MAP[name] = COMPONENT_MAP[path]
  delete COMPONENT_MAP[path]
}

export default COMPONENT_MAP
