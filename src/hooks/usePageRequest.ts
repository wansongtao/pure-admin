import { ref, shallowRef, computed, watch } from 'vue'
import { debounce } from '@/utils'
import { useQuery } from './useQuery'

import type { Ref, ShallowRef } from 'vue'

/**
 * 分页请求数据
 * @param requestData
 * @param param1
 * @returns
 */
export const usePageRequest = <
  T = unknown,
  K extends Ref<T[]> | ShallowRef<T[]> = Ref<T[]>,
  Q extends Record<string, any> = { page: number; pageSize: number }
>(
  requestData: (query: Q) => Promise<{ data: T[]; total: number }>,
  {
    defaultPage = 1,
    defaultPageSize = 10,
    deep = true,
    delay = 200,
    autoWatchPage = false
  }: {
    defaultPage?: number
    defaultPageSize?: number
    /**
     * true：对整个列表进行响应式，false：仅监听列表长度的变化 (默认 true)
     */
    deep?: boolean
    /**
     * 防抖时间，单位ms
     */
    delay?: number
    /**
     * 是否自动监听page与pageSize的变化
     */
    autoWatchPage?: boolean
  } = {}
) => {
  const list: K = (deep ? ref([]) : shallowRef([])) as unknown as K
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
  const getList: (query: Q) => void = debounce((query: Q) => {
    loading.value = true
    requestData(query)
      .then((res) => {
        list.value = res.data
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }, delay ?? 0)

  if (autoWatchPage) {
    watch(
      [page, pageSize],
      ([page, pageSize]) => {
        getList({ page, pageSize } as unknown as Q)
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
