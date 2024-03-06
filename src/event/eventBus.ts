export default class EventBus<T extends Record<string | symbol, any>> {
  private listeners: Record<keyof T, ((...args: any[]) => void)[]> = {} as any

  $on<K extends keyof T>(event: K, callback: T[K]) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  $emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    const callbacks = this.listeners[event]
    if (!callbacks || callbacks?.length === 0) {
      return
    }

    callbacks.forEach((callback) => {
      callback(...args)
    })
  }

  $off<K extends keyof T>(event: K, listener?: T[K]) {
    if (!listener) {
      delete this.listeners[event]
      return
    }

    const fns = this.listeners[event]
    if (!fns || !fns.length) {
      return
    }

    const idx = fns.indexOf(listener)
    if (idx !== -1) {
      fns.splice(idx, 1)
    }
  }
}
