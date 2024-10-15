<script lang="ts" setup>
import { getCaptcha } from '@/api/common'
import { debounce } from '@/utils'

const src = ref('')
const onRefreshCaptcha = debounce<MouseEvent>(
  async () => {
    const [, res] = await getCaptcha()
    if (!res) return

    src.value = res.data.captcha
  },
  400,
  true
)

onMounted(() => {
  onRefreshCaptcha()
})

defineExpose({
  onRefreshCaptcha
})
</script>

<template>
  <div class="captcha">
    <img :src alt="captcha" @click="onRefreshCaptcha" />
  </div>
</template>

<style lang="scss" scoped>
.captcha {
  width: 100%;
  height: 34px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
