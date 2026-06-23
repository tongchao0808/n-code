<script>
import AddToKgButton from "@/views/mainPage/components/AddToKgButton.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import AIRewriteButton from "@/views/mainPage/components/AIRewriteButton.vue";
import {isWriteMode} from "@/plugins/aiAnserConfig.js";
export default {
  name: "ChatHeader",
  components: {MessageDialog, AddToKgButton,AIRewriteButton},
  props: {
    title: {type: String, required: true,},
    doRename: {type: Function, required: true,},
    doAddSessionToKg: {type: Function, required: true,},

    showSessionOperationButtons: {type: Boolean, required: true,},
    doCopySession: {type: Function, required: true,},
    doDownloadSession: {type: Function, required: true,},
    doDeleteSession: {type: Function, required: true,},
    doOpenAssistPanel: {type: Function, required: true,},
    sessionAddKgAlready: {type: Boolean,default: false},
    scene: {type: String,default: ''},
    doAIRewrite: {type: Function, default: () => {}},
  },
  computed: {
    isWriteMode() {
      return isWriteMode();
    }
  },
  data() {
    return {
      deleteConfirmShow: false,
    }
  },
  methods: {
    openDeleteConfirmDialog() {
      this.deleteConfirmShow = true;
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmShow = false;
    },
    deleteSession() {
      this.doDeleteSession();
      this.closeDeleteConfirmDialog();
      this.$store.state.mainPageChat.mode = 'newChat';
    }
  }
}
</script>

<template>
  <div class="w-full flex flex-row items-center justify-between py-[8px] pl-8 pr-6 cursor-pointer border-b border-b-[#E5E6EB]">
    <div v-if="!isWriteMode" class="text-[14px] leading-[24px] font-ms-yahei text-center text-[#1D2129] mt-2 font-bold max-w-[220px] truncate" @dblclick.stop="doRename">{{ title }}</div>
    <AIRewriteButton :on-rewrite="doAIRewrite" v-else/>
    <div class="flex gap-2">
      <div class="flex gap-1" v-if="scene==='note'">
        <el-tooltip class="item" effect="dark" content="重新问答" placement="top">
          <div class="operation-btn" @click="doOpenAssistPanel">
            <svg-icon icon-class="refresh" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            重新问答
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="复制" placement="top">
          <div class="operation-btn" @click="doCopySession">
            <svg-icon icon-class="copy" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            复制
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="下载" placement="top">
          <div class="operation-btn" @click="doDownloadSession">
            <svg-icon icon-class="download1" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            下载
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="分享" placement="top">
          <div class="operation-btn" @click="doCopySession">
            <svg-icon icon-class="share" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            分享
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <div class="operation-btn delete-btn" @click="openDeleteConfirmDialog" style="color:#EF4444">
            <svg-icon icon-class="delete1" class-name="!w-[16px] !h-[16px] text-[#EF4444]"/>
            删除
          </div>
        </el-tooltip>

        <MessageDialog :show="deleteConfirmShow"
                       title="删除提醒" desc="你确定要删除当前会话么"
                       :on-ok="deleteSession"
                       :on-cancel="closeDeleteConfirmDialog"/>
      </div>
      <div class="flex gap-1" v-else-if="showSessionOperationButtons&&!['science','academic'].includes(scene)">
        <el-tooltip class="item" effect="dark" content="助手面板" placement="top">
          <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
               @click="doOpenAssistPanel">
            <svg-icon icon-class="be-pending" class-name="!w-[20px] !h-[20px] text-[#5F646C]"/>
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="复制" placement="top">
          <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]" @click="doCopySession">
            <svg-icon icon-class="copy" class-name="!w-[20px] !h-[20px] text-[#5F646C]"/>
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="下载" placement="top">
          <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
               @click="doDownloadSession">
            <svg-icon icon-class="download1" class-name="!w-[32px] !h-[32px] text-[#5F646C]"/>
          </div>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
               @click="openDeleteConfirmDialog">
            <svg-icon icon-class="delete1" class-name="!w-[20px] !h-[20px] text-[#FF5656]"/>
          </div>
        </el-tooltip>

        <MessageDialog :show="deleteConfirmShow"
                       title="删除提醒" desc="你确定要删除当前会话么"
                       :on-ok="deleteSession"
                       :on-cancel="closeDeleteConfirmDialog"/>
      </div>
      <AddToKgButton v-if="!['academic'].includes(scene)" :on-add="doAddSessionToKg" color="primary" :visible="!sessionAddKgAlready" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.operation-btn {
  width: auto;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  padding: 4px 12px 4px 12px;
  border: 1px solid rgba(232, 239, 255, 1);
  border-radius: 20px;
  color: #5F646C;

font-size: 12px;
  &:hover {
    background: #F9FAFB;
    border-color: #E5E7EB;
  }

  &.delete-btn:hover {
    background: #FEF2F2;
    border-color: #FECACA;
  }
}
</style>
