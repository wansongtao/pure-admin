<script lang="ts" setup>
import UserAvatar from './UserAvatar.vue'
import GenderMIcon from '@/assets/svgs/icons/gender-m.svg'
import GenderWIcon from '@/assets/svgs/icons/gender-w.svg'
import GenderIcon from '@/assets/svgs/icons/intersex.svg'
import UserIcon from '@/assets/svgs/icons/user.svg'
import RoleIcon from '@/assets/svgs/menus/role.svg'
import BirthdayIcon from '@/assets/svgs/icons/birthday.svg'
import PhoneIcon from '@/assets/svgs/icons/phone.svg'
import EmailIcon from '@/assets/svgs/icons/email.svg'

import type { IProfile } from '@/types/api/common'

const { profile } = defineProps<{
  profile: IProfile
}>()
</script>

<template>
  <n-card style="border-radius: 12px">
    <n-flex vertical align="center">
      <user-avatar :url="profile.avatar" />
      <div class="title">{{ profile.nickName || profile.userName }}</div>
      <div class="user-info">
        <div class="user-info-item">
          <div class="icon">
            <gender-m-icon v-if="profile.gender === 'MA'" />
            <gender-w-icon v-if="profile.gender === 'FE'" />
            <gender-icon v-if="profile.gender === 'OT'" />
          </div>
          <div>{{ profile.gender === 'FE' ? '女' : profile.gender === 'MA' ? '男' : '其他' }}</div>
        </div>
        <div class="user-info-item">
          <div class="icon"><user-icon /></div>
          <div>{{ profile.userName }}</div>
        </div>
        <div class="user-info-item">
          <div class="icon"><role-icon /></div>
          <div class="content">
            <n-flex size="small">
              <n-tag size="small" v-for="role in profile.roles" :key="role">{{ role }}</n-tag>
            </n-flex>
            <template v-if="!profile.roles?.length">--</template>
          </div>
        </div>
        <div class="user-info-item">
          <div class="icon"><birthday-icon /></div>
          <div>{{ profile.birthday ?? '--' }}</div>
        </div>
        <div class="user-info-item">
          <div class="icon"><phone-icon /></div>
          <div>{{ profile.phone ?? '--' }}</div>
        </div>
        <div class="user-info-item">
          <div class="icon"><email-icon /></div>
          <div>{{ profile.email ?? '--' }}</div>
        </div>
      </div>
    </n-flex>
  </n-card>
</template>

<style lang="scss" scoped>
.title {
  font-size: 20px;
}

.user-info {
  margin-top: 10px;

  .user-info-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 16px;

    .icon {
      margin-right: 10px;
    }

    .content {
      max-width: 80%;
    }
  }
}
</style>
