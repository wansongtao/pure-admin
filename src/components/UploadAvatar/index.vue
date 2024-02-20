<script lang="ts" setup>
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

import { getBase64 } from '@/utils/index'
import { uploadFile } from '@/api/common'

import type { UploadProps } from 'ant-design-vue'
import type { FileType } from 'ant-design-vue/es/upload/interface'

defineOptions({
  name: 'UploadAvatar'
})

const imgUrl = defineModel<string>('imgUrl', { default: '' })

const verifyFileSize = (file: FileType, maxSize = 2 * 1024 * 1024) => {
  const isLt2M = file.size < maxSize
  if (!isLt2M) {
    return false
  }

  return true
}

let imgFile: FileType | null = null
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const result = verifyFileSize(file)
  if (!result) {
    message.error('不能上传超过2MB大小的头像!')
    return
  }

  imgFile = file
  getBase64(file, (base64Url: string) => {
    imgUrl.value = base64Url
  })

  return false
}

const handleRemove = () => {
  imgFile = null
  imgUrl.value = ''
}

const handleUpload = () => {
  return new Promise<string>((resolve, reject) => {
    if (!imgFile) {
      reject('file undefined')
      return
    }
    const isLt2M = verifyFileSize(imgFile)
    if (!isLt2M) {
      reject('Image must smaller than 2MB!')
      return
    }

    uploadFile(imgFile).then((data) => {
      const { result, error } = data
      if (error) {
        reject(error)
        return
      }

      imgUrl.value = result!.data
      imgFile = null
      resolve(result!.data)
    })
  })
}

defineExpose({
  handleUpload
})
</script>

<template>
  <a-upload
    name="avatar"
    action=""
    accept="image/jpeg,image/png,image/jpg,image/gif"
    :max-count="1"
    :file-list="[]"
    :before-upload="beforeUpload"
  >
    <div class="avatar flex_center" :class="imgUrl ? '' : 'avatar--border'">
      <img v-if="imgUrl" :src="imgUrl" alt="avatar" class="avatar_img" />
      <plus-outlined v-else />

      <div v-if="imgUrl" class="avatar_mask flex_center">
        <delete-outlined @click.stop="handleRemove" />
      </div>
    </div>
  </a-upload>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    border-color: #3875f6;
  }

  .avatar_img {
    width: 100%;
  }

  .avatar_mask {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: rgba($color: #000000, $alpha: 0.6);
    transition: all 0.3s;
    cursor: auto;
  }

  &:hover .avatar_mask {
    opacity: 1;
  }
}

.avatar--border {
  border: 2px dotted #999;
}
</style>
