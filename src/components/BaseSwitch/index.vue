<script lang="ts" setup>
import { throttle } from '@/utils/index'

defineOptions({
  name: 'BaseSwitch'
})

const $props = withDefaults(defineProps<{ delay?: number }>(), {
  delay: 0
})

const $emit = defineEmits<{
  onChange: [isChecked: boolean]
}>()

const checked = defineModel<boolean>({ default: false })
const changeStatus = () => {
  checked.value = !checked.value
  $emit('onChange', checked.value)
}
const handleChangeStatus = $props.delay ? throttle(changeStatus, $props.delay) : changeStatus
</script>

<template>
  <button class="base-switch" @click="handleChangeStatus">
    <span class="switch-check" :class="checked ? 'switch-check--active' : ''">
      <span class="switch-icon">
        <slot :checked="checked">
          <icon-sun v-show="!checked" />
          <icon-moon v-show="checked" />
        </slot>
      </span>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.base-switch {
  position: relative;
  display: block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 11px;
  border: 1px solid var(--st-c-divider);
  background-color: var(--st-c-bg-mute);
  transition: border-color 0.25s, background-color 0.25s;

  &:hover {
    border-color: var(--st-c-gray);
  }

  .switch-check {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    color: var(--st-c-text-1);
    border-radius: 50%;
    background-color: var(--st-c-bg);
    box-shadow: var(--st-shadow-1);
    transition: all 0.25s;
  }

  .switch-check--active {
    transform: translateX(18px);
  }

  .vt-switch-icon {
    position: relative;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
