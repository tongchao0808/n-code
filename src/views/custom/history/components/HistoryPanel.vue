<script>
import OperateButtonGroup from "@/components/custom/button/OperateButtonGroup.vue";
import {addHistoryToKg, downloadHistory, removeHistory} from "@/api/custom/history";
import Markdown from "@/components/custom/md/Markdown.vue";

export default {
  name: "HistoryPanel",
  components: {Markdown, OperateButtonGroup},
  props: {
    // sample or full
    mode: {type: String, required: true},
    record: {type: Object, required: false},
    backRoute: {type: Object, required: false, default: "null"},
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.record.content);
      this.$notify({
        title: '复制成功',
        message: '历史记录已经复制到剪切板中',
        type: 'success'
      });
    },
    async addToKg() {
      await addHistoryToKg(this.record.id);
    },
    async remove() {
      await removeHistory(this.record.id);
    },
    async download() {
      await downloadHistory(this.record.id);
    },
    goBack() {
      if (this.backRoute) {
        this.$tab.openPage(this.backRoute.title, this.backRoute.url, undefined);
      } else {
        this.$tab.openPage('历史记录列表', 'fullHistoryList', undefined);
      }
    }
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col gap-6 pb-5">
    <div
      :class="`w-full pl-9 pr-8 py-[6px] border-b border-b-[#E5E6EB] flex ${mode === 'full' ? 'justify-between' : 'justify-end'} items-center`">
      <div v-if="mode === 'full'">
        <div class="w-[66px] h-[32px] flex justify-center items-center gap-1 rounded-lg bg-[#E8EFFF] cursor-pointer"
             @click="goBack">
          <svg-icon icon-class="back" class="!w-[18px] !h-[18px] text-[#3662FF]"/>
          <span class="text-[14px] text-[#3662FF]">返回</span>
        </div>
      </div>
      <div>
        <OperateButtonGroup :copy="copy" :add-to-kg="addToKg" :remove="remove" :download="download"/>
      </div>
    </div>

    <div class="w-full flex-1 flex overflow-scroll hide-scroll-bar">
      <div
        :class="`${mode === 'sample' ? 'w-[65%] ml-[13%] 2xl:w-[55.54%] 2xl:ml-[14.15%]' : 'w-[55%] ml-[13%] 2xl:w-[48.54%] 2xl:ml-[17.15%]'} h-full flex flex-col gap-6`">
        <div class="w-full flex justify-between items-center border-b border-b-[#495764]">
          <div class="w-[calc(100%-110px)]">
            <div class="w-full truncate text-[#1D2129] text-[16px] font-bold">{{ record && record.title }}</div>
          </div>
          <div>
            <span class="text-[12px] text-[#959BA1]">{{ record && record.dateTime.substr(0, 10) }}</span>
          </div>
        </div>
        <div class="w-full flex flex-col gap-6 text-[14px] text-[#1D2129] leading-7">
          <Markdown :content="record && record.content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
