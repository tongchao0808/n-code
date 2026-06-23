<script>
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import Markdown from "@/components/custom/md/Markdown.vue";

export default {
  name: "RecordMdPreviewDialog",
  components: {Markdown, PrimaryButton, SecondaryButton},
  props: {
    record: {type: Object, required: false},
    onCancel: {type: Function, required: true},
    show: {type: Boolean, default: false},
    width: {type: String, required: false, default: '780px'},
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" :width="width" append-to-body>
    <div slot="title" class="px-8 pt-6 pb-4 flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">详细内容</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <div class="w-full px-8 py-1 border-b border-b-[#49576414]">
        <span class="text-[16px] text-[#1D2129]">{{ record && record.title }}</span>
      </div>
      <div class="w-full px-14 py-6 max-h-[calc(85vh-180px)] overflow-y-auto hide-scroll-bar">
        <Markdown :content="record && record.content"/>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.custom-dialog {
  padding: 0;

  ::v-deep .el-dialog {
    border-radius: 8px;
  }

  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }
}
</style>
