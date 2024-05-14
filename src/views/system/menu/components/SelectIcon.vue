<script lang="ts" setup>
import MENU_ICON_MAP from '@/plugins/importMenuIcons'

const name = defineModel<string>()
const handleCheck = (key: string) => {
  name.value = key
}

const open = ref(false)
const handleOpen = () => {
  open.value = true
}
const handleClose = () => {
  open.value = false
}
</script>

<template>
  <div class="select" v-click-outside="handleClose">
    <a-input v-model:value="name" allow-clear @focus="handleOpen" >
      <template #prefix v-if="name">
        <component :is="MENU_ICON_MAP[name]" />
      </template>
    </a-input>
    <div class="select_popup" v-show="open">
      <a-row :gutter="[0, 8]">
        <a-col v-for="(value, key) of MENU_ICON_MAP" :key="key" :span="6">
          <div
            class="select_item"
            :class="{
              'select_item--checked': name === key
            }"
            @click="handleCheck(key)"
          >
            <div class="text"><component :is="value" /></div>
            <div class="text">{{ key }}</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;

  .select_popup {
    position: absolute;
    top: 38px;
    left: 0;
    right: 0;
    z-index: 99;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    padding: 4px;
    border-radius: 8px;
    background-color: var(--st-c-bg);
    box-shadow:
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }

  .select_item {
    padding: 0 4px;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background-color: var(--st-c-menu-active);
    }
  }

  .select_item--checked {
    font-weight: 600;
    background-color: var(--st-c-menu-checked) !important;
  }

  .text {
    font-size: 14px;
    text-align: center;
    color: var(--st-c-text-1);
  }
}
</style>
