<script>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import CategoryCascader from "@/views/custom/history/components/CategoryCascader.vue";
import {getHistoryList, saveHistoryTitle} from "@/api/custom/history";
import {getGroupedHistories} from "@/views/custom/history/history";
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import GroupedList from "@/components/custom/history/GroupedList.vue";

export default {
  name: "FullHistoryList",
  components: {GroupedList, RenameDialog, CategoryCascader, PrimaryButton},
  data() {
    return {
      keyword: "",
      categories: [],
      pageIndex: 1,
      pageSize: 10,

      /** @type History[] */
      dataList: [],
      total: 0,

      hasMore: true,
    }
  },
  computed: {
    groupedHistories() {
      return getGroupedHistories(this.dataList);
    },
  },
  methods: {
    async doSearch() {
      const response = await getHistoryList(this.keyword, this.categories, this.pageIndex, this.pageSize);
      if (response === undefined || response.rows === undefined || response.rows.length <= 0) {
        this.hasMore = false;
        return;
      }
      if (this.pageIndex === 1) {
        this.dataList = response.rows;
      } else {
        this.dataList = [...this.dataList, ...response.rows];
      }
      this.total = response.total;
      this.pageIndex = this.pageIndex + 1;
    },
    buttonSearch() {
      this.pageIndex = 1;
      this.hasMore = true;
      this.doSearch();
    },

    async changeHistoryTitle(param) {
      const index = this.dataList.findIndex((e) => e.id === param.id);
      this.$set(this.dataList[index], 'title', param.value);
      await saveHistoryTitle(param.id, param.value);
    },

  },
  mounted() {
    this.doSearch();
  }
}
</script>

<template>
  <div class="w-full h-full px-9 py-6 flex flex-col gap-7">
    <div class="w-full flex justify-between items-center">
      <div class="text-[#1D2129] text-[24px] leading-[30px] font-bold">历史记录</div>
      <div class="flex gap-10 items-center">
        <div class="flex items-center justify-center gap-2">
          <el-input placeholder="请输入搜索关键字" v-model="keyword"/>
          <div class="w-[88px] h-[36px]">
            <PrimaryButton @click="buttonSearch" text="搜索"/>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2">
          <CategoryCascader v-model="categories"/>
          <div class="w-[88px] h-[36px]">
            <PrimaryButton @click="buttonSearch" text="筛选"/>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex-1 flex overflow-hidden">
      <div class="w-[55%] ml-[13%] 2xl:w-[48.54%] 2xl:ml-[17.15%] flex flex-col gap-5">
        <div class="flex justify-start items-center gap-[6px]">
          <span class="text-[#1D2129] font-bold">全部</span>
          <span class="text-[#959BA1]">{{ total }}条</span>
        </div>

        <div class="flex-1 overflow-y-auto overflow-x-hidden hide-scroll-bar">
          <div class="w-full flex flex-col gap-4"
               v-infinite-scroll="doSearch"
               :infinite-scroll-disabled="!hasMore">
            <GroupedList mode="full" :grouped-list="groupedHistories" @rename="changeHistoryTitle"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
