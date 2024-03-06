import EventBus from './eventBus'

// example of using EventBus
export default new EventBus<{
  'change-theme': (theme: string) => void
}>()
