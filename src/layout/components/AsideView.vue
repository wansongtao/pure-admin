<script lang="ts" setup>
import { useAppSetStore } from '@/stores/appSet'

const { collapsed, asideMenus } = storeToRefs(useAppSetStore())

const router = useRouter()
const onJumpPage = (path: string) => {
  router.push(path)
}

const activeKey = ref<string>('')
watch(
  () => router.currentRoute.value.path,
  (path) => {
    if (activeKey.value === path) {
      return
    }

    activeKey.value = path
  },
  { immediate: true }
)
</script>

<template>
  <n-layout-sider
    bordered
    :native-scrollbar="false"
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
  >
    <n-menu
      v-model:value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="asideMenus"
      @update:value="onJumpPage"
    />
  </n-layout-sider>
</template>

<style lang="scss" scoped></style>
