<script lang="ts" setup></script>

<template>
  <n-card
    style="height: 100%; border-radius: 12px"
    :bordered="false"
    content-style="display: flex;flex-direction: column;padding: 20px;"
  >
    <slot />
  </n-card>
</template>

<style lang="scss" scoped></style>
