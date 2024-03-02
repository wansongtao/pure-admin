/**
 * @question 为什么不使用vueuse的useRouteQuery
 * @answer 因为vueuse的useRouteQuery会在修改值时，自动修改所有的query，而不是仅修改当前页面组件的query
 */
import { nextTick, watch, ref, type Ref } from 'vue'
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
    isEncodeURIComponent?: boolean
  } = {}
) => {
  const { mode = 'push', transform = (value) => value, isEncodeURIComponent = false } = options

  const route = useRoute()
  const router = useRouter()
  const currentPath = route.path

  const query = ref(defaultValue) as Ref<T | K>
  watch(
    () => route.query[name],
    (value) => {
      if (route.path !== currentPath) {
        return
      }

      if (value === undefined) {
        query.value = defaultValue as T
        return
      }

      if (!isEncodeURIComponent) {
        query.value = transform(value)
        return
      }

      query.value = transform(decodeURIComponent(value as string))
    },
    {
      immediate: true
    }
  )

  watch(query, (value) => {
    const currentPageQueries = queriesQueue.get(currentPath) || {}
    currentPageQueries[name] = isEncodeURIComponent ? encodeURIComponent(value as string) : value
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
  })

  return query
}
