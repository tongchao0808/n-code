<template>
  <div
    class="suggest-questions-wrapper flex flex-wrap gap-2"
    v-loading="loading"
  >
    <div
      v-if="layoutType === 'list'"
      class="list-layout flex items-center gap-[8px]"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        size="mini"
        @click="handleSelect(item)"
        class="custom-btn-list"
      >
        {{ item.name }}
      </div>
    </div>

    <div v-else-if="layoutType === 'grid'" class="grid grid-cols-2 gap-[16px]">
      <div
        v-for="(item, index) in list"
        :key="index"
        size="mini"
        class="!w-full !m-0 custom-btn"
        @click="handleSelect(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
// 1. 引入你统一定义的接口
import { xiaoyang } from "@/api/custom/chat";

export default {
  name: "SuggestQuestions",
  props: {
    layoutType: {
      type: String,
      default: "list", // 'list' 或 'grid'
    },
    sceneType: {
      type: String,
      default: "default",
    },
  },
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        // 调用接口，传入参数
        const res = await xiaoyang();
        console.log("res", res);
        this.list = res.data.suggestions || [];
      } catch (error) {
        console.error("获取建议列表失败", error);
      } finally {
        this.loading = false;
      }
    },
    handleSelect(item) {
      // 2. 纯展示组件，不处理业务，只把点击的数据抛给父组件
      this.$emit("select", item);
    },
  },
};
</script>
<style scoped lang="scss">
.custom-btn {
  /* 尺寸与定位 */

  // height: 43px;

  /* 圆角 */
  font-size: 14px;
  border-radius: 16px;
  padding: 12px 16px;
  /* 颜色与边框 */
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 230, 235, 1);
  color: #1d2129;

  text-align: left;
  /* 阴影效果 */
  box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
    0px 5px 7px 0px rgba(65, 114, 209, 0.08);
  cursor: pointer;
}
.custom-btn-list {
  /* 尺寸与定位 */

  // height: 43px;

  /* 圆角 */
  font-size: 12px;
  border-radius: 16px;
  padding: 8px;
  /* 颜色与边框 */
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 230, 235, 1);
  color: #1d2129;

  text-align: left;
  /* 阴影效果 */
  // box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
  //   0px 5px 7px 0px rgba(65, 114, 209, 0.08);
  white-space: nowrap;
  cursor: pointer;
}
</style>
