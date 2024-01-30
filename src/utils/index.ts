/**
 * @description 获取传入数据的类型，返回类型小写字符串
 * @param obj
 * @returns
 */
export const getDataType = (obj: unknown) => {
  let res = Object.prototype.toString.call(obj).split(' ')[1]
  res = res.substring(0, res.length - 1).toLowerCase()
  return res
}

/**
 * @description 函数式编程实现，从左往右执行，函数返回值会传给下一个执行的函数
 * @param funcs
 * @returns
 */
export const compose = (...funcs: Function[]) => {
  if (funcs.length === 0) {
    return (arg: unknown) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => {
    return (...args: unknown[]) => {
      return b(a(...args))
    }
  })
}

/**
 * @description 节流函数，触发一次后，下次触发需要间隔一定的时间
 * @param fn 需要执行的函数
 * @param delay 间隔时间，默认1s，单位ms
 * @returns
 */
export const throttle = (fn: Function, delay: number = 1000) => {
  let lastTime = 0
  return function <T>(this: any, ...args: T[]) {
    const nowTime = Date.now()

    if (nowTime - lastTime < delay) {
      return
    }

    lastTime = nowTime
    fn.apply(this, args)
  }
}

/**
 * @description 防抖函数，一定时间内多次触发，只执行最后触发的一次，可能永远不会执行
 * @param fn 需要防抖的函数
 * @param delay 间隔时间，默认200ms，单位ms
 * @param immediate 第一次是否立即执行，默认false
 * @returns
 */
export const debounce = <T = unknown>(
  fn: Function,
  delay: number = 200,
  immediate: boolean = false
) => {
  let timer: NodeJS.Timeout | null = null
  let isFirst = true

  return function (this: any, ...args: T[]) {
    timer && clearTimeout(timer)

    if (immediate && isFirst) {
      isFirst = false
      fn.apply(this, args)
      return
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 获取系统明暗模式
 * @param autoFollow 自动跟随系统明暗模式回调
 * @returns
 */
export const getSystemTheme = (autoFollow?: (mode: 'dark' | 'light') => void) => {
  if (!window.matchMedia) {
    const date = new Date()
    const hours = date.getHours()

    if (autoFollow) {
      const time = date.getTime()
      let delay = 0
      let mode: 'light' | 'dark' = 'light'

      if (hours >= 0 && hours < 6) {
        const lastTime = date.setHours(6)
        delay = lastTime - time
      } else if (hours >= 6 && hours < 19) {
        const lastTime = date.setHours(19)
        delay = lastTime - time
        mode = 'dark'
      } else {
        const lastTime = date.setHours(23, 59, 59, 999) + 6 * 60 * 60 * 1000
        delay = lastTime - time
      }

      setTimeout(() => {
        autoFollow(mode)
        getSystemTheme(autoFollow)
      }, delay)
    }

    if (hours >= 6 && hours < 19) {
      return 'light'
    }

    return 'dark'
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  const theme = systemTheme.matches ? 'dark' : 'light'

  if (autoFollow) {
    systemTheme.addEventListener('change', (e) => {
      const theme = e.matches ? 'dark' : 'light'
      autoFollow(theme)
    })
  }
  return theme
}

/**
 * 递归查找
 * @param data 
 * @param compare 
 * @param childrenKey 
 * @returns 
 */
export const recursionFindItem = <T extends Record<string, any>>(
  data: T[],
  compare: (value: T) => boolean,
  childrenKey = 'children'
): T | null => {
  let item: T | null = null

  for (let i = 0; i < data.length; i++) {
    const value = data[i]
    if (compare(value)) {
      item = value
      break
    }

    if (value[childrenKey]) {
      item = recursionFindItem(value[childrenKey], compare, childrenKey)
    }
  }

  return item
}
