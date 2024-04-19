/**
 * @question 为什么不使用vueuse的useRouteQuery
 * @answer 因为vueuse的useRouteQuery会在修改值时，自动修改所有的query，而不是仅修改当前页面组件的query
 */
import { nextTick, watch, ref, computed, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type IQuery = string | number | string[] | null | undefined

const queriesQueue = new Map<string, Record<string, IQuery>>()

/**
 * 获取当前页面的query
 * @param name
 * @param defaultValue
 * @param options
 * @returns
 */
export const useQuery = <T extends IQuery, K extends IQuery = T>(
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

  const setQueryQueue = (value: IQuery) => {
    const currentPageQueries = queriesQueue.get(currentPath) || {}
    if (value === null || value === undefined) {
      currentPageQueries[name] = value
    } else {
      currentPageQueries[name] = isEncodeURIComponent ? encodeURIComponent(value as string) : value
    }

    queriesQueue.set(currentPath, currentPageQueries)
  }

  watch(query, (value) => {
    setQueryQueue(value as IQuery)

    nextTick(() => {
      const currentPageQueries = queriesQueue.get(currentPath) || {}
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

export const useObjectQuery = <T extends Record<string, any>>(
  name: string,
  defaultValue?: T,
  options: {
    transform?: (value: string | undefined) => string
    mode?: 'push' | 'replace'
    isEncodeURIComponent?: boolean
  } = {}
) => {
  const str = useQuery<string | undefined>(name, undefined, {
    isEncodeURIComponent: true,
    ...options
  })

  const search = computed({
    get: () => {
      try {
        return str.value !== undefined ? JSON.parse(str.value) : {}
      } catch (error) {
        return {}
      }
    },
    set: (val: T) => {
      try {
        str.value = val !== undefined ? JSON.stringify(val) : undefined
      } catch (error) {
        str.value = undefined
      }
    }
  })

  if (defaultValue !== undefined) {
    search.value = defaultValue
  }

  return search
}
