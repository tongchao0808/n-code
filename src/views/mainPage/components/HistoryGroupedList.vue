<script>
import GroupedListItem from "@/components/custom/history/GroupedListItem.vue";
import GroupedSampleItem from "@/components/custom/history/GroupedSampleItem.vue";
import HistoryItem from "@/views/mainPage/components/HistoryItem.vue";

export default {
  name: "HistoryGroupedList",
  components: {HistoryItem, GroupedSampleItem, GroupedListItem},
  props: {
    groupedList: {type: Array, required: true},
    refreshList: {type: Function, required: true},
    useThisSession: {type: Function, required: true},
    allSessionList: {type: Array, required: false}
  },
  computed: {}
}
</script>

<template>
  <div class="flex flex-col w-full gap-4">
    <div v-for="(group, groupIndex) in groupedList" :key="groupIndex" class="w-full">
      <div v-if="group.sessions && group.sessions.length > 0" class="flex flex-col w-full gap-2">
        <div v-if="group && group.groupName" class="w-full text-[#86909c] text-[12px] px-[8px]">{{ group.groupName }}</div>
        <ul class="flex flex-col w-full list-none px-[8px]">
          <HistoryItem v-for="(sessions, recordIndex) in group.sessions"
                       :key="recordIndex"
                       :record="sessions"
                       :refresh-list="refreshList"
                       :use-this-session="useThisSession"
                       :all-session-list="allSessionList"/>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
