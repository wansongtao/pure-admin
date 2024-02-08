<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

import { getBase64 } from '@/utils/index'
import { uploadFile } from '@/api/common'

import type { UploadProps } from 'ant-design-vue'
import type { FileType } from 'ant-design-vue/es/upload/interface'

defineOptions({
  name: 'UploadAvatar'
})

const imgUrl = defineModel<string>('imgUrl', { default: '' })

const fileList = ref<UploadProps['fileList']>([])
watch(imgUrl, (url) => {
  if (!url) {
    fileList.value = []
    return
  }

  fileList.value = [
    {
      uid: '-1',
      name: '',
      status: 'done',
      url
    }
  ]
})

const verifyFileSize = (file: FileType, maxSize = 2 * 1024 * 1024) => {
  const isLt2M = file.size < maxSize
  if (!isLt2M) {
    return false
  }

  return true
}

const imageFile = ref<FileType>()
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const result = verifyFileSize(file)
  if (!result) {
    message.error('不能上传超过2MB大小的头像!')
    return
  }

  imageFile.value = file
  getBase64(file, (base64Url: string) => {
    fileList.value = [
      {
        uid: '-1',
        name: file.name,
        status: 'done',
        url: base64Url
      }
    ]

    imgUrl.value = base64Url
  })

  return false
}

const handleRemove = () => {
  fileList.value = []
  imageFile.value = undefined
  imgUrl.value = ''
}

const handleUpload = () => {
  return new Promise<string>((resolve, reject) => {
    if (!imageFile.value) {
      reject('file undefined')
      return
    }
    const isLt2M = verifyFileSize(imageFile.value)
    if (!isLt2M) {
      reject('Image must smaller than 2MB!')
      return
    }

    uploadFile(imageFile.value).then((data) => {
      const { result, error } = data
      if (error) {
        reject(error)
        return
      }

      imgUrl.value = result!.data
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
    v-model:file-list="fileList"
    accept="image/jpeg,image/png"
    :max-count="1"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    action=""
    :before-upload="beforeUpload"
    @remove="handleRemove"
  >
    <div>
      <plus-outlined />
      <div class="ant-upload-text">上传头像</div>
    </div>
  </a-upload>
</template>

<style lang="scss" scoped>
.avatar-uploader > .ant-upload {
  overflow: hidden;
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: var(--st-c-text-2);
}
</style>
