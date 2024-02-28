/**
  * @question 为什么不使用vueuse的useRouteQuery
  * @answer 因为vueuse的useRouteQuery会在修改值时，自动修改所有的query，而不是仅修改当前页面组件的query
 */
import { nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type IValue = string | number | string[] | null | undefined

const queriesQueue = new Map<string, Record<string, IValue>>()

/**
 * 获取当前页面的query
 * @param name
 * @param defaultValue
 * @param options
 * @returns
 */
export const useQuery = <T extends IValue, K extends IValue = T>(
  name: string,
  defaultValue?: T,
  options: {
    transform?: (value: any) => K
    mode?: 'push' | 'replace'
  } = {}
) => {
  const { mode = 'push', transform = (value) => value } = options

  const route = useRoute()
  const router = useRouter()
  const currentPath = route.path

  const setQueryQueue = (value: T | K) => {
    const currentPageQueries = queriesQueue.get(currentPath) || {}
    currentPageQueries[name] = value
    queriesQueue.set(currentPath, currentPageQueries)
  }
  
  const get = () => {
    const currentPageQueries = queriesQueue.get(currentPath)
    if (currentPath !== route.path) {
      if (currentPageQueries && currentPageQueries[name] !== undefined) {
        return currentPageQueries[name]
      }

      return defaultValue
    }

    if (!currentPageQueries || currentPageQueries[name] === undefined) {
      if (route.query[name] !== undefined) {
        const value = transform(route.query[name])
        setQueryQueue(value)
        return value
      }
      return defaultValue
    }

    return transform(currentPageQueries[name])
  }

  const set = (value: T | K) => {
    const currentPageQueries = queriesQueue.get(currentPath) || {}
    if (
      (currentPageQueries[name] === undefined && value === defaultValue) ||
      value === transform(currentPageQueries[name])
    ) {
      return
    }

    currentPageQueries[name] = value
    queriesQueue.set(currentPath, currentPageQueries)

    nextTick(() => {
      if (Object.keys(currentPageQueries).length === 0) {
        return
      }

      const { params, query: oldQuery, hash } = route

      router[mode]({
        params,
        query: {
          ...oldQuery,
          ...currentPageQueries
        },
        hash
      })
    })
  }

  const query = computed({
    get,
    set
  })

  return query
}
