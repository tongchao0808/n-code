<script>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";

export default {
  name: "RenameDialog",
  components: {SecondaryButton, PrimaryButton},
  props: {
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
    record: {type: Object, required: false},
    titleProperty: {type: String, required: false, default: 'title'},
  },
  data() {
    return {
      value: ""
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(nValue) {
        if (nValue && this.record && this.record[this.titleProperty]) {
          this.value = this.record[this.titleProperty];
        }
      }
    }
  },
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="400px" :modal-append-to-body="true">
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">重命名</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <div class="px-6 pt-[10px] pb-[20px]">
      <el-input v-model="value" class="w-full"/>
    </div>
    <div slot="footer" class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]">
      <div class="w-[74px] h-[32px]">
        <SecondaryButton text="取消" @click="onCancel" />
      </div>
      <div class="w-[74px] h-[32px]">
        <PrimaryButton text="确定" @click="() => onOk(record, value)"/>
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
    padding: 0 !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }
}
</style>
