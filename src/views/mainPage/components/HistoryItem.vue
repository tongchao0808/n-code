<script>
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import AddKnowledgeDialog from "@/components/custom/dialog/AddKnowledgeDialog.vue";
import {
  addUserChatSessionHistoryToKg,
  removeChatSession,
  renameChatSession
} from "@/api/custom/history";
import {createNewKg, getUserKnowledgeList} from "@/api/custom/customKnowledgeBase";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";

export default {
  name: "HistoryItem",
  components: {MessageDialog, AddKnowledgeDialog, RecordDropdown, NewKnowledgeBaseDialog, RenameDialog},
  props: {
    record: {type: Object, required: true},
    refreshList: {type: Function, required: true},
    useThisSession: {type: Function, required: true},
    allSessionList: {type: Array, required: false}
  },
  data() {
    return {
      knowledgeBaseDataList: [],
      dialogStatus: {
        rename: false,
        addToKg: false,
        createKg: false,
        remove: false,
      },
      sessionAddKgAlready: false,
    }
  },
  created() {
    this.filterSessionAddToKg()
  },
  methods: {
    async doRename(record, newTitle) {
      // await renameUserChatSessionHistory(record.sessionUniqueId, newTitle);
      await renameChatSession(record.sessionUniqueId, newTitle)
      this.closeRenameDialog();
      this.refreshList();
      this.$message.success("重命名成功");
    },
    filterSessionAddToKg() {
      if(!this.allSessionList.length) return
      this.sessionAddKgAlready = this.allSessionList.some(session => {
        if(session.sessionUniqueId == this.record.sessionUniqueId && session.knowledgeDatabaseRelations?.length > 0) {
            return true;
          }
      })
    },
    openRemoveDialog() {
      this.$set(this.dialogStatus, "remove", true);
    },
    closeRemoveDialog() {
      this.$set(this.dialogStatus, "remove", false);
    },
    openRenameDialog() {
      this.$set(this.dialogStatus, "rename", true);
    },
    closeRenameDialog() {
      this.$set(this.dialogStatus, "rename", false);
    },
    openAddToKgDialog() {
      this.$set(this.dialogStatus, "addToKg", true);
    },
    closeAddToKgDialog() {
      this.$set(this.dialogStatus, "addToKg", false);
    },
    openCreateKgDialog() {
      this.$set(this.dialogStatus, "createKg", true);
    },
    closeCreateKgDialog() {
      this.$set(this.dialogStatus, "createKg", false);
    },
    async doAddToKg(sessionUniqueId, messageId, kgIds, mode, fileTitle) {
      if (mode === 'session') {
        await addUserChatSessionHistoryToKg(sessionUniqueId, kgIds, fileTitle);
        this.refreshList();
        this.closeAddToKgDialog();
        this.$message.success("加入知识库成功");
      }
    },
    async doCreateKg(name, permission) {
      await createNewKg(name, permission);
      await this.reloadKnowledgeBaseList();
      const idx = this.knowledgeBaseDataList.findIndex(x => x.name === name);
      if (idx > -1) {
        this.$set(this.knowledgeBaseDataList[idx], 'selected', true);
      }
      this.closeCreateKgDialog();
    },
    async confirmDelete() {
       await removeChatSession(this.record.sessionUniqueId)
      this.closeRemoveDialog();
      this.refreshList();
      this.$message.success("删除对话记录成功");

      // this.$store.state.history.sidebarOpen = false;
      this.$store.state.mainPageChat.mode = 'newChat';
    },
    async reloadKnowledgeBaseList() {
      this.knowledgeBaseDataList = await getUserKnowledgeList(3);
      if (this.record.kgIds !== undefined && this.record.kgIds.length > 0) {
        for (let i = 0; i < this.record.kgIds.length; i++) {
          const kgId = this.record.kgIds[i];
          const kg = this.knowledgeBaseDataList.find(x => x.id === kgId);
          if (kg !== undefined) {
            kg.selected = true;
          }
        }
      }
    },
    handleRowClick(e, record) {
      const isDropdown = e.target.closest('.el-dropdown, .el-dropdown-menu, .el-dropdown-item, .el-dialog');
      if (!isDropdown) {
        // 如果是下拉组件相关元素，阻止事件处理
        this.useThisSession(record);
      }
    },
  },
  watch: {
    'dialogStatus.addToKg': {
      handler(newVal) {
        if (newVal) {
          this.reloadKnowledgeBaseList();
        }
      }
    }
  }
}
</script>

<template>
  <li class="history-item-row w-full flex justify-between items-center rounded-[4px] hover:bg-[#F2F3F5] hover:cursor-pointer px-[8px] py-[6px] gap-5"  @click="(e) => handleRowClick(e, record)">
    <RenameDialog :show="this.dialogStatus.rename"
                  :on-ok="doRename" :on-cancel="closeRenameDialog"
                  :record="record"/>
    <AddKnowledgeDialog :show="this.dialogStatus.addToKg"
                        :chat-title="record.title" :data-list="knowledgeBaseDataList"
                        :sessionUniqueId="record.sessionUniqueId" mode="session"
                        :on-ok="doAddToKg" :on-cancel="closeAddToKgDialog"
                        :message="{}" :on-add-new="openCreateKgDialog"/>
    <NewKnowledgeBaseDialog :show="this.dialogStatus.createKg" :on-ok="doCreateKg"
                            :on-cancel="closeCreateKgDialog"/>
    <MessageDialog :show="this.dialogStatus.remove"
                   title="删除提醒" desc="你确定要删除这条消息么"
                   :on-ok="confirmDelete"
                   :on-cancel="closeRemoveDialog"/>
    <span class="flex-1 truncate">{{ record && record.title }}</span>
    <RecordDropdown :on-add-kg="openAddToKgDialog"
                    :on-rename="openRenameDialog"
                    :on-remove="openRemoveDialog"
                    :sessionAddKgAlready="sessionAddKgAlready"/>
  </li>
</template>

<style scoped lang="scss">

</style>
