<script>
import AddToKgButton from "@/views/mainPage/components/AddToKgButton.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import FuncButton from "@/views/mainPage/components/FuncButton.vue";

export default {
  name: "BubbleOperationButtons",
  components: {FuncButton, MessageDialog, AddToKgButton},
  props: {
    messageId: {type: String, required: false},
    doCopy: {type: Function, default: true},
    doReAnswer: {type: Function, required: true},
    doDeleteMessage: {type: Function, required: true},
    doAddMessageToKg: {type: Function, required: true},
    knowledgeDatabaseRelations: {type: Array, default: () => []},
    simpleMode: {type: Boolean, default: false},
  },
  data() {
    return {
      deleteConfirmShow: false,
    }
  },
  methods: {
    openDeleteConfirmDialog() {
      this.deleteConfirmShow = true;
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmShow = false;
    },
    confirmDelete() {
      this.doDeleteMessage(this.messageId);
      this.closeDeleteConfirmDialog();
    },
    reAnswer() {
      this.doReAnswer(this.messageId);
    },
    addMessageToKg() {
      this.doAddMessageToKg(this.messageId);
    }
  }
}
</script>

<template>
  <div class="w-full h-[26px] flex flex-row items-center justify-between">
    <div class="flex flex-row justify-start h-full">
      <FuncButton label="复制" icon="llm-copy" :do-click="doCopy" />
      <FuncButton label="重新回答" icon="llm-refresh" class-name="ml-4" :do-click="reAnswer" />
      <FuncButton label="删除" icon="llm-delete" color="#FF5656" class-name="ml-4" :do-click="openDeleteConfirmDialog" />
      <MessageDialog :show="deleteConfirmShow"
                     title="删除提醒" desc="你确定要删除这条消息么"
                     :on-ok="confirmDelete"
                     :on-cancel="closeDeleteConfirmDialog"/>
    </div>
    <AddToKgButton v-if="!simpleMode" :visible="knowledgeDatabaseRelations.length === 0" :on-add="addMessageToKg" color="soft" />
  </div>
</template>

<style scoped lang="scss">

</style>
