import { useRouteQuery } from '@vueuse/router'
import { ref, shallowRef } from 'vue'

import type { Ref, ShallowRef } from 'vue'

export type IRequestFn<T, Q> = (query: Q) => Promise<{ data: T[]; total: number }>
export interface IOptions {
  isCachePagination?: boolean
  defaultPage?: number
  defaultPageSize?: number
}
interface IRequestReturn<Q> {
  total: Ref<number>
  loading: Ref<boolean>
  page: Ref<number>
  pageSize: Ref<number>
  fetchList: (query?: Q) => void
}

export function useRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  options?: IOptions
): {
  list: Ref<T[]>
} & IRequestReturn<Q>

export function useRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  options: IOptions | undefined,
  isShallow: true
): {
  list: ShallowRef<T[]>
} & IRequestReturn<Q>

export default function useRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  { isCachePagination = true, defaultPage = 1, defaultPageSize = 10 }: IOptions = {},
  isShallow = false
) {
  const cacheKey = useRoute().name as string
  const page = isCachePagination
    ? useRouteQuery(cacheKey + 'page', defaultPage, { transform: Number })
    : ref(defaultPage)
  const pageSize = isCachePagination
    ? useRouteQuery(cacheKey + 'size', defaultPageSize, { transform: Number })
    : ref(defaultPageSize)

  const list: Ref<T[]> | ShallowRef<T[]> = !isShallow ? ref([]) : shallowRef([])
  const loading = ref(false)
  const total = ref(0)

  const fetchList = (query?: Q) => {
    loading.value = true
    const params = { page: page.value, pageSize: pageSize.value, ...query } as unknown as Q

    requestFn(params)
      .then((res) => {
        list.value = res.data
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    list,
    total,
    loading,
    page,
    pageSize,
    fetchList
  }
}
