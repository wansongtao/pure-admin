<script lang="ts" setup>
import UserIcon from '@/assets/svg/menus/user.svg'
import RoleIcon from '@/assets/svg/menus/role.svg'
import PhoneIcon from '@/assets/svg/phone.svg'
import EmailIcon from '@/assets/svg/menus/email.svg'
import SexmIcon from '@/assets/svg/sexm.svg'
import SexwIcon from '@/assets/svg/sexw.svg'
import SexIcon from '@/assets/svg/intersex.svg'
import BirthdayIcon from '@/assets/svg/birthday.svg'
import UploadAvatar from '@/components/UploadAvatar/index.vue'

import { updateProfile } from '@/api/common'
import { message } from 'ant-design-vue'

import type { IProfile } from '@/types/api/common'

const $props = defineProps<{ user: IProfile }>()

const avatar = ref('')
watch(
  () => $props.user.avatar,
  (url) => {
    if (url) {
      avatar.value = url
    }
  }
)

const avatarRef = ref<InstanceType<typeof UploadAvatar>>()
const handleUpdateAvatar = async () => {
  const [err, avatar] = await avatarRef.value!.handleUpload()
  if (err) {
    message.error(err?.message || '头像上传失败')
    return
  }

  const [error] = await updateProfile({ avatar })
  if (error) {
    return
  }

  message.success('头像修改成功')
}
</script>

<template>
  <a-card>
    <div class="flex_center">
      <upload-avatar ref="avatarRef" v-model:imgUrl="avatar" @selectFile="handleUpdateAvatar" />
    </div>
    <p class="name">{{ user.nickName || user.userName }}</p>
    <p class="text" v-if="user.description">{{ user.description }}</p>
    <div class="profile_main">
      <div class="main_item text">
        <div class="item_label">
          <sex-icon v-if="user.gender === 'OT'" />
          <sexw-icon v-if="user.gender === 'MA'" />
          <sexm-icon v-if="user.gender === 'FE'" />
        </div>
        <div class="item_text">
          {{ user.gender === 'FE' ? '女' : user.gender === 'MA' ? '男' : '--' }}
        </div>
      </div>
      <div class="main_item text">
        <div class="item_label"><user-icon /></div>
        <div class="item_text">{{ user.userName }}</div>
      </div>
      <div class="main_item text">
        <div class="item_label"><role-icon /></div>
        <div class="item_text">{{ user?.roles.join(', ') }}</div>
      </div>
      <div class="main_item text">
        <div class="item_label"><birthday-icon /></div>
        <div class="item_text">{{ user.birthday || '--' }}</div>
      </div>
      <div class="main_item text">
        <div class="item_label"><phone-icon /></div>
        <div class="item_text">{{ user.phone || '--' }}</div>
      </div>
      <div class="main_item text">
        <div class="item_label"><email-icon /></div>
        <div class="item_text">{{ user.email || '--' }}</div>
      </div>
    </div>
  </a-card>
</template>

<style lang="scss" scoped>
.name {
  font-size: 20px;
  line-height: 2em;
  text-align: center;
  color: var(--st-c-text-1);
}

.text {
  line-height: 1.7em;
  text-align: center;
  color: var(--st-c-text-1);
}

.profile_main {
  padding-top: 15px;
  margin: 0 auto;
  width: 60%;
}

.main_item {
  display: flex;

  .item_label {
    margin-right: 15px;
    flex-shrink: 0;
  }

  .item_text {
    flex: 1;
    text-align: left;
  }
}
</style>
