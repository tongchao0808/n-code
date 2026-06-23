<template>
  <div class="upload-file">
    <el-upload
      ref="fileUpload"
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      :accept="fileType.map(item => '.'+item).join(',')"
      class="upload-file-uploader"
    >
      <!-- 上传按钮 -->
      <slot>
        <el-button size="mini" type="primary">选取文件</el-button>
      </slot>
      <!-- 上传提示 -->
      <div v-if="showTip" slot="tip" class="el-upload__tip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" v-if="showFileList">
      <li v-for="(file, index) in fileList" :key="file.url" class="el-upload-list__item ele-upload-list__item-content">
        <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action ml-[2px]">
          <i class="cursor-pointer el-icon-error" @click="handleDelete(index)" />
          <!-- <el-link :underline="false" type="danger" > -->
          <!-- <el-button size="mini" icon="el-icon-error" circle /> -->
          <!-- </el-link> -->
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'FileUpload',
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['doc', 'docx', 'xls', 'ppt', 'txt', 'pdf']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: '/common/upload'
    },
    // 是否需要删除确认
    isDelConfirm: {
      type: Boolean,
      default: false
    },
    delConfirmText: {
      type: String,
      default: '确定要删除该文件吗？'
    },
    // 文件名字段
    fileNameField: {
      type: String,
      default: 'fileName'
    },
    // 是否显示文件列表
    showFileList:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: []
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    },
    uploadFileUrl() {
      return this.baseUrl + this.url
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',')
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === 'string') {
              item = { name: item, url: item }
            }
            item.uid = item.uid || new Date().getTime() + temp++
            return item
          })
        } else {
          this.fileList = []
          return []
        }
      },
      deep: true,
      immediate: true
    },
    fileList: {
      handler(val) {
        this.$emit('fileListChange', val)
      },
      deep: true,
    }
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      //  校验文件总数不能超过limit
      if (this.fileList.length + this.number >= this.limit) {
        this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
        return false
      }
      // 校检文件类型
      if (this.fileType) {
        const fileName = file.name.split('.')
        const fileExt = fileName[fileName.length - 1]
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确，请上传${this.fileType.join('/')}格式文件!`)
          return false
        }
      }
      // 校检文件名是否包含特殊字符
      if (file.name.includes(',')) {
        this.$modal.msgError('文件名不正确，不能包含英文逗号!')
        return false
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      this.$modal.loading('正在上传文件，请稍候...')
      this.number++
      return true
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError('上传文件失败，请重试')
      this.$modal.closeLoading()
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        const fileInfo = { name: file.name.split('.').slice(0, -1).join('.'), nameExt: file.name.split('.').pop(), url: res.data.publicUrl,taskId:res.data.taskId }
        this.uploadList.push(fileInfo)
        this.uploadedSuccessfully()
        this.$emit('success', fileInfo)
      } else {
        this.number--
        this.$modal.closeLoading()
        this.$modal.msgError(res.msg)
        this.$refs.fileUpload.handleRemove(file)
        this.uploadedSuccessfully()
      }
    },
    // 删除文件
    handleDelete(index) {
      const del = () => {
        this.$emit('delete', this.fileList[index])
        this.fileList.splice(index, 1)
        this.$emit('input', this.fileList)
      }
      if (this.isDelConfirm) {
        this.$confirm(this.delConfirmText, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del()
        })
      } else {
        del()
      }
    },
    handleDeleteWithoutConfirm(file){
      const idx = this.fileList.findIndex(val=> val.uid === file.uid)
      if(idx>-1){
        this.fileList.splice(idx, 1)
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList)
        this.uploadList = []
        this.number = 0
        this.$emit('input', this.fileList)
        this.$modal.closeLoading()
      }
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1)
      } else {
        return name
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = ''
      separator = separator || ','
      for (const i in list) {
        strs += list[i].url + separator
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : ''
    },
  }
}
</script>

<style scoped lang="scss">
.upload-file-uploader {
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
