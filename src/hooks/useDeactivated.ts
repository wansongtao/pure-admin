import { onScopeDispose, onDeactivated } from 'vue'
import { pageDeactivated } from '@/utils/index'

/**
 * 组件失活(无操作)
 * @param callback 页面一定时长无操作时触发
 * @param timeout 时长，默认15s，单位：秒
 * @param immediate 是否立即开始，默认 false
 * @param isLeaveDestroy 离开当前组件是否停止，默认 true
 * @returns
 */
export default function useDeactivated(
  callback: () => void,
  timeout = 15,
  immediate = false,
  isLeaveDestroy = true
) {
  const { onStartDeactivated, onStopDeactivated, onClearTimer } = pageDeactivated(
    callback,
    timeout,
    immediate
  )

  onScopeDispose(() => {
    if (isLeaveDestroy) onStopDeactivated()
  })
  onDeactivated(() => {
    if (isLeaveDestroy) onStopDeactivated()
  })

  return {
    onStartDeactivated,
    onStopDeactivated,
    onClearTimer
  }
}
