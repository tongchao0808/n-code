<script>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";

export default {
  name: "CreateNewKnowledgeBaseDialog",
  components: {SecondaryButton, PrimaryButton},
  props: {
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
    enablePermission: {type: Boolean, default: false},
  },
  data() {
    return {
      name: "",
      permission: "public"
    }
  },
  watch: {
    show: function (newVal) {
      if (newVal) {
        this.permission = "public";
        this.name = "";
      }
    }
  },
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="400px" :modal-append-to-body="true">
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">新建知识库</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <div class="px-6 pt-[10px] pb-[10px]">
      <el-input v-model="name" class="w-full"/>
      <div class="w-full pt-2 h-10 text-[14px] font-ms-yahei flex items-center">权限设置</div>
      <div class="w-full h-[44px] flex flex-row items-center justify-center">
        <el-radio-group v-model="permission" class="custom-radio-group">
          <el-radio label="public" class="custom-radio">共享</el-radio>
          <el-radio label="private" class="custom-radio">私密</el-radio>
        </el-radio-group>
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
  width: 100%;
  height: 44px !important;
  display: flex;
  align-items: center;
}

.custom-radio {
  width: 50% !important;
  font-size: 16px;
}

::v-deep .el-radio__inner {
  border-color: #959BA1 !important;
  width: 18px !important;
  height: 18px !important;
}

::v-deep .is-checked .el-radio__inner {
  border-color: #3662FF !important;
  background-color: #3662FF !important;
  width: 18px !important;
  height: 18px !important;
}
</style>
