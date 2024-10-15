const ROUTE_COMPONENT_MAP = import.meta.glob(['@/views/**/*.vue', '!@/views/**/components/*.vue'])

for (const path in ROUTE_COMPONENT_MAP) {
  const name = path.replace('/src/views', '')
  ROUTE_COMPONENT_MAP[name] = ROUTE_COMPONENT_MAP[path]
  delete ROUTE_COMPONENT_MAP[path]
}

export default ROUTE_COMPONENT_MAP
