import { ref, shallowRef, computed, watch } from 'vue'
import { useQuery } from './useQuery'

import type { Ref, ShallowRef } from 'vue'

export interface IPageRequestOptions {
  defaultPage?: number
  defaultPageSize?: number
  /**
   * 是否自动监听page与pageSize的变化
   */
  autoWatchPage?: boolean
}
export type IRequestFn<T, Q> = (query: Q) => Promise<{ data: T[]; total: number }>
interface IPageRequestReturn<Q> {
  total: Ref<number>
  loading: Ref<boolean>
  page: Ref<number>
  pageSize: Ref<number>
  lastPage: Ref<number>
  getList: (query?: Q) => void
}

export function usePageRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  options?: IPageRequestOptions
): {
  list: Ref<T[]>
} & IPageRequestReturn<Q>

export function usePageRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  options: IPageRequestOptions,
  isShallow: true
): {
  list: ShallowRef<T[]>
} & IPageRequestReturn<Q>

export function usePageRequest<T, Q extends Record<string, any> = {}>(
  requestFn: IRequestFn<T, Q>,
  {
    defaultPage = 1,
    defaultPageSize = 10,
    autoWatchPage = false
  }: IPageRequestOptions = {},
  isShallow = false
) {
  const list: Ref<T[]> | ShallowRef<T[]> = !isShallow ? ref([]) : shallowRef([])
  const loading = ref(false)
  const total = ref(0)
  const page = useQuery('page', defaultPage, { transform: Number })
  const pageSize = useQuery('pageSize', defaultPageSize, { transform: Number })

  const lastPage = computed(() => {
    if (!total.value || !pageSize.value) {
      return 0
    }

    return Math.ceil(total.value / pageSize.value)
  })

  /**
   * 请求列表数据，自动带上page与pageSize，只传入其他query即可
   */
  const getList = (query?: Q) => {
    const params = { page: page.value, pageSize: pageSize.value, ...query } as unknown as Q
    loading.value = true

    requestFn(params)
      .then((res) => {
        list.value = res.data
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (autoWatchPage) {
    watch(
      [page, pageSize],
      () => {
        getList()
      },
      { immediate: true }
    )
  }

  return {
    list,
    total,
    loading,
    page,
    pageSize,
    lastPage,
    getList
  }
}
