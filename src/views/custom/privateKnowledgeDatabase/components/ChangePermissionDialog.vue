<script>
export default {
  name: "ChangePermissionDialog",
  props: {
    id: {type: String, required: true},
    defaultPermission: {type: String, required: true},
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
  },
  data() {
    return {
      permission: "",
    }
  },
  watch: {
    defaultPermission: {
      immediate: true,
      handler(nValue) {
        const obj = {
          public: 'public',
          user: 'private'
        }
        this.permission = obj[nValue];
      }
    }
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible.sync="show" :show-close="false" width="400px" :modal-append-to-body="true">
    <div slot="title" class="w-full h-[56px] py-4 px-6 flex items-center justify-between">
      <div class="text-[#1D2129] font-bold font-ms-yahei text-[16px]">设置权限</div>
      <svg-icon icon-class="close-x-small" class-name="!w-[24px] !h-[24px] cursor-pointer" @click.stop="onCancel"/>
    </div>
    <div class="w-full h-[44px] flex flex-row items-center justify-center px-6">
      <el-radio-group v-model="permission" class="custom-radio-group">
        <el-radio label="public" class="custom-radio">共享</el-radio>
        <el-radio label="private" class="custom-radio">私密</el-radio>
      </el-radio-group>
    </div>
    <div slot="footer" class="w-full h-[60px] flex flex-row items-center justify-end py-3 px-6">
      <div
        class="w-[74px] h-[32px] rounded-lg bg-white text-[#5F646C] text-[14px] leading-[22px] border-[#C9CDD4] border-[1px] font-ms-yahei flex items-center justify-center cursor-pointer"
        @click.stop="onCancel">取消
      </div>
      <div
        class="w-[74px] h-[32px] rounded-lg bg-[#3662FF] text-white text-[14px] leading-[22px] border-[#3662FF] border-[1px] font-ms-yahei flex items-center justify-center cursor-pointer ml-[10px]"
        @click.stop="() => onOk(id, permission)">确定
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
}

</style>
