<script>
import AiFile from "@/components/FileUpload/AiFile.vue";
export default {
  name: "UserInputOperations",
  props: {
    doSend: { type: Function, required: true },
    list: { type: Array, required: false, default: () => [] },
  },
  components:{
    AiFile
  },
  data() {
    return {
      fileList: [],
      isUpload: false,
      isShowUpload: false,
    };

  },
  watch:{


  },
  methods: {
    handleSuccess(res) {
      // console.log('res', res)
      this.$emit('uploadSuccess', res)
    },
    fileListChange(val) {
      this.$emit('fileListChange', val)
    },
    // aiFile组件自带文件列表删除回调方法
    handleDelete(res) {

    },
    clearFileList() {
      this.fileList = []
    },
    // 不使用aiFile自带文件列表时，自定义文件列表的删除事件
    handleDeleteWithoutConfirm(val) {
      this.$refs.aiFile.handleDeleteWithoutConfirm(val)
    }
  },
};
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <div class="w-[1px] h-[26px] bg-[#E5E6EB] leading-[32px] mx-4" />
    <AiFile ref="aiFile" v-model="fileList" :is-show-tip="false" :class="[
      'w-full',
      'h-full',
      'flex',
      'flex-col',
      { isUpload: fileList.length },
    ]" :is-del-confirm="true" :limit="5" :file-size="50" :file-type="['pdf', 'docx', 'doc', 'jpg', 'png']"
      url="/attachment/chat/upload" del-confirm-text="将清除上传记录且彻底删除该文件" @success="handleSuccess" @delete="handleDelete"
      @fileListChange="fileListChange" :showFileList="false">
      <div class="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center hover:bg-[#E8EFFF]">
        <el-tooltip effect="dark" placement="top-start" class="inline-block w-4/5 ">
          <div slot="content">
            <div class="font-bold">上传附件（仅识别文字）</div>
            <div class="w-[200px]">最多上传5个文件，每个文件不大于50mb,支持pdf、docx、doc、jpg、png格式（图片类型的pdf不支持）</div>
          </div>
          <svg-icon icon-class="file" class-name="!w-[24px] !h-[24px]" />
          >
        </el-tooltip>
      </div>
    </AiFile>
    <div
      class="flex w-[56px] h-[32px] py-1 px-4 rounded-[34px] bg-[#3662FF] hover:bg-[#2041FF] items-center justify-center ml-4 cursor-pointer"
      @click.stop="doSend">
      <svg-icon icon-class="llm-send" class-name="!w-[22px] !h-[22px]" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
