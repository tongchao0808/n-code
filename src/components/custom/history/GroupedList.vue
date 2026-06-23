<script>
import GroupedListItem from "@/components/custom/history/GroupedListItem.vue";
import {addHistoryToKg, removeHistory} from "@/api/custom/history";
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";

export default {
  name: "GroupedList",
  components: {RenameDialog, GroupedListItem},
  props: {
    // sample or full
    mode: {type: String, required: false, default: "sample"},
    // 分组数据
    groupedList: {type: Array, required: true},
  },
  data() {
    return {
      showRenameDialog: false,
      record: undefined,
    }
  },
  methods: {
    async addRecordToKg(record) {
      this.$emit('addToKg', {id: record.id});
    },
    async editTitle(record) {
      this.record = record;
      this.openRenameDialog();
    },
    async removeRecord(record) {
      this.$emit('delete', record);
    },
    async doRename(sessionUniqueId, title) {
      this.$emit('rename', {sessionUniqueId, title});
      this.closeRenameDialog();
    },
    openRenameDialog() {
      this.showRenameDialog = true;
    },
    closeRenameDialog() {
      this.showRenameDialog = false;
      this.record = undefined;
    },
  }
}
</script>

<template>
  <div :class="`w-full flex flex-col ${mode === 'sample' ? 'gap-4' : 'gap-7'}`">
    <RenameDialog :show="showRenameDialog"
                  :on-ok="doRename"
                  :on-cancel="closeRenameDialog"
                  :record="record"/>
    <div v-for="(group, index) in groupedList" :key="index" class="w-full">
      <GroupedListItem :mode="mode" :group="group"
                       :on-add-kg="addRecordToKg"
                       :on-rename="editTitle"
                       :on-remove="removeRecord"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
