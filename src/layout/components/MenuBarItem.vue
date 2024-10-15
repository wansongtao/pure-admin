<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { useAppSetStore } from '@/stores/appSet'

const $props = defineProps<{
  title: string
  path: string
  checked?: boolean
}>()

const appSetStore = useAppSetStore()
const { theme } = storeToRefs(appSetStore)
const activeColor = computed(() => {
  return theme.value === 'light' ? 'rgba(24, 160, 88, 0.1)' : 'rgba(99, 226, 183, 0.15)'
})

const elementRef = useTemplateRef('elementRef')
const scrollElement = () => {
  elementRef.value?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
}

watch(
  () => $props.checked,
  (checked) => {
    if (!checked) {
      return
    }
    scrollElement()
  }
)

onMounted(() => {
  if (!$props.checked) {
    return
  }
  scrollElement()
})

const themeVars = useThemeVars()
</script>

<template>
  <div ref="elementRef" class="menubar-item" :class="{ 'menubar-item--checked': checked }">
    <div class="menubar-item-icon">
      <div class="left full base-transition"></div>
    </div>
    <div class="menubar-item-text" @click="$router.push(path)">
      {{ title }}
      <slot />
    </div>
    <div class="menubar-item-icon">
      <div class="right full base-transition"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menubar-item {
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;

  .menubar-item-icon {
    width: 10px;
    height: 100%;
  }

  .menubar-item-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    height: 100%;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
  }

  &:hover {
    .menubar-item-icon {
      background-color: v-bind('themeVars.hoverColor');
    }

    .menubar-item-text {
      background-color: v-bind('themeVars.hoverColor');
    }
  }
}

.menubar-item--checked {
  color: v-bind('themeVars.primaryColor');

  .menubar-item-icon {
    background-color: v-bind('activeColor');
  }

  .menubar-item-text {
    background-color: v-bind('activeColor');
  }

  &:hover {
    .menubar-item-icon {
      background-color: v-bind('activeColor');
    }

    .menubar-item-text {
      background-color: v-bind('activeColor');
    }
  }
}

.full {
  width: 100%;
  height: 100%;
  background-color: v-bind('themeVars.cardColor');
}

.left {
  border-radius: 0 0 12px 0;
}

.right {
  border-radius: 0 0 0 12px;
}
</style>
