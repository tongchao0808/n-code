<script>
import {getKnowledgeBaseList} from "@/api/custom/customKnowledgeBase";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";

export default {
  name: 'Sidebar',
  components: {NewKnowledgeBaseDialog},
  props: {
    changeSelectedKnowledgeBase: {type: Function, required: true},
  },
  data() {
    return {
      dataList: [],
      showAddNewKnowledgeBaseDialog: false,
      selectedIds: "",
    }
  },
  async mounted() {
    await this.refreshList();
  },
  methods: {
    onAddNewKnowledgeBaseClick() {
      this.showAddNewKnowledgeBaseDialog = true;
    },
    async onAddNewKnowledgeBase() {
      // TODO 调用接口添加
      await this.refreshList();
      this.closeAddNewKnowledgeBaseDialog();
    },
    closeAddNewKnowledgeBaseDialog() {
      this.showAddNewKnowledgeBaseDialog = false;
    },
    async refreshList() {
      let resp = await getKnowledgeBaseList();
      console.log("*** resp: ", resp);
      let countAll = resp.reduce((k1, k2) => {return k1 + k2.count}, 0);
      this.knowledgeBases = [{id: "", name: "全部", count: countAll}, ...resp]
    },
    selectKnowledgeBase(knowledgeBase) {
      this.selectedKnowledgeBase = knowledgeBase.id;
      this.changeSelectedKnowledgeBase(knowledgeBase);
    }
  }
}
</script>

<template>
<div class="w-[260px] h-full py-2 px-4 flex flex-col items-center border-r-[1px] border-[#E5E6EB]">
  <div class="w-[220px] h-[52px] flex flex-row items-center justify-start py-[5px] px-4 rounded-lg cursor-pointer ml-auto" @click.stop="onAddNewKnowledgeBaseClick">
    <svg-icon icon-class="llm-add-knowledge" />
    <div class="text-[14px] font-ms-yahei leading-[18px] text-center ml-1 text-[#3662FF]">新建知识库</div>
  </div>
  <div v-for="item in knowledgeBases"
       :key="item.id"
       class="w-full h-[52px] py-3 px-4 flex flex-row items-center text-[14px] leading-[28px] cursor-pointer hover:bg-[#E8EFFF] rounded"
       :class="item.id === selectedKnowledgeBase ? 'selected' : ''"
       @click.stop="() => selectKnowledgeBase(item)"
  >
    <div class="text-[#1D2129]">{{ item.name }}</div>
    <div class="text-[#C9CDD4]">（{{ item.count }}）</div>
    <svg-icon v-if="item.id !== ''" icon-class="knowledge-path" class-name="ml-auto" />
  </div>

  <NewKnowledgeBaseDialog :show="showAddNewKnowledgeBaseDialog"
                          :on-ok="onAddNewKnowledgeBase"
                          :on-cancel="closeAddNewKnowledgeBaseDialog"
  />
</div>
</template>

<style scoped lang="scss">
.selected {
  background: #E8EFFF;
}
</style>
