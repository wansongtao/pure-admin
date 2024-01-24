<script lang="ts" setup>
import AvatarDropdown from './AvatarDropdown.vue';
import BreadCrumb from './BreadCrumb.vue';
import SwitchTheme from './SwitchTheme.vue';

defineOptions({
  name: 'HeaderView'
})
</script>

<template>
  <header class="header flex">
    <div class="flex">
      <ButtonCollapsed />
      <BreadCrumb />
    </div>
    <div class="flex">
      <ScreenFull />
      <SwitchTheme />
      <AvatarDropdown />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: var(--st-header-h);
  border-bottom: 1px solid var(--st-c-divider);
}

.flex {
  display: flex;
}
</style>