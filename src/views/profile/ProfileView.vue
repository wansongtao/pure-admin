<script lang="ts" setup>
import UserCard from './components/UserCard.vue'
import FormUser from './components/FormUser.vue'
import FormPassword from './components/FormPassword.vue'

import { getProfile } from '@/api/common'
import { useUserStore } from '@/stores/user'
import { useRouteQuery } from '@vueuse/router'

import type { IProfile, IProfileParam } from '@/types/api/common'

const profile = ref<IProfile>({
  userName: '',
  roles: [],
  gender: 'OT'
})

const fetchProfile = async () => {
  const [, result] = await getProfile()
  if (result) {
    profile.value = result.data
  }
}

fetchProfile()

const onUpdate = (data: IProfileParam) => {
  profile.value = { ...profile.value, ...data }

  if (data.nickName || data.nickName === null) {
    const userStore = useUserStore()
    userStore.userInfo.name = data.nickName ?? profile.value.userName
  }
}

const tabName = useRouteQuery('profile-tab', 'info')
</script>

<template>
  <n-grid x-gap="24">
    <n-gi :span="8"><user-card :profile /></n-gi>
    <n-gi :span="16">
      <n-card style="border-radius: 12px">
        <n-tabs v-model:value="tabName" type="line" animated>
          <n-tab-pane name="info" tab="编辑信息">
            <form-user :profile @success="onUpdate" />
          </n-tab-pane>
          <n-tab-pane name="password" tab="修改密码">
            <form-password />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<style lang="scss" scoped></style>
