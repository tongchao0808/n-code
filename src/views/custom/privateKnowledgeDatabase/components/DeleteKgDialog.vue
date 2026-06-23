<script>
export default {
  name: "DeleteKgDialog",
  props: {
    id: {type: String, required: true},
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
  },
  data() {
    return {
      deleteOption: "reserve",
    }
  },
  watch: {
    show: function (newVal) {
      if (newVal) {
        this.deleteOption = "reserve";
      }
    }
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible.sync="show" :show-close="false" width="400px" top="30vh !important" :modal-append-to-body="true">
    <div slot="title" class="w-full h-[56px] py-4 px-6 flex items-center justify-between">
      <div class="text-[#1D2129] font-bold font-ms-yahei text-[16px] flex items-center">
        <svg-icon icon-class="base-warning" class-name="!w-[21px] !h-[21px] mr-2 text-[#ffba00]"/>
        <span>删除确认</span>
      </div>
      <svg-icon icon-class="close-x-small" class-name="!w-[24px] !h-[24px] cursor-pointer" @click.stop="onCancel"/>
    </div>
    <div class="w-full flex flex-col items-center justify-center px-6 border-t border-t-[#f5f5f5]">
      <div class="w-full flex justify-center pt-6 pb-3 text-[#1D2129] text-[16px] leading-[24px]">是否保留该文件夹内的文件</div>
      <div class="w-full">
        <el-radio-group v-model="deleteOption" class="custom-radio-group-delete">
          <el-radio label="reserve" class="custom-radio-delete">
            <span class="text-[#1d1d29] text-[16px]">保留</span>
            <span class="text-[#959BA1] text-[12px]">
            该类下的知识库文件将
            <span class="text-[#5F646C] text-[12px]">自动放入【默认知识库】</span>
            <span class="text-[#959BA1] text-[12px]">中</span>
          </span>
          </el-radio>
          <el-radio label="discard" class="custom-radio-delete">
            <span class="text-[#1d1d29] text-[16px]">不保留</span>
            <span class="text-[#959BA1] text-[12px]">该类下的知识库文件将同步删除，无法找回</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div slot="footer" class="w-full h-[60px] flex flex-row items-center justify-end py-3 px-6">
      <div
        class="w-[74px] h-[32px] rounded-lg bg-white text-[#5F646C] text-[14px] leading-[22px] border-[#C9CDD4] border-[1px] font-ms-yahei flex items-center justify-center cursor-pointer"
        @click.stop="onCancel">取消
      </div>
      <div
        class="w-[74px] h-[32px] rounded-lg bg-[#FF5656] text-white text-[14px] leading-[22px] border-[#FF5656] border-[1px] font-ms-yahei flex items-center justify-center cursor-pointer ml-[10px]"
        @click.stop="() => onOk(id, deleteOption)">确定
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
.custom-radio-group-delete {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.custom-radio-delete {
  width: 130px !important;
  height: 44px !important;
  font-size: 16px;
  display: flex;
  align-items: center;

  ::v-deep .el-radio__label {
    font-size: 12px;
  }
}
</style>
