<script>
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import KgRenameDialog from "@/views/custom/privateKnowledgeDatabase/components/KgRenameDialog.vue";
import {renameAgentFile, deleteAgentFile} from "@/api/custom/agentFileManage";
import {taskCancel} from '@/api/custom/file'


export default {
  name: "DocOpDropdown",
  components: {KgRenameDialog, MessageDialog},
  props: {
    doc: {type: Object, required: true},
    refreshList: {type: Function, required: true},
  },
  data() {
    return {
      removeMessageDialogShow: false,
      showRenameDialog: false,
    }
  },
  methods: {
    handleClick(command) {
      switch (command) {
        case 'rename': {
          this.openRenameDialog();
          return;
        }
        case 'remove': {
          this.openRemoveMessageDialog();
          return;
        }
      }
    },
    openRemoveMessageDialog() {
      this.removeMessageDialogShow = true;
    },
    closeRemoveMessageDialog() {
      this.removeMessageDialogShow = false;
    },
    async doRemoveDoc() {
      await deleteAgentFile(this.doc.dataId);
      if(this.doc.fileType === 'file') {
        await taskCancel(this.doc.taskId);
      }
      this.closeRemoveMessageDialog();
      this.refreshList();
    },
    openRenameDialog() {
      this.showRenameDialog = true;
    },
    closeRenameDialog(){
      this.showRenameDialog = false;
    },
    doRenameDoc(id, name) {
      renameAgentFile({dataId: id, newName: name}).then(res => {
        this.$message.success("重命名成功");
        this.closeRenameDialog();
        this.refreshList();
      }).catch(err => {
        console.log("rename document error: ", err);
      });
    },
  },
}
</script>

<template>
  <div>
    <MessageDialog :show="removeMessageDialogShow"
                   title="确认要删除这个文件吗?" desc="删除此文件将不可撤销,请谨慎选择"
                   :on-ok="doRemoveDoc" :onCancel="closeRemoveMessageDialog"/>
    <KgRenameDialog :show="showRenameDialog"
                    :id="doc.dataId"
                    :default-value="doc.name"
                    :on-ok="doRenameDoc"
                    :on-cancel="closeRenameDialog" />

    <el-dropdown trigger="click" @command="handleClick" :hide-on-click="true">
      <div class="cursor-pointer">
        <div class="w-[22px] h-[22px] flex rounded justify-center items-center hover:bg-[#F2F3F5] cursor-pointer">
          <svg-icon icon-class="be-pending" class-name="!w-[20px] !h-[20px] text-[#1D2129]"/>
        </div>
      </div>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
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
