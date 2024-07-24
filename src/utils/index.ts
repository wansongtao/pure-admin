/**
 * @description 获取数据类型，返回小写的类型字符串
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
export const throttle = (fn: Function, delay = 1000) => {
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
 * @description 防抖函数，一定时间内多次触发，只执行最后触发的一次(可能永远不会执行)
 * @param fn 需要防抖的函数
 * @param delay 间隔时间，默认200ms，单位ms
 * @param immediate 第一次是否立即执行，默认false
 * @returns
 */
export const debounce = <T = unknown>(fn: Function, delay = 200, immediate = false) => {
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

export const getSystemTheme = () => {
  if (!window.matchMedia) {
    const date = new Date()
    const hours = date.getHours()

    if (hours >= 7 && hours < 19) {
      return 'light'
    }
    return 'dark'
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  const theme = systemTheme.matches ? 'dark' : 'light'
  return theme
}

export const followSystemTheme = (callback: (theme: 'dark' | 'light') => void) => {
  if (!window.matchMedia) {
    const date = new Date()
    const hours = date.getHours()
    const time = date.getTime()
    let delay = 0
    let mode: 'light' | 'dark' = 'light'

    if (hours >= 0 && hours < 7) {
      const nextTime = date.setHours(7)
      delay = nextTime - time
    } else if (hours >= 7 && hours < 19) {
      const nextTime = date.setHours(19)
      delay = nextTime - time
      mode = 'dark'
    } else {
      const nextTime = date.setHours(23, 59, 59, 999) + 7 * 60 * 60 * 1000
      delay = nextTime - time
    }

    setTimeout(() => {
      callback(mode)
    }, delay)
    return
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.addEventListener('change', (e) => {
    const theme = e.matches ? 'dark' : 'light'
    callback(theme)
  })
}

/**
 * 深度查找
 * @param data
 * @param compare
 * @param childrenKey
 * @returns
 */
export const deepFind = <T extends Record<string, any>>(
  data: T[],
  compare: (value: T) => boolean,
  childrenKey = 'children'
): T | undefined => {
  let item: T | undefined = undefined

  for (let i = 0; i < data.length; i++) {
    const value = data[i]
    if (compare(value)) {
      item = value
      break
    }

    if (!value[childrenKey]) {
      continue
    }

    item = deepFind(value[childrenKey], compare, childrenKey)
    if (item !== undefined) {
      break
    }
  }

  return item
}

/**
 * 将对象转为数组
 * @param data
 * @returns
 */
export const convertObjectToArray = <T extends Record<any, unknown>>(data: T) => {
  const keys: (keyof T)[] = Object.keys(data)

  return keys.map((k) => {
    return {
      label: data[k],
      value: k
    }
  })
}

/**
 * 获取对象中值为 truly 的部分
 * @param data
 * @returns
 */
export const getTrulyValue = <T extends Record<any, any>>(data: T) => {
  const trulyObject = {} as T

  const keys: (keyof T)[] = Object.keys(data)
  keys.forEach((k) => {
    const value = data[k] as any
    if (value === undefined || value === '' || value === null) {
      return
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return
      }

      trulyObject[k] = value.filter((item) => !!item) as any
      return
    }

    if (value instanceof Object) {
      trulyObject[k] = getTrulyValue(value)
      return
    }

    trulyObject[k] = value
  })
  return trulyObject
}

/**
 * 获取数据中变化了的部分
 * @param data 变更后的数据
 * @param agoObj 历史(对比)数据
 * @returns
 */
export const getChangedData = <T extends Record<any, any>, K extends Record<any, any>>(
  data: T,
  agoObj: K
) => {
  const changedData = {} as T

  const keys: (keyof K)[] = Object.keys(data)
  keys.forEach((k) => {
    const newValue = data[k] as any
    if ((newValue === '' || newValue === null) && agoObj[k] === undefined) {
      return
    }

    if (newValue !== agoObj[k]) {
      changedData[k] = newValue
    }
  })

  return changedData
}

export const getBase64 = (file: Blob, callback: (base64Url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(file)
}

/**
 * 页面空闲检测
 * @param callback
 * @param timeout 时长，默认15s，单位：秒
 * @param immediate 是否立即开始，默认 false
 * @returns
 */
export function onIdleDetection(callback: () => void, timeout = 15, immediate = false) {
  let pageTimer: NodeJS.Timeout | undefined
  let beginTime = 0

  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer)
    pageTimer = undefined
  }
  const onStartTimer = () => {
    const currentTime = Date.now()
    // 避免频繁触发
    if (pageTimer && currentTime - beginTime < 100) {
      return
    }

    onClearTimer()
    beginTime = currentTime
    pageTimer = setTimeout(() => {
      callback()
    }, timeout * 1000)
  }
  // 处理标签页隐藏后再显示引起的精度问题
  const onPageVisibility = () => {
    onClearTimer()

    if (document.visibilityState === 'visible') {
      const currentTime = Date.now()
      if (currentTime - beginTime >= timeout * 1000) {
        callback()
        return
      }

      pageTimer = setTimeout(
        () => {
          callback()
        },
        timeout * 1000 - (currentTime - beginTime)
      )
    }
  }

  const startDetection = () => {
    onStartTimer()
    document.addEventListener('keydown', onStartTimer)
    document.addEventListener('mousemove', onStartTimer)
    document.addEventListener('visibilitychange', onPageVisibility)
  }

  const stopDetection = () => {
    onClearTimer()
    document.removeEventListener('keydown', onStartTimer)
    document.removeEventListener('mousemove', onStartTimer)
    document.removeEventListener('visibilitychange', onPageVisibility)
  }

  const restartDetection = () => {
    onClearTimer()
    onStartTimer()
  }

  if (immediate) {
    startDetection()
  }

  return {
    startDetection,
    stopDetection,
    restartDetection
  }
}

export function deepMap<T extends Record<string, any>>(
  data: T[],
  callback: (value: T) => T,
  childrenKey = 'children'
) {
  return data.map((item) => {
    const value = callback(item)

    if (value[childrenKey]) {
      // @ts-ignore
      value[childrenKey] = deepMap(value[childrenKey], callback, childrenKey)
    }

    return value
  })
}

export const filterEmoji = (value: string) => {
  const regexp =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

  return value.replace(regexp, '')
}
