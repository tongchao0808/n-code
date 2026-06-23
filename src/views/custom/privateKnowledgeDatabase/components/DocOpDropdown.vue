<script>
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import {
  deleteDocPath,
  deleteDocs,
  moveToDoc,
  renameDoc,
} from "@/api/custom/customKnowledgeBase";
import KgRenameDialog from "@/views/custom/privateKnowledgeDatabase/components/KgRenameDialog.vue";
import DocMoveToDialog from "@/views/custom/privateKnowledgeDatabase/components/DocMoveToDialog.vue";

export default {
  name: "DocOpDropdown",
  components: { DocMoveToDialog, KgRenameDialog, MessageDialog },
  props: {
    pathId: { type: Number, required: false },
    doc: { type: Object, required: false },
    refreshList: { type: Function, required: true },
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      removeMessageDialogShow: false,
      showRenameDialog: false,
      showMoveToDialog: false,
    };
  },
  methods: {
    handleClick(command) {
      switch (command) {
        case "move": {
          this.openMoveToDialog();
          // console.log("list", this.list);
          return;
        }
        case "rename": {
          this.openRenameDialog();
          return;
        }
        case "remove": {
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
      if (this.pathId) {
        await deleteDocPath(this.pathId);
        this.closeRemoveMessageDialog();
        this.refreshList();
      } else if (this.doc) {
        await deleteDocs(this.doc.id);
        this.closeRemoveMessageDialog();
        this.refreshList();
      }
    },
    openRenameDialog() {
      this.showRenameDialog = true;
    },
    closeRenameDialog() {
      this.showRenameDialog = false;
    },
    doRenameDoc(id, name) {
      renameDoc(id, name)
        .then((res) => {
          this.$message.success("重命名成功");
          this.closeRenameDialog();
          this.refreshList();
        })
        .catch((err) => {
          console.log("rename document error: ", err);
        });
    },
    openMoveToDialog() {
      this.showMoveToDialog = true;
    },
    closeMoveToDialog() {
      this.showMoveToDialog = false;
    },
    doMoveTo(docId, dbId, dId) {
      if (!docId || !dbId) {
        this.$message.error("参数错误，无法移动");
        return;
      }
      moveToDoc(docId, dbId, dId)
        .then((res) => {
          this.$message.success("移动成功");
          this.closeMoveToDialog();
          this.refreshList();
        })
        .catch((err) => {
          console.log("move document error: ", err);
        });
    },
  },
};
</script>

<template>
  <div>
    <MessageDialog
      :show="removeMessageDialogShow"
      title="确认要删除这条记录吗?"
      desc="删除此记录将不可撤销,请谨慎选择"
      :on-ok="doRemoveDoc"
      :onCancel="closeRemoveMessageDialog"
    />
    <KgRenameDialog
      v-if="doc"
      :show="doc && doc.id && showRenameDialog"
      :id="doc.id"
      :default-value="doc.name"
      :on-ok="doRenameDoc"
      :on-cancel="closeRenameDialog"
    />
    <DocMoveToDialog
      v-if="doc"
      :list="list"
      :show="doc && doc.id && showMoveToDialog"
      :doc-id="doc.id"
      :on-ok="doMoveTo"
      :on-cancel="closeMoveToDialog"
    />

    <el-dropdown trigger="click" @command="handleClick" :hide-on-click="true">
      <div class="cursor-pointer">
        <div
          class="w-[22px] h-[22px] flex rounded justify-center items-center hover:bg-[#F2F3F5] cursor-pointer"
        >
          <svg-icon
            icon-class="be-pending"
            class-name="!w-[20px] !h-[20px] text-[#1D2129]"
          />
        </div>
      </div>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        <el-dropdown-item
          command="rename"
          :disabled="doc == undefined || doc == null"
        >
          <div class="flex items-center w-full gap-1">
            <svg-icon
              icon-class="rename"
              class-name="text-[#1D2129] !w-[18px] !h-[18px]"
            />
            <span class="text-[#1D2129] text-[14px]">重命名</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          command="move"
          :disabled="doc == undefined || doc == null"
        >
          <div class="flex items-center w-full gap-1">
            <svg-icon
              icon-class="move"
              class-name="text-[#1D2129] !w-[18px] !h-[18px]"
            />
            <span class="text-[#1D2129] text-[14px]">移动</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="remove">
          <div class="flex items-center w-full gap-1">
            <svg-icon
              icon-class="delete"
              class-name="text-[#FF5656] !w-[18px] !h-[18px]"
            />
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
      background: #f2f3f5;
    }
  }

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
