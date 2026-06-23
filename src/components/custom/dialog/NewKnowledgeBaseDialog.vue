<script>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";

export default {
  name: "NewKnowledgeBaseDialog",
  components: {SecondaryButton, PrimaryButton},
  props: {
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
  },
  data() {
    return {
      name: "",
      permission: "public",
    }
  },
  watch: {

  },
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="400px" :modal-append-to-body="true" append-to-body>
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">新建知识库</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <div class="px-6 pt-[10px] pb-[20px] flex w-full flex-col gap-[30px]">
      <el-input v-model="name" class="w-full"/>
      <div class="w-full flex flex-col gap-2">
        <div class="text-[#1D2129] font-bold font-ms-yahei text-[16px]">设置权限</div>
        <div class="w-full h-[44px] flex flex-row items-center justify-start">
          <el-radio-group v-model="permission" class="custom-radio-group">
            <el-radio label="public" class="custom-radio">共享</el-radio>
            <el-radio label="private" class="custom-radio">私密</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]">
      <div class="w-[74px] h-[32px]">
        <SecondaryButton text="取消" @click="onCancel" />
      </div>
      <div class="w-[74px] h-[32px]">
        <PrimaryButton text="确定" @click="() => onOk(name, permission)"/>
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
.custom-radio-group {
  height: 44px !important;
  display: flex;
  align-items: center;
}

.custom-radio {
  width: 130px !important;
  font-size: 16px;

  ::v-deep .el-radio__label {
    color: #1D2129;
  }

  ::v-deep .el-radio__inner {
    border-color: #959BA1;
  }

  ::v-deep .el-radio__input.is-checked .el-radio__inner {
    background: #3662FF;
    border-color: #3662FF;
  }

  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: #1D2129;
  }
}
</style>
