import { onScopeDispose, onDeactivated } from 'vue'
import { onPageDeactivated } from '@/utils/index'

/**
 * 页面失活(无操作)
 * @param callback 页面一定时长无操作时触发
 * @param timeout 时长，默认15s，单位：秒
 * @param immediate 是否立即开始，默认 false
 * @param isLeaveDestroy 离开当前组件是否停止，默认 true
 * @returns
 */
export default function usePageDeactivated(
  callback: () => void,
  timeout = 15,
  immediate = false,
  isLeaveDestroy = true
) {
  const { startDeactivated, stopDeactivated, restartDeactivated } = onPageDeactivated(
    callback,
    timeout,
    immediate
  )

  onScopeDispose(() => {
    if (isLeaveDestroy) stopDeactivated()
  })
  onDeactivated(() => {
    if (isLeaveDestroy) stopDeactivated()
  })

  return {
    startDeactivated,
    stopDeactivated,
    restartDeactivated
  }
}
