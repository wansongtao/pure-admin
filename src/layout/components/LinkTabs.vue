<script lang="ts" setup>
import { CloseOutlined } from '@ant-design/icons-vue'

import { throttle } from '@/utils/index'

import type { ILinkTab } from '@/types/index'

const key = 'link-tabs'
const getHistoryTabs = () => {
  const tabs = localStorage.getItem(key)
  if (!tabs) {
    return []
  }

  try {
    return JSON.parse(tabs) as ILinkTab[]
  } catch (e) {
    return []
  }
}
const setHistoryTabs = (tabs: ILinkTab[]) => {
  localStorage.setItem(key, JSON.stringify(tabs))
}

const scrollElement = ref<HTMLElement | null>(null)
const onWheel = throttle((e: WheelEvent) => {
  scrollElement.value!.scrollLeft += e.deltaY * 0.5
}, 100)

type Item = {
  path: string
  title: string
}
const isEqual = (a: Item, b: Item) => {
  // 判断title是为了解决动态路由(/example/:id)的问题，也不想存在多个一样title的tagLink
  if (a.path === b.path || a.title === b.title) {
    return true
  }

  return false
}

const defaultLinkTabs = {
  title: '首页',
  path: '/',
  hiddenCloseIcon: true,
  checked: true
}

const linkTabs = ref<ILinkTab[]>([])
linkTabs.value = getHistoryTabs()
if (!linkTabs.value.length) {
  linkTabs.value.push({ ...defaultLinkTabs })
}

const route = useRoute()
watch(
  () => route.fullPath,
  (fullPath) => {
    const title = (route.meta.title as string) || (route.name as string)
    if (!title) {
      return
    }

    linkTabs.value.forEach((item) => {
      if (item.checked) {
        item.checked = false
      }
    })

    const path = route.path
    const tab = linkTabs.value.find((item) => isEqual(item, { path, title }))
    if (tab) {
      tab.path = fullPath
      tab.checked = true
    } else {
      linkTabs.value.push({
        title,
        path: route.fullPath,
        checked: true
      })
    }

    setHistoryTabs(linkTabs.value)
  },
  {
    immediate: true
  }
)

const router = useRouter()
const onClose = (index: number) => {
  const tab = linkTabs.value.splice(index, 1)

  if (tab[0].checked) {
    const prevTab = linkTabs.value[index - 1]
    if (prevTab) {
      prevTab.checked = true
      router.push(prevTab.path)
    }
  }
}

router.afterEach((to) => {
  if (to.name === 'Login') {
    setHistoryTabs([defaultLinkTabs])
  }
})
</script>

<template>
  <div ref="scrollElement" class="scrollbar-wrap" @wheel="onWheel">
    <div class="scrollbar">
      <transition-group name="tags">
        <tag-link
          v-for="(item, idx) in linkTabs"
          :key="item.title"
          :title="item.title"
          :checked="item.checked"
          :path="item.path"
        >
          <div v-if="!item.hiddenCloseIcon" class="icon--close" @click.stop="onClose(idx)">
            <close-outlined />
          </div>
        </tag-link>
      </transition-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrollbar-wrap {
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0px;
  }
}

.scrollbar {
  display: flex;
  box-sizing: border-box;
  padding-top: 4px;
  width: 100%;
  height: var(--st-scrollbar-h);
  border-bottom: 1px solid var(--st-c-divider);

  .icon--close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;

    &:hover {
      color: var(--st-c-text-3);
      background-color: #79bbff;
    }
  }
}

.tags-move, /* 对移动中的元素应用的过渡 */
.tags-enter-active,
.tags-leave-active {
  transition: all 0.5s ease;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.tags-leave-active {
  position: absolute;
}
</style>
