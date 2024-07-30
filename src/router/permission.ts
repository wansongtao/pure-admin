import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.getToken()
  if (!token && to.name !== 'Login') {
    NProgress.done()
    location.reload()
    return `/login?redirect=${to.path}`
  }

  if (token) {
    if (to.name === 'Login') {
      NProgress.done()
      return (to.query?.redirect as string) || '/'
    }

    if (!userStore.menus?.length) {
      const route = await userStore.getUserInfoAction()
      
      if (route) {
        router.addRoute(route)
        NProgress.done()
        return to.fullPath
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
