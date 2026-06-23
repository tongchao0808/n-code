<template>
  <div class="upload-file">
    <el-upload ref="fileUpload" multiple :action="uploadFileUrl" :before-upload="handleBeforeUpload"
      :file-list="fileList" :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed"
      :on-change="handleChange" :on-success="handleUploadSuccess" :show-file-list="false" :headers="headers"
      :data="data" :auto-upload="autoUpload" :on-progress="handleProgress" :on-abort="handleAbort"
      :accept="fileType.map(item => '.' + item).join(',')" class="upload-file-uploader">
      <!-- 上传按钮 -->
      <slot>
        <el-button size="mini" type="primary">选取文件</el-button>
      </slot>
      <template #trigger>
        <!-- 如果父组件提供了 trigger 插槽内容，则使用它 -->
        <slot name="trigger" v-if="$slots.trigger">
          <!-- 如果父组件没提供，则使用默认的触发按钮 -->
          <el-button type="primary" icon="el-icon-upload">
            选择文件
          </el-button>
        </slot>
      </template>
      <!-- 上传提示 -->
      <div v-if="showTip" slot="tip" class="el-upload__tip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text flex-1 overflow-y-auto"
      name="el-fade-in-linear" tag="ul" v-if="showFileList && fileList.length">
      <li v-for="(file, index) in fileList" :key="file.uid" class="el-upload-list__item flex flex-col p-[8px]">
        <!-- 图标、文件名、大小等 -->
        <div @click="handleFileClick(file)" class="flex items-center gap-[8px] w-full cursor-pointer">
          <div class="flex items-center justify-center flex-shrink-0 w-[36px] h-[36px] bg-[#E8EFFF] rounded-[50%]"><img
              class="w-[24px] h-[24px]" src="@/assets/images/note.svg" /></div>
          <div class="flex flex-col flex-1 gap-[4px] items-start max-w-[70%]">
            <div class="w-full text-[14px] text-[#4E5969] leading-[18px] overflow-box">{{ file.name }}</div>
            <div v-if="file.status === 'fail'" class="flex gap-[16px] text-[10px] leading-[15px]"><span
                class="text-[#FF5656]">{{ file.errMsg }}</span></div>
            <div v-else class="text-[10px] leading-[15px] flex items-center gap-[8px]">{{ getFileSize(file.size) }}
              <div v-if="needDesc" class="text-[#959BA1] text-[12px] leading-[12px] cursor-pointer hover:text-[#4E5969]"
                @click.stop.prevent="handleDescClick(file)">备注<i class="el-icon-caret-bottom"
                  :class="{'rotate-180': file.descOpen}"></i></div>
                  <slot name="successSlot" v-if="file.status === 'success'" :item="file"></slot>
            </div>
          </div>
        </div>
        <!-- 进度条 -->
        <div v-if="file.status === 'uploading'" class="w-full bg-[#F2F3F5] h-[4px] mt-[4px]">
          <div class="bg-[#B8CDFF] h-[4px]" :style="{ width: file.percentage + '%' }"></div>
        </div>
        <!-- 取消按钮 -->
        <div class="ele-upload-list__item-content-action ml-[2px] flex flex-col items-end justify-center">
          <template>
            <i class="cursor-pointer el-icon-error text-[#C9CDD4] hover:text-[#959BA1]"
              @click.stop="handleDelete(index)" />
          </template>
        </div>

        <el-input v-if="needDesc && file.descOpen" type="textarea" rows="2" @change="handleDescChange"
          class="mt-[8px] text-[#5F646C] text-[12px] leading-[18px]" style="width: calc(100% - 24px);"
          v-model="file.desc" placeholder="请输入文件描述，详细的描述可以帮助我们更好的理解您的需求" />
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {taskCancel, sceneUpload, checkDocumentsCompleteStatus} from '@/api/custom/file'
import { openFilePreview } from '@/utils/file';
import { isSaveUploadScene } from '@/plugins/aiAnserConfig.js';

export default {
  name: 'FileUpload',
  props: {
    // 值
    value: { type: [String, Object, Array], default: '' },
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
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: true
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
    },
    // 上传成功回调
    uploadSuccess: {
      type: Function,
      default: () => {}
    },
    // 是否需要备注
    needDesc: {
      type: Boolean,
      default: false
    },
    // 上传时附带的额外参数
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    needLoadList: {
      type: Boolean,
      default: false
    },
    // 加载完成回调
    handleLoadListComplate: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + this.url,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      fileList: [],
      showTip: this.isShowTip,
      loadTimer: null
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let list = []
          if (Array.isArray(val)) {
            list = val
            // list = val.map(item => {
            //   return {
            //     name: item[this.fileNameField] || item.name,
            //     url: item.url,
            //     size: item.size || 0,
            //     status: 'success'
            //   }
            // })
          } else if (typeof val === 'string') {
            list = [{
              name: val,
              url: val,
              size: 0,
              status: 'success'
            }]
          } else if (typeof val === 'object') {
            list = [{
              name: val[this.fileNameField] || val.name,
              url: val.url,
              size: val.size || 0,
              status: 'success'
            }]
          }
          this.fileList = list
        } else {
          this.fileList = []
        }
      },
      immediate: true
    },
    isShowTip: {
      handler(val) {
        this.showTip = val
      },
      immediate: true
    },
  },
  methods: {
    // 上传前校验
    handleBeforeUpload(file) {
      console.log('file', file);
      
      // 校验文件是否超出限制
      if (!this.validateFile(file)) {
        return false
      }

      // 为文件添加状态
      const fileWithStatus = {
        // ...file,
        uid: file.uid,
        name: file.name,
        size: file.size,
        status: 'uploading',
        percentage: 0
      }
      // this.$set(file, 'status', 'uploading')
      // this.$set(file, 'percentage', 0)
      this.fileList.push(fileWithStatus)
      this.$emit('input', this.getValue())
      return true
    },
    // 校验文件是否超出限制
    validateFile(file) {
      // 校验文件类型
      if (this.fileType.length > 0) {
        const suffix = file.name.split('.').pop().toLowerCase()
        const isTypeOk = this.fileType.some(type => {
          return type.toLowerCase() === suffix
        })
        if (!isTypeOk) {
          this.$message.error(`请上传${this.fileType.join('/')}格式的文件`)
          return false
        }
      }
      // 校验文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$message.error(`文件大小不能超过${this.fileSize}MB`)
          return false
        }
      }
      return true
    },
    // 上传成功回调
    async handleUploadSuccess(response, file, fileList) {
      if (response.code !== 200) {
        this.$set(file, 'status', 'fail')
        // file.status = 'fail'
        this.handleUploadError(response.msg, file, fileList)
      } else {
        // 查找并更新文件状态
        const index = this.fileList.findIndex(item => item.uid === file.uid)
        if (index !== -1) {
          this.fileList[index] = {
            ...this.fileList[index],
            url: response.data.publicUrl || file.url,
            taskId: response.data.taskId || '',
            status: 'success',
            responseData: response.data
          }
        }

        // 场景附件上传
        if(isSaveUploadScene()) {
          await sceneUpload(response.data.taskId)
        }

        // 检查附件是否加载到列表
        if(this.needLoadList) {
          this.checkCompleteStatus()
        }
      }
      console.log('this.fileList', this.fileList);
        this.$emit('input', this.getValue())
        this.$emit('change', this.getValue())
        this.$emit('success', this.getValue())
        // 关闭自动上传时上面的success回调失效 所以这里手动调用
        this.uploadSuccess(this.getValue())
    },
    checkCompleteStatus() {
      if (this.loadTimer !== null) {
        clearTimeout(this.loadTimer)
        this.loadTimer = null
      }
      const taskIds = this.fileList.filter(item => item.status === 'success').map(item => item.taskId)
      this.loadTimer = setTimeout(() => {
        checkDocumentsCompleteStatus(taskIds).then(res => {
          if (res.code == 200 && res.data == true) {
            this.$emit('loadListComplate', this.getValue())
            // 关闭自动上传时，emit失效，需要手动调用
            this.handleLoadListComplate(this.getValue())
          } else {
            this.checkCompleteStatus(taskIds)
          }
        })
      }, 1000)
    },
    // 上传失败回调
    handleUploadError(err, file, fileList) {
      // 查找并更新文件状态
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.fileList[index] = {
          ...this.fileList[index],
          status: 'fail',
          errMsg: err || '上传失败'
        }
      }
      this.$message.error(err || '上传失败，请重试')
    },
    // 处理文件超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多只能上传${this.limit}个文件`)
    },
    // 删除文件
    handleDelete(index) {
      if (this.isDelConfirm) {
        this.$confirm(this.delConfirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.fileList[index].taskId) {
            taskCancel(this.fileList[index].taskId).then(res => {
              if(res.code == 200) {
                this.fileList.splice(index, 1)
                this.$emit('input', this.getValue())
                this.$emit('change', this.getValue())
                this.$message.success('删除成功')
              }
            })
            return
          }
          this.fileList.splice(index, 1)
          this.$emit('input', this.getValue())
          this.$emit('change', this.getValue())
          this.$message.success('删除成功')
        }).catch(() => {
          // 取消删除
        })
      } else {
        this.fileList.splice(index, 1)
        this.$emit('input', this.getValue())
        this.$emit('change', this.getValue())
      }
    },
    // 获取值
    getValue() {
      return this.fileList
    },
    // 获取文件名
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1)
      } else {
        return name
      }
    },
    // 获取文件大小
    getFileSize(size) {
      if (size === 0 || !size) {
        return '0KB'
      }
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
      }
    },
    // 处理上传进度
    handleProgress(event, file, fileList) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.$set(this.fileList[index], 'percentage', event.percent)
      }
    },
    // 处理上传中止
    handleAbort(file, fileList) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.fileList[index] = {
          ...this.fileList[index],
          status: 'fail'
        }
      }
    },
    // 取消上传
    handleCancelUpload(index) {
      this.$refs.fileUpload.abort(index)
    },
    // 手动上传
    submit() {
      this.$refs.fileUpload.submit()
    },
    // 主要用于在关闭自动上传时，处理还未上传的文件
    handleChange(file, fileList) {
      console.log(file, fileList);
      if(!this.autoUpload && file.status === 'ready') {
        // 校验文件是否超出限制
        if (!this.validateFile(file)) {
          fileList.splice(fileList.indexOf(file), 1)
        }
        this.fileList = fileList
        this.$emit('input', this.fileList)
      }
    },
    clearFileList() {
      this.fileList = []
      this.$emit('input', this.getValue())
    },
    // 处理备注点击
    handleDescClick(file) {
      // this.$set(file, 'descOpen', !file.descOpen)
      this.fileList = this.fileList.map(item => {
        if(item.uid === file.uid) {
          return {
            ...item,
            descOpen: !item.descOpen
          }
        }
        return item
      })
      console.log('fileList', this.fileList);
    },
    // 处理备注改变
    handleDescChange() {
      this.$emit('input', this.getValue())
    },
    // 处理文件点击
    handleFileClick(item) {
      openFilePreview(item.url)
    },
  }
}
</script>

<style scoped lang="scss">
.upload-file-list .el-upload-list__item {
  width: 100%;
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.ele-upload-list__item-content-action {
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
}
</style>
