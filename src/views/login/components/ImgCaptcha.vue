<script lang="ts" setup>
import { getCaptcha } from '@/api/common'
import { debounce } from '@/utils'

const isRefresh = defineModel<boolean>()
const img = ref<string>('')
const onGetCaptchaImg = debounce(async () => {
  const [, result] = await getCaptcha()
  img.value = result?.data?.captcha ?? ''
  isRefresh.value = false
}, 400)

watch(
  isRefresh,
  (val) => {
    if (!val) {
      return
    }

    onGetCaptchaImg()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <img :src="img" alt="captcha" class="code" @click="onGetCaptchaImg" />
</template>

<style lang="scss" scoped>
.code {
  width: 100%;
  height: 32px;
  cursor: pointer;
}
</style>
