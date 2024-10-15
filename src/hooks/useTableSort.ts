import { useRouteQuery } from '@vueuse/router'
import type { DataTableSortState } from 'naive-ui'
import type { IQuery } from '@/types/api'

export default function useTableSort(tableColumnKey?: string, queryKey?: string) {
  if (!queryKey) {
    queryKey = (useRoute().name as string) + 'Sort'
  }

  const sort = useRouteQuery<IQuery['sort']>(queryKey)
  const onSorterChange = (column: DataTableSortState) => {
    const { order, columnKey } = column

    if (tableColumnKey && columnKey !== tableColumnKey) return

    if (!order) {
      sort.value = undefined
      return
    }
    sort.value = order === 'ascend' ? 'asc' : 'desc'
  }

  return {
    sort,
    onSorterChange
  }
}
