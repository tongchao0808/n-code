<script>
import FunctionTitle from "@/components/custom/FunctionTitle.vue";
import FunctionCategory from "@/components/custom/FunctionCategory.vue";
import {getResearchFunctions} from "@/api/custom/researchAssistance";
import FunctionShortcut from "@/components/custom/FunctionShortcut.vue";

export default {
  name: "assistance.vue",
  components: {FunctionShortcut, FunctionCategory, FunctionTitle},
  data() {
    return {
      categories: [],
      functions: [],
      filteredFunctions: [],
      activeCategory: ""
    }
  },
  async mounted() {
    let functionResp = await getResearchFunctions();
    this.functions = functionResp;
    let categories = [{label: "全部"}];
    functionResp.forEach((item) => {
      if (categories.findIndex(t => t.label === item.category) < 0) {
        categories.push({label: item.category});
      }
    });
    this.categories = categories;
    this.filteredFunctions = this.functions;
  },
  methods: {
    onCategoryClick(category) {
      this.activeCategory = category === "全部" ? "" : category;
      let _this = this;
      this.filteredFunctions = this.functions.filter(t => {
        return _this.activeCategory === "" || (_this.activeCategory !== "" && t.category === _this.activeCategory);
      })
    },
    onFunctionClick(functionItem) {
      if (!functionItem.path) {
        return;
      }
      this.$tab.openPage(functionItem.title, functionItem.path, {chatCategory: functionItem.title});
    }
  }
}
</script>

<template>
<div class="flex flex-col items-center w-full h-full overflow-hidden">
  <FunctionTitle title="科研辅助" class-name="mt-[88px]" />
  <div class="w-[85%] flex flex-row items-center justify-start max-w-[800px] my-[45px]">
    <FunctionCategory
      v-for="item in categories"
      :label="item.label"
      :active="(item.label === '全部' && activeCategory === '') || activeCategory === item.label"
      class-name="mr-8"
      :key="item.label"
      @click="() => onCategoryClick(item.label)"
    />
  </div>
  <div class="w-[85%] max-w-[800px] flex flex-wrap gap-2 2xl:gap-4">
    <div class="w-[252px] h-[110px]" v-for="functionItem in filteredFunctions">
      <FunctionShortcut
        :title="functionItem.title"
        :icon="functionItem.icon"
        :desc="functionItem.desc"
        class-name="mt-4"
        @click="() => onFunctionClick(functionItem)"
      />
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">

</style>
