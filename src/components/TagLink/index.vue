<script lang="ts" setup>
defineOptions({
  name: 'TagLink'
})

defineProps<{
  title: string
  path: string
  checked?: boolean
}>()
</script>

<template>
  <div class="v-tag" :class="checked ? 'v-tag--checked' : ''">
    <div class="v-tag-icon">
      <div class="v-tag-left v-tag-box"></div>
    </div>
    <div class="v-tag-inner" @click="$router.push(path)">
      {{ title }}
      <slot />
    </div>
    <div class="v-tag-icon">
      <div class="v-tag-right v-tag-box"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-tag {
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--st-c-text-2);
  background-color: var(--st-c-bg);
  transition: var(--st-t-bg), var(--st-t-c);

  &:hover {
    .v-tag-icon {
      background-color: var(--st-c-tag-checked);
    }

    .v-tag-inner {
      background-color: var(--st-c-tag-checked);
    }
  }

  .v-tag-icon {
    width: 10px;
    height: 100%;

    .v-tag-box {
      width: 100%;
      height: 100%;
      background-color: var(--st-c-bg);
      transition: var(--st-t-bg);
    }
  }

  .v-tag-left {
    border-radius: 0 0 12px 0;
  }

  .v-tag-right {
    border-radius: 0 0 0 12px;
  }

  .v-tag-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    height: 100%;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
  }
}

.v-tag--checked {
  color: var(--st-c-text-checked);

  .v-tag-icon {
    background-color: var(--st-c-tag-checked);
  }

  .v-tag-inner {
    background-color: var(--st-c-tag-checked);
  }
}
</style>
