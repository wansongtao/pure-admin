import type { App } from 'vue'

const modules = import.meta.glob(['./*.ts', '!./install.ts'], {
  import: 'default',
  eager: true
})

const installDirective = (app: App) => {
  for (const key in modules) {
    const fn = modules[key]
    if (fn instanceof Function) {
      fn(app)
    }
  }
}

export default installDirective
