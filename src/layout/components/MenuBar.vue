<script lang="ts" setup>
import IconClose from '@/assets/svgs/icons/close.svg'
import IconMore from '@/assets/svgs/icons/more.svg'
import MenuBarItem from './MenuBarItem.vue'
import { useThemeVars } from 'naive-ui'
import useScrollObserver from '@/hooks/useScrollObserver'
import { useAppSetStore } from '@/stores/appSet'

import type { IMenubarItem } from '@/types'

interface Item {
  path: string
  title: string
}

const { elementRef, scrollDirection, updateScrollDirection } = useScrollObserver()

const appSetStore = useAppSetStore()
const { menubarItems } = storeToRefs(appSetStore)

const initMenubarItems = () => {
  const items = menubarItems.value
  if (items.length === 0 || items[0].key !== '/') {
    items.push({
      label: '首页',
      key: '/',
      hiddenCloseIcon: true,
      checked: true
    })
  }
}
initMenubarItems()

const route = useRoute()
watch(
  () => route.fullPath,
  (fullPath) => {
    const title = (route.meta.title || route.name) as string
    if (!title) {
      return
    }

    menubarItems.value.forEach((item) => {
      if (item.checked) {
        item.checked = false
      }
    })

    const isEqual = (a: Item, b: Item) => {
      if (a.path === b.path || a.title === b.title) {
        return true
      }
      return false
    }

    const path = route.path
    const tab = menubarItems.value.find((item) =>
      isEqual({ title: item.label, path: item.key }, { path, title })
    )

    if (tab) {
      tab.key = fullPath
      tab.checked = true
      return
    }

    menubarItems.value.push({
      label: title,
      key: route.fullPath,
      checked: true
    })

    if (scrollDirection.value !== 'horizontal') {
      nextTick(() => {
        updateScrollDirection()
      })
    }
  },
  {
    immediate: true
  }
)

const router = useRouter()
const onRemove = (index: number) => {
  const tab = menubarItems.value.splice(index, 1)

  if (tab[0].checked) {
    const prevTab = menubarItems.value[index - 1]
    if (prevTab) {
      prevTab.checked = true
      router.push(prevTab.key)
    }
  }

  if (scrollDirection.value === 'horizontal') {
    nextTick(() => {
      updateScrollDirection()
    })
  }
}

const onSelect = (key: string) => {
  router.push(key)
}

const themeVars = useThemeVars()
</script>

<template>
  <div class="menubar-wrap">
    <div ref="elementRef" class="menubar base-transition">
      <transition-group name="menubar">
        <menu-bar-item
          v-for="(item, index) in menubarItems"
          :key="item.label"
          :title="item.label"
          :path="item.key"
          :checked="item.checked"
        >
          <template v-if="!item.hiddenCloseIcon">
            <div class="icon--close"><icon-close @click.stop="onRemove(index)" /></div>
          </template>
        </menu-bar-item>
      </transition-group>
    </div>
    <div class="menubar-more base-transition" v-if="scrollDirection === 'horizontal'">
      <n-dropdown
        style="height: 50vh; overflow: auto"
        :options="menubarItems.map((item: IMenubarItem) => ({ label: item.label, key: item.key }))"
        show-arrow
        @select="onSelect"
        ><icon-more
      /></n-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menubar-wrap {
  position: relative;

  .menubar-more {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 34px;
    font-size: 18px;
    background-color: v-bind('themeVars.cardColor');
    box-shadow: v-bind('themeVars.boxShadow2');
    cursor: pointer;
  }
}

.menubar {
  overflow-x: auto;
  display: flex;
  box-sizing: border-box;
  padding-top: 4px;
  padding-right: 35px;
  height: 34px;
  background-color: v-bind('themeVars.cardColor');

  &::-webkit-scrollbar {
    height: 0px;
  }

  .icon--close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;

    &:hover {
      background-color: v-bind('themeVars.iconColor');
    }
  }
}

.menubar-move,
.menubar-enter-active {
  transition: all 0.5s ease;
}

.menubar-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
