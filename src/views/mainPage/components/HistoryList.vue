<script>
import {
  getHistorySampleList,
  getUserChatSessionHistories,
  renameUserChatSessionHistory,
  saveHistoryTitle,
  getCurrentChatSession
} from "@/api/custom/history";
import {getGroupedHistories} from "@/views/custom/history/history";

import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import GroupedList from "@/components/custom/history/GroupedList.vue";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";
import AddKnowledgeDialog from "@/components/custom/dialog/AddKnowledgeDialog.vue";
import GroupedListItem from "@/components/custom/history/GroupedListItem.vue";
import HistoryGroupedList from "@/views/mainPage/components/HistoryGroupedList.vue";

export default {
  name: "HistoryList",
  components: {
    HistoryGroupedList,
    GroupedListItem, AddKnowledgeDialog, NewKnowledgeBaseDialog, GroupedList, RecordDropdown, RenameDialog},
  props: {
    totalCount: {type: Number, required: false, default: 0},

    showTotalCount: {type: Boolean, required: false, default: false},
    showCloseIcon: {type: Boolean, required: false, default: true},
    showViewAll: {type: Boolean, required: false, default: false},

    onViewAll: {type: Function, required: false},
    onClose: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onDelete: {type: Function, required: false},
    onAddToKg: {type: Function, required: false},

    useThisSession: {type: Function, required: true},
  },
  data() {
    return {
      groupedList: [],
      allSessionList: [],
      loading: false,
      showList: true,
    }
  },
  methods: {
    async reloadGroupedHistory() {
      this.loading = true;
      // this.groupedList = await getUserChatSessionHistories();
      this.groupedList = await getCurrentChatSession();
      this.loading = false;
      this.filterAllSessions()
    },
    filterAllSessions() {
      if (!this.groupedList.length) return
      this.groupedList.forEach(group => {
        group.sessions.forEach(session => {
          this.allSessionList.push(session)
        })
      })
    },
    doClose() {
      this.$store.state.history.sidebarOpen = false;
    },
    openSideBar() {
      this.$store.state.history.sidebarOpen = !this.$store.state.history.sidebarOpen;
    }
  },
  async mounted() {
    await this.reloadGroupedHistory();
  },
  watch: {
    '$store.state.history.sidebarOpen': {
      handler(newVal) {
        if (newVal) {
          this.reloadGroupedHistory();
        }
        setTimeout(() => {
            this.showList = newVal
          }, 300)
      }
    },
    '$store.state.history.refreshId': {
      handler(newVal) {
        if (newVal > 1) {
          this.reloadGroupedHistory();
        }
      }
    }
  },
  computed: {
    historySideBarOpen() {
      return this.$store.state.history.sidebarOpen;
    }
  }
}
</script>

<template>
  <div class="flex flex-col w-full h-full relative">
    <div class="flex items-center justify-between w-full px-[8px] pb-[8px] pt-[20px] transition-all duration-300" :class="{'opacity-0': !historySideBarOpen}">
      <div class="flex items-center justify-between gap-1">
        <span class="text-[16px] text-[#1D2129] font-bold font-ms-yahei leading-5">历史记录</span>
      </div>
    </div>
    <div v-show="showList" v-loading="loading" class="flex-1 overflow-x-hidden overflow-y-scroll scrollbar-small transition-all duration-300" :class="{'opacity-0': !historySideBarOpen}">
      <HistoryGroupedList :grouped-list="groupedList"
                          :refresh-list="reloadGroupedHistory"
                          :use-this-session="useThisSession"
                          :all-session-list="allSessionList"/>
    </div>
    <svg-icon v-if="showCloseIcon" icon-class="sidebar" class-name="!w-[24px] !h-[24px] absolute top-[20px] right-[8px] cursor-pointer z-[10] transition-all duration-300" :class="{'rotate-180': historySideBarOpen}" @click="openSideBar"/>
  </div>
</template>

<style scoped lang="scss">

</style>
