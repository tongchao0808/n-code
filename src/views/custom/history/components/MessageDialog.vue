<script>
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";

export default {
  name: "MessageDialog",
  components: {PrimaryButton, SecondaryButton},
  props: {
    title: {type: String, required: true},
    desc: {type: String, required: true},
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
    width: {type: String, required: false, default: '424px'},
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" :width="width" :modal-append-to-body="true" :modal="false">
    <div class="px-8 pt-8 pb-6 flex gap-4">
      <div class="h-full">
        <svg-icon icon-class="attention" class-name="!w-[24px] !h-[24px]"/>
      </div>
      <div class="h-full flex-1 flex flex-col gap-3">
        <span class="text-[#1D2129] text-[16px] font-bold">{{ title }}</span>
        <span class="text-[#5F646C] text-[14px]">{{ desc }}</span>
      </div>
    </div>
    <div slot="footer" class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]">
      <div class="w-[74px] h-[32px]">
        <SecondaryButton text="取消" @click="onCancel"/>
      </div>
      <div class="w-[74px] h-[32px]">
        <PrimaryButton text="确定" @click="onOk"/>
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
    display: none !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }
}
</style>
