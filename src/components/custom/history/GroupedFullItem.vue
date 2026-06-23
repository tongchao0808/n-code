<script>
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";

export default {
  name: "GroupedFullItem",
  components: {RecordDropdown},
  props: {
    record: {type: Object, required: true},
    onAddKg: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onRemove: {type: Function, required: false},
  },
  methods: {
    goToHistoryDetail() {
      this.$tab.openPage('历史记录详情', '/historyDetail', {id: this.record.id});
    },
  }
}
</script>

<template>
  <li class="w-full flex flex-col">
    <!-- title -->
    <div class="w-full flex justify-between items-center border-b border-b-[#495764] pb-2">
      <div class="w-[calc(100%-110px)] text-[#1D2129] text-[16px]">
        <div class="w-full cursor-pointer truncate" @click="goToHistoryDetail">{{ record.title }}</div>
      </div>
      <div class="flex justify-center items-center gap-4">
        <span class="text-[12px] text-[#86909C]">{{ record.dateTime.substr(0, 10) }}</span>
        <RecordDropdown :on-add-kg="() => onAddKg(record)"
                        :on-rename="() => onRename(record)"
                        :on-remove="() => onRemove(record)"/>
      </div>
    </div>
    <!-- 摘要 -->
    <div class="w-full px-1 py-2">
      <p class="text-[#4E5969] text-[14px] overflow-hidden clamp break-all">{{ record.desc }}</p>
    </div>
  </li>
</template>

<style scoped lang="scss">
.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
