<script lang="ts" setup>
import DeleteIcon from '@/assets/svgs/icons/delete.svg'
import UploadIcon from '@/assets/svgs/icons/upload.svg'

import { getFileBase64 } from '@/utils'
import { uploadFile, getPresignedUrl } from '@/api/upload'
import { updateProfile } from '@/api/common'
import { useUserStore } from '@/stores/user'

import type { UploadFileInfo } from 'naive-ui'

const $props = defineProps<{
  url?: string
}>()

const avatar = ref<string>()

onActivated(() => {
  avatar.value = $props.url
})

const previewFile = (file: File) => {
  getFileBase64(file, (base64Url: string) => {
    if (avatar.value) {
      return
    }

    avatar.value = base64Url
  })
}

watch(
  () => $props.url,
  (newUrl) => {
    avatar.value = newUrl
  },
  { immediate: true }
)

const uploadElement = useTemplateRef('uploadRef')

const onRemove = () => {
  avatar.value = ''
  uploadElement.value?.clear()
}

const uploadAvatar = async (file: File) => {
  const [, result] = await getPresignedUrl(file.name)
  if (!result) {
    avatar.value = $props.url
    window.$message.error('获取上传地址失败')
    return
  }

  const url = result.data
  const uploadRes = await uploadFile(url, file).catch((err) => {
    return new Error(err)
  })

  if (uploadRes instanceof Error) {
    avatar.value = $props.url
    window.$message.error('上传头像失败')
    return
  }

  const avatarUrl = url.replace(/\?.*/, '')
  const [err] = await updateProfile({ avatar: avatarUrl })
  if (err) {
    avatar.value = $props.url
    window.$message.error('修改头像失败')
    return
  }

  avatar.value = avatarUrl
  uploadElement.value?.clear()
  window.$message.success('修改头像成功')

  const userStore = useUserStore()
  userStore.userInfo.avatar = avatarUrl
}

const verifyFileSize = (file: File, maxSize = 2 * 1024 * 1024) => {
  const isLt2M = file.size < maxSize
  if (!isLt2M) {
    return false
  }

  return true
}

const beforeUpload = (data: { file: UploadFileInfo }) => {
  const { file } = data
  const imgFile = file.file
  if (!imgFile) {
    return false
  }

  const isLt2M = verifyFileSize(imgFile)
  if (!isLt2M) {
    return false
  }

  previewFile(imgFile)

  uploadAvatar(imgFile)

  return false
}
</script>

<template>
  <div class="user-avatar">
    <n-upload
      ref="uploadRef"
      :max="1"
      accept="image/jpeg,image/png,image/jpg,image/gif"
      :show-file-list="false"
      :default-upload="false"
      @before-upload="beforeUpload"
    >
      <div class="upload-main">
        <n-avatar v-show="avatar" :size="66" circle :src="avatar"></n-avatar>
        <div v-show="avatar" class="mask" @click.stop>
          <div class="delete-btn" @click="onRemove">
            <delete-icon />
          </div>
        </div>

        <div class="upload-btn" v-show="!avatar">
          <upload-icon />
        </div>
      </div>
    </n-upload>
  </div>
</template>

<style lang="scss" scoped>
.upload-main {
  position: relative;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 66px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
    cursor: default;

    .delete-btn {
      cursor: pointer;
    }
  }

  &:hover .mask {
    opacity: 1;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px dashed #d9d9d9;
  }
}
</style>
