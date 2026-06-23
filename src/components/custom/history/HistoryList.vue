<script>
import {getHistorySampleList, saveHistoryTitle} from "@/api/custom/history";
import {getGroupedHistories} from "@/views/custom/history/history";

import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import GroupedList from "@/components/custom/history/GroupedList.vue";

export default {
  name: "HistoryList",
  components: {GroupedList, RecordDropdown, RenameDialog},
  props: {
    title: {type: String, required: true},
    groupedList: {type: Array, required: false, default: []},
    totalCount: {type: Number, required: false, default: 0},

    showTotalCount: {type: Boolean, required: false, default: false},
    showCloseIcon: {type: Boolean, required: false, default: true},
    showViewAll: {type: Boolean, required: false, default: false},

    onViewAll: {type: Function, required: false},
    onClose: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onDelete: {type: Function, required: false},
    onAddToKg: {type: Function, required: false},
  },
  methods: {
    doViewAll() {
      if (this.onViewAll) {
        this.onViewAll();
      }
    },
    doClose() {
      if (this.onClose) {
        this.onClose();
      }
    },
    doRename(record) {
      if (this.onRename) {
        this.onRename(record);
      }
    },
    doDelete({id}) {
      if (this.onDelete) {
        this.onDelete(id);
      }
    },
    doAddToKg({id}) {
      if (this.onAddToKg) {
        this.onAddToKg(id);
      }
    }
  },
  mounted() {
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-between items-center px-4 pt-7 pb-4">
      <div class="w-full flex items-center justify-between gap-1">
        <span class="text-[16px] text-[#1D2129] font-bold font-ms-yahei leading-5">{{title}}</span>
        <span v-if="showTotalCount" class="text-[14px] text-[#5F646C] leading-[18px]">{{ totalCount }}条</span>
      </div>
      <div>
        <div v-if="showViewAll" class="text-[14px] text-[#3662FF] leading-[18px] cursor-pointer whitespace-nowrap" @click="doViewAll">
          查看全部
        </div>
        <div v-if="showCloseIcon" class="cursor-pointer" @click="doClose">
          <svg-icon icon-class="close" class-name="w-[24px] h-[24px]"/>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-scroll overflow-x-hidden hide-scroll-bar">
      <GroupedList mode="sample" :grouped-list="groupedList" @rename="doRename" @delete="doDelete" @addToKg="doAddToKg"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
