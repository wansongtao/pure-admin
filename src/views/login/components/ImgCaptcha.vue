<script lang="ts" setup>
import { getCaptcha } from '@/api/common'
import { debounce } from '@/utils'

const isRefresh = defineModel<boolean>()
const img = ref<string>('')
const getCaptchaImg = debounce(async () => {
  const { result } = await getCaptcha()
  img.value = result?.data ?? ''
  isRefresh.value = false
}, 400)

watch(
  () => isRefresh.value,
  (val) => {
    if (val) {
      getCaptchaImg()
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <img :src="img" alt="captcha" class="code" @click="getCaptchaImg" />
</template>

<style lang="scss" scoped>
.code {
  width: 100%;
  height: 32px;
  cursor: pointer;
}
</style>
