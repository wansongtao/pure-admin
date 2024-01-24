import { ref, watch, shallowRef } from 'vue'
import { debounce } from '@/utils'

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
    immediate = true
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
    immediate?: boolean
  } = {}
) => {
  const list: K = (deep ? ref([]) : shallowRef([])) as unknown as K
  const loading = ref(false)
  const total = ref(0)
  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)

  /**
   * 请求列表数据，自动带上page与pageSize，只传入其他query即可
   */
  const getList: (query?: Q) => void = debounce((query?: Q) => {
    const param = { page: page.value, pageSize: pageSize.value, ...query } as unknown as Q

    loading.value = true
    requestData(param)
      .then((res) => {
        list.value = res.data
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }, delay ?? 0)

  watch(
    [page, pageSize],
    () => {
      getList()
    },
    { immediate }
  )

  return {
    list,
    total,
    loading,
    page,
    pageSize,
    getList
  }
}
