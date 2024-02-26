<script lang="ts" setup>
import { CloseOutlined } from '@ant-design/icons-vue'

import { throttle } from '@/utils/index'
import { useSettingStore } from '@/stores/setting'

import type { ITagLinkItem } from '@/types/index'

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

const tags = ref<ITagLinkItem[]>([])
const tagLinks = localStorage.getItem('tagLinks')
if (tagLinks) {
  tags.value = JSON.parse(tagLinks)
}
window.onbeforeunload = () => {
  localStorage.setItem('tagLinks', JSON.stringify(tags.value))
}

const setStore = useSettingStore()
watch(
  () => setStore.defaultTagLinks,
  (defaultTagLinks) => {
    if (!tags.value.length) {
      tags.value = defaultTagLinks
      return
    }

    tags.value = tags.value.filter((item) => {
      return !defaultTagLinks.some((defaultItem) => isEqual(item, defaultItem))
    })

    tags.value.unshift(...defaultTagLinks)
  },
  {
    immediate: true
  }
)

const route = useRoute()
watch(
  () => route.fullPath,
  (fullPath) => {
    const title = (route.meta.title as string) || (route.name as string)
    if (!title) {
      return
    }

    tags.value.forEach((item) => {
      if (item.checked) {
        item.checked = false
      }
    })

    const path = route.path
    const tag = tags.value.find((item) => isEqual(item, { path, title }))
    if (tag) {
      tag.path = fullPath
      tag.checked = true
      return
    }

    tags.value.push({
      title,
      path: route.fullPath,
      checked: true
    })
  },
  {
    immediate: true
  }
)

const router = useRouter()
const onClose = (index: number) => {
  const tag = tags.value.splice(index, 1)

  if (tag[0].checked) {
    const lastTag = tags.value[index - 1]
    if (lastTag) {
      lastTag.checked = true
      router.push(lastTag.path)
    }
  }
}
</script>

<template>
  <div ref="scrollElement" class="scrollbar-wrap" @wheel="onWheel">
    <div class="scrollbar">
      <transition-group name="tags">
        <tag-link
          v-for="(item, idx) in tags"
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
