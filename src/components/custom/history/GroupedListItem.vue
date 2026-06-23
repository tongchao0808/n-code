<script>
import GroupedSampleItem from "@/components/custom/history/GroupedSampleItem.vue";
import GroupedFullItem from "@/components/custom/history/GroupedFullItem.vue";

export default {
  name: "GroupedListItem",
  components: {GroupedFullItem, GroupedSampleItem},
  props: {
    // sample or full
    mode: {type: String, required: false, default: "sample"},
    // 分组数据
    group: {type: Object, required: true},

    onAddKg: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onRemove: {type: Function, required: false},
  }
}
</script>

<template>
  <div v-if="group.records && group.records.length > 0" class="w-full flex flex-col gap-2">
    <div v-if="group && group.title" class="w-full text-[#86909c] text-[12px] px-4">{{ group.title }}</div>
    <ul :class="`w-full flex flex-col list-none ${mode === 'sample' ? '' : 'gap-4'}`">
      <GroupedSampleItem v-if="mode === 'sample'"
                         v-for="(record, index) in group.records" :key="index"
                         :record="record"
                         :on-add-kg="onAddKg" :on-rename="onRename" :on-remove="onRemove"/>
      <GroupedFullItem v-if="mode === 'full'"
                       v-for="(record, index) in group.records" :key="index"
                       :record="record"
                       :on-add-kg="onAddKg" :on-rename="onRename" :on-remove="onRemove"/>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>
