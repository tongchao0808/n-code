<script>
import HistoryList from "@/components/custom/history/HistoryList.vue";
import EmptyChat from "@/views/mainPage/EmptyChat.vue";
import SimilarQuestion from "@/views/mainPage/SimilarQuestion.vue";
import HistoryPanel from "@/views/custom/history/components/HistoryPanel.vue";
import {getHistoryDetail} from "@/api/custom/history";

export default {
  name: "index",
  components: {HistoryPanel, SimilarQuestion, EmptyChat, HistoryList},
  data() {
    return {
      showHistorySideBar: true,
      detailRecord: undefined
    }
  },
  methods: {
    goToLeft() {
      this.showHistorySideBar = false;
    },
    goToRight() {
      this.showHistorySideBar = true;
    },
    async refreshDetail(id) {
      if (id === undefined || id.length <= 0) {
        return;
      }
      this.detailRecord = await getHistoryDetail(id);
    }
  },
  watch: {
    currentId(newVal, oldVal) {
      this.refreshDetail(newVal);
    }
  },
  computed: {
    currentId() {
      return this.$store.state.history.currentId;
    }
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-1 min-h-0 overflow-auto">
    <div class="w-[260px] border-r border-r-[#F2F3F5] relative custom-aside" v-if="showHistorySideBar">
      <HistoryList/>
      <div class="go-to-left" @click.stop="goToLeft"></div>
    </div>
    <div v-else>
      <div class="go-to-right" @click.stop="goToRight"></div>
    </div>
    <div class="flex-1 h-full overflow-scroll hide-scroll-bar">
      <div v-if="$store.state.history.currentId.length <= 0" class="w-full h-full flex">
        <EmptyChat class-name="w-[calc(100%-300px)]"/>
        <SimilarQuestion/>
      </div>
      <div v-else class="w-full h-full">
        <HistoryPanel mode="sample" :record="detailRecord"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-aside {
  .go-to-left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -17px;
    color: #5F646C;
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    background-color: #F2F3F5;
    background-image: url(~@/assets/images/custom/go-to-left.svg);
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
  }
}

.go-to-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  left: -17px;
  color: #5F646C;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  background-color: #F2F3F5;
  background-image: url(~@/assets/images/custom/go-to-left.svg);
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  z-index: 2;
}
</style>
