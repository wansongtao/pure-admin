import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const useStore = useUserStore()
  const token = useStore.getToken()
  if (!token && to.name !== 'Login') {
    NProgress.done()
    return `/login?redirect=${to.path}`
  }

  if (token) {
    if (to.name === 'Login') {
      NProgress.done()
      return (to.query?.redirect as string) || '/'
    }

    const setStore = useSettingStore()
    if (!setStore.menus?.length) {
      const route = await setStore.getRoutesAction()
      
      router.addRoute(route)
      NProgress.done()
      return to.fullPath
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
