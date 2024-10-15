<script lang="ts" setup>
import IconUser from '@/assets/svgs/icons/user.svg?component'
import IconGithub from '@/assets/svgs/icons/github.svg?component'
import IconLogout from '@/assets/svgs/icons/logout.svg?component'

import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const options = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/profile'
          }
        },
        { default: () => '个人中心' }
      ),
    key: 'profile',
    icon: () => h(IconUser)
  },
  {
    label: () =>
      h('a', { href: 'https://github.com/wansongtao/blog-admin-next', target: '_blank' }, 'GitHub'),
    key: 'github',
    icon: () => h(IconGithub)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(IconLogout)
  }
]

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const router = useRouter()
const onSelect = async (key: string) => {
  if (key !== 'logout') {
    return
  }

  await userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <n-dropdown :options="options" show-arrow @select="onSelect">
    <div class="user-center">
      <n-avatar round :size="24" :src="userInfo.avatar">
        <icon-user v-if="!userInfo.avatar" />
        <template #fallback>
          <n-icon :size="24"><icon-user /></n-icon>
        </template>
      </n-avatar>
      <span>{{ userInfo.name }}</span>
    </div>
  </n-dropdown>
</template>

<style lang="scss" scoped>
.user-center {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  cursor: pointer;

  span {
    margin-left: 8px;
  }
}
</style>
