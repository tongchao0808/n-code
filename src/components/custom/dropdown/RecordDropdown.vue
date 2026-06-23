<script>
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";

export default {
  name: "RecordDropdown",
  components: {MessageDialog},
  props: {
    onAddKg: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onRemove: {type: Function, required: false},
    sessionAddKgAlready: {type: Boolean, required: false},
  },
  data() {
    return {
      removeMessageDialogShow: false,
    }
  },
  methods: {
    handleClick(command) {
      switch (command) {
        case 'add-kg': {
          if (this.onAddKg) {
            this.onAddKg();
          }
          return;
        }
        case 'rename': {
          if (this.onRename) {
            this.onRename();
          }
          return;
        }
        case 'remove': {
          // const _this = this;
          if (this.onRemove) {
            this.onRemove();
          }
          // setTimeout(() => {
          //   _this.openRemoveMessageDialog();
          // }, 100);
          return;
        }
      }
    },
    doRemove() {
      if (this.onRemove) {
        this.onRemove();
      }
      this.closeRemoveMessageDialog();
    },
    openRemoveMessageDialog() {
      this.removeMessageDialogShow = true;
    },
    closeRemoveMessageDialog() {
      this.removeMessageDialogShow = false;
    },
  }
}
</script>

<template>
  <div>
    <MessageDialog :show="removeMessageDialogShow"
                   title="确认要删除这条记录吗?" desc="删除此记录将不可撤销,请谨慎选择"
                   :on-ok="doRemove" :onCancel="closeRemoveMessageDialog"/>
    <el-dropdown trigger="click" @command="handleClick">
      <div class="cursor-pointer">
        <div class="w-[22px] h-[22px] flex rounded justify-center items-center hover:bg-[#E5E6EB] cursor-pointer">
          <svg-icon icon-class="be-pending" class-name="!w-[20px] !h-[20px] text-[#1D2129]"/>
        </div>
      </div>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        <el-dropdown-item v-if="!sessionAddKgAlready" command="add-kg">
          <div class="w-full flex items-center gap-1">
            <svg-icon icon-class="add-to-kg" class-name="text-[#1D2129] !w-[18px] !h-[18px]"/>
            <span class="text-[#1D2129] text-[14px]">加入知识库</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="rename">
          <div class="w-full flex items-center gap-1">
            <svg-icon icon-class="rename" class-name="text-[#1D2129] !w-[18px] !h-[18px]"/>
            <span class="text-[#1D2129] text-[14px]">重命名</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="remove">
          <div class="w-full flex items-center gap-1">
            <svg-icon icon-class="delete" class-name="text-[#FF5656] !w-[18px] !h-[18px]"/>
            <span class="text-[#FF5656] text-[14px]">删除</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.custom-dropdown-menu {
  padding: 4px !important;
  border-radius: 8px;
  margin-top: 2px;

  ::v-deep .el-dropdown-menu__item {
    padding: 8px !important;
    line-height: 14px !important;
    border-radius: 8px;

    &:hover {
      background: #F2F3F5;
    }
  }

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
