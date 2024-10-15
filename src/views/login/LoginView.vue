<script lang="ts" setup>
import IconWater from '@/assets/svgs/icons/water.svg'
import IconUser from '@/assets/svgs/icons/user.svg'
import IconPassword from '@/assets/svgs/icons/password.svg'
import IconCaptcha from '@/assets/svgs/icons/captcha.svg'
import ImgCaptcha from './components/ImgCaptcha.vue'
import { lightTheme } from 'naive-ui'

import { validateUsername, validatePassword } from '@/utils/validate'
import useFormValidate from '@/hooks/useFormValidate'
import { useUserStore } from '@/stores/user'

import type { ILoginParams } from '@/types/api/common'
import type { IRule } from '@/types'

const rules: IRule<ILoginParams> = {
  userName: [
    {
      required: true,
      validator: validateUsername,
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      validator: validatePassword,
      trigger: ['input', 'blur']
    }
  ],
  captcha: [
    {
      required: true,
      validator: (_rule, value: string) => {
        if (!value) {
          return new Error('请输入验证码')
        }

        const regexp = /^[a-zA-Z0-9]{4}$/
        if (!regexp.test(value)) {
          return new Error('验证码格式错误')
        }

        return true
      },
      trigger: ['input', 'blur']
    }
  ]
}

const { formRef, validateForm } = useFormValidate()
const formData = ref<ILoginParams>({
  userName: '',
  password: '',
  captcha: ''
})

const disabled = computed(() => {
  return !formData.value.userName || !formData.value.password || !formData.value.captcha
})

const captchaRef = useTemplateRef('captchaRef')
const loading = ref(false)
const router = useRouter()

const onLogin = async () => {
  const isValid = await validateForm()
  if (!isValid) return

  loading.value = true
  const userStore = useUserStore()
  const isSuccess = await userStore.login(formData.value)
  loading.value = false

  if (!isSuccess) {
    captchaRef.value?.onRefreshCaptcha()
    return
  }

  router.push('/')
}
</script>

<template>
  <div class="login">
    <div class="login-left">
      <div class="login-left-head">
        <div class="login-left-title">博客后台系统</div>
        <div class="login-left-desc">
          时间吞噬一切，记忆将之重组还原。那些旧日的好时光，让一切往事都值得回忆，也让未来的一切都值得期待。
        </div>
      </div>
      <img src="@/assets/images/login-logo.png" alt="" class="login-left-logo" />
      <icon-water class="login-left-wave" />
    </div>
    <main class="login-right">
      <div class="login-right-wrap">
        <div class="right-wrap-title">账号登录</div>
        <n-config-provider :theme="lightTheme">
          <n-form ref="formRef" :model="formData" :rules="rules" :show-label="false">
            <n-form-item path="userName">
              <n-input v-model:value="formData.userName" placeholder="请输入用户名">
                <template #prefix>
                  <icon-user />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password">
              <n-input
                v-model:value="formData.password"
                type="password"
                show-password-on="click"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <icon-password />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="captcha">
              <n-row :gutter="20">
                <n-col :span="16">
                  <n-input
                    v-model:value="formData.captcha"
                    placeholder="请输入验证码"
                    @keydown.enter.prevent="onLogin"
                  >
                    <template #prefix>
                      <icon-captcha />
                    </template>
                  </n-input>
                </n-col>
                <n-col :span="8">
                  <img-captcha ref="captchaRef" />
                </n-col>
              </n-row>
            </n-form-item>
            <n-button style="margin-top: 20px" type="info" block :loading :disabled @click="onLogin"
              >登录</n-button
            >
          </n-form>
        </n-config-provider>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  min-width: 1200px;
  height: 100vh;
}

.login-left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 100vh;
  background-color: #d3efff;

  .login-left-head {
    position: absolute;
    top: 40px;
    left: 60px;
    color: #26a59a;

    .login-left-title {
      font-size: 36px;
      font-weight: bold;
    }

    .login-left-desc {
      margin-top: 20px;
      font-size: 16px;
      line-height: 1.5em;
    }
  }

  .login-left-logo {
    width: 60%;
  }

  .login-left-wave {
    position: absolute;
    top: 0;
    right: -100px;
    background-color: #fff;
  }
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-left: 100px;
  background-color: #fff;

  .login-right-wrap {
    position: relative;
    box-sizing: border-box;
    width: 400px;
    min-height: 400px;
    padding: 20px 40px;
    border: 1px solid #79bbff;
    border-radius: 4px;

    .right-wrap-title {
      margin: 20px 0 40px 0;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 5px solid;
      animation: clippath 8s infinite linear;
    }
  }
}

@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 99% 0 0);
    border-image: linear-gradient(to left, #feb692 10%, #ea5455 100%) 1;
  }
  25% {
    clip-path: inset(0 0 99% 0);
    border-image: linear-gradient(135deg, #81fbb8 10%, #28c76f 100%) 1;
  }
  50% {
    clip-path: inset(0 0 0 99%);
    border-image: linear-gradient(135deg, #5efce8 10%, #736efe 100%) 1;
  }
  75% {
    clip-path: inset(99% 0 0 0);
    border-image: linear-gradient(to left, #fdeb71 10%, #f8d800 100%) 1;
  }
}
</style>
