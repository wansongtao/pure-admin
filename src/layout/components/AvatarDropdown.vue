<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue'

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const router = useRouter()
const logout = () => {
  userStore.logout().then(() => {
    router.push('/login')
  })
}

const handlePersonalPage = () => {
  router.push('/profile')
}
</script>

<template>
  <a-dropdown placement="bottom" arrow>
    <div class="dropdown">
      <div>
        <img :src="userInfo.avatar" alt="" class="avatar" />
      </div>
      <div class="name">{{ userInfo.name }}</div>
      <down-outlined :style="{ fontSize: '14px', color: 'var(--st-c-icon)' }" />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <a href="https://github.com/wansongtao/admin-pure" target="_blank">代码仓库</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;" @click="handlePersonalPage">个人中心</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;" @click="logout">退出登录</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped>
.dropdown {
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
}

.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.name {
  margin: 0 4px;
  color: var(--st-c-text-2);
  font-size: 14px;
}
</style>
