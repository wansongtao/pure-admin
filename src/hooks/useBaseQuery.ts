import { useRouteQuery } from '@vueuse/router'

import type { IQuery } from '@/types/api'

export default function useBaseQuery(key?: string) {
  if (!key) {
    key = Math.random().toString(36).slice(2)
  }

  const keyword = useRouteQuery<IQuery['keyword'] | null>(key + '-keyword', null)
  const disabled = useRouteQuery(key + '-disabled', null, {
    transform: (val: string | null) => {
      if (!val) {
        return val as null
      }

      return Number(val) as IQuery['disabled']
    }
  })
  const dateRange = useRouteQuery(key + '-date-range', null, {
    transform: (val: string[] | null) => {
      if (!val) {
        return val
      }

      const [beginTime, endTime] = val.map(Number)
      return [beginTime, endTime] as [number, number]
    }
  })

  return {
    keyword,
    disabled,
    dateRange
  }
}
