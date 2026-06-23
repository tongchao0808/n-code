<script>
import {deleteDocs, getDocDetail, getDocTraningStatus} from "@/api/custom/customKnowledgeBase";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import Markdown from "@/components/custom/md/Markdown.vue";

export default {
  name: "KnowledgeDetail",
  components: {Markdown, MessageDialog},
  props: {
    docId: {type: [String,Number], required: true},
  },
  data() {
    return {
      doc: undefined,
      deleteConfirmShow: false,
      loading: false,
      trainingStatus: undefined,
    }
  },
  async mounted() {
    await this.reloadDoc();
  },
  methods: {
    async reloadDoc() {
      this.loading = true;
      this.doc = await getDocDetail(this.docId);
      this.trainingStatus = await getDocTraningStatus(this.docId);
      this.loading = false;
    },
    doCopyContent() {
      this.$copyText(this.doc.content)
        .then((e) => {
          this.$modal.msgSuccess("复制成功");
        });
    },
    openDeleteConfirmDialog() {
      this.deleteConfirmShow = true;
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmShow = false;
    },
    async doDeleteDoc() {
      await deleteDocs(this.docId);
      this.closeDeleteConfirmDialog();
      this.$emit('refresh');
      this.$emit('onCancel');
    },
    backToKnowledgeBase() {
      this.$emit('onCancel');
    },
    parseTrainingStatus(status) {
    switch (status) {
      case 'PROCESSING':
        return '文档正在分析中，请稍后查看...'
      case 'FAILED':
        return '文档分析失败,请重新上传或联系管理员'
      default:
        return ''
    }
  }
  },
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center bg-white z-[10] absolute top-0 left-0">
    <div v-if="doc !== undefined" class="w-full h-[55px] flex justify-between items-center">
      <div class="flex-1 px-8 flex gap-[24px] items-center overflow-hidden">
        <span class="text-[#959BA1] text-[14px] flex gap-[2px] items-center cursor-pointer hover:underline shrink-0" @click="backToKnowledgeBase">
          <svg-icon icon-class="right-arrow"
            class-name="!w-[20px] !h-[20px] rotate-180 text-[#5F646C]"/>
          <span>返回</span>
        </span>
        <span class="flex-1 text-[16px] text-[#1D2129] leading-[22px] overflow-box">{{ doc.name }}</span>
      </div>
      <div class="flex items-center px-8 ">
        <div class="text-[14px] text-[#959BA1] leading-[22px] w-[300px]">创建时间: {{parseTime(doc.createTime)}}</div>
        <div class="text-[14px] text-[#959BA1] leading-[22px] w-[150px]">大小: {{doc.size}}</div>

        <div class="flex gap-1 ml-[12%]">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
              @click="doCopyContent">
              <svg-icon icon-class="copy" class-name="!w-[20px] !h-[20px] text-[#5F646C]" />
            </div>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="下载" placement="top">
            <a :href="doc.url" target="_blank"
              class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]">
              <svg-icon icon-class="download1" class-name="!w-[32px] !h-[32px] text-[#5F646C]" />
            </a>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
              @click="openDeleteConfirmDialog">
              <svg-icon icon-class="delete1" class-name="!w-[20px] !h-[20px] text-[#FF5656]" />
            </div>
          </el-tooltip>

          <MessageDialog :show="deleteConfirmShow" title="删除提醒" desc="你确定要删除当前文档么" :on-ok="doDeleteDoc"
            :on-cancel="closeDeleteConfirmDialog" />
        </div>
      </div>
    </div>
    <div v-if="doc?.content" class="w-full flex flex-col gap-[20px] items-center py-6 h-[calc(100%-82px)] overflow-y-scroll">
      <h1 class="text-[16px] text-[#1D2129] leading-[22px] font-bold">{{ doc.name.split(".")[0] }}</h1>
      <div class="flex-1 w-[50%]">
        <Markdown :content="doc.content" />
      </div>
    </div>
    <div v-else v-loading="loading" class="w-full h-full flex justify-center items-center text-[16px] text-[#959BA1]">
      {{ parseTrainingStatus(trainingStatus) }}
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
