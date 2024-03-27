import { onScopeDispose, onDeactivated } from 'vue'
import { onIdleDetection } from '@/utils/index'

/**
 * 页面空闲检测
 * @param callback 页面一定时长无操作时触发
 * @param timeout 时长，默认15s，单位：秒
 * @param immediate 是否立即开始，默认 false
 * @param isLeaveDestroy 离开当前组件是否停止，默认 true
 * @returns
 */
export default function useIdleDetection(
  callback: () => void,
  timeout = 15,
  immediate = false,
  isLeaveDestroy = true
) {
  const { startDetection, stopDetection, restartDetection } = onIdleDetection(
    callback,
    timeout,
    immediate
  )

  onScopeDispose(() => {
    if (isLeaveDestroy) stopDetection()
  })
  onDeactivated(() => {
    if (isLeaveDestroy) stopDetection()
  })

  return {
    startDetection,
    stopDetection,
    restartDetection
  }
}
