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
  <div class="base-breadcrumb">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="(item, idx) in routes" :key="item.path">
        <router-link :to="item.path" v-if="idx !== routes.length - 1">{{ item.title }}</router-link>
        <span v-else>{{ item.title }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.base-breadcrumb {
  margin-left: 20px;
}
</style>
