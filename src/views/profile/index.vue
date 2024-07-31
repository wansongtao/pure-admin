<script lang="ts" setup>
import UserCard from './components/UserCard.vue'
import UserInfoForm from './components/UserInfoForm.vue'
import PasswordForm from './components/PasswordForm.vue'

import { useRouteQuery } from '@vueuse/router'
import { getProfile } from '@/api/common'

import type { IProfile, IProfileParam } from '@/types/api/common'

defineOptions({
  name: 'ProfileView'
})

const profile = ref<IProfile>({
  userName: '',
  roles: [],
  gender: 'OT'
})

const handleChangeProfile = (data: IProfileParam) => {
  profile.value = { ...profile.value, ...data }
}

const requestProfile = async () => {
  const [, result] = await getProfile()
  if (!result) {
    return
  }
  profile.value = result.data
}
requestProfile()

type IKey = 'info' | 'pwd'
const tabList: { key: IKey; tab: string }[] = [
  { key: 'info', tab: '个人信息修改' },
  { key: 'pwd', tab: '密码修改' }
]

const key = useRouteQuery<IKey>('key', 'info')
const onTabChange = (value: string) => {
  key.value = value as IKey
}
</script>

<template>
  <div class="profile">
    <a-row :gutter="20">
      <a-col :span="8">
        <user-card :user="profile" />
      </a-col>
      <a-col :span="16">
        <a-card
          style="width: 100%"
          :tab-list="tabList"
          :active-tab-key="key"
          @tabChange="onTabChange"
        >
          <div class="h-animate" :style="key === 'pwd' ? 'height: 200px;' : 'height: 434px;'">
            <user-info-form
              v-show="key === 'info'"
              :details="profile"
              @on-change="handleChangeProfile"
            />

            <password-form v-show="key === 'pwd'" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.profile {
  padding: 20px;
}

.h-animate {
  overflow: hidden;
  transition: height ease-in-out 0.3s;
}
</style>
