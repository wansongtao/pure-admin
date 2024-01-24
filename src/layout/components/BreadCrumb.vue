<script lang="ts" setup>
const routes = ref<{ path: string; title: string }[]>([])
const route = useRoute()

watch(
  () => route.matched,
  (data) => {
    if (!data?.length) {
      return
    }

    routes.value = []
    data.forEach((item, index) => {
      if (index === 0) {
        return
      }

      routes.value.push({
        path: item.path,
        title: (item.meta.title as string) || (item.meta.name as string)
      })
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="breadcrumb flex items-center">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, idx) in routes" :key="item.path">
        <router-link :to="item.path" v-if="idx !== routes.length - 1">{{ item.title }}</router-link>
        <span v-else>{{ item.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-breadcrumb li:last-child) {
  color: var(--st-c-text-1);
}
:deep(.ant-breadcrumb a) {
  color: var(--st-c-text-2);
}
:deep(.ant-breadcrumb a:hover) {
  color: var(--st-c-text-checked);
  background-color: transparent;
}
:deep(.ant-breadcrumb .ant-breadcrumb-separator) {
  color: var(--st-c-text-2);
}
</style>
