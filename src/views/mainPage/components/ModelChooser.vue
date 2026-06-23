<script>
import { getModelList } from "@/api/custom";

export default {
  name: "ModelChooser",
  props: {
    value: { type: String, required: true },
  },
  data() {
    return {
      dataList: [],
    };
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.checkModelExist(newValue);
      }
    },
  },
  methods: {
    async reloadModels() {
      this.dataList = await getModelList();
      this.checkModelExist(this.bindValue);
    },
    checkModelExist(modelValue) {
      if (this.dataList.length) {
        const index = this.dataList.findIndex(
          (item) => item.modelValue === modelValue
        );
        if (index === -1) {
          this.bindValue = this.dataList[0].modelValue;
        }
      }
    },
  },
  mounted() {
    this.reloadModels();
  },
};
</script>

<template>
  <div
    class="flex flex-row items-center justify-start flex-1 overflow-x-scroll hide-scroll-bar"
    style="display: none"
  >
    <div
      v-for="(modelItem, index) in dataList"
      :key="index"
      :class="`model-item ${
        value === modelItem.modelValue ? 'model-item-selected' : ''
      }`"
      @click.stop="bindValue = modelItem.modelValue"
    >
      {{ modelItem.modelName }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.model-item {
  height: 32px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 5px 16px 5px 16px;
  font-family: Microsoft YaHei UI, serif;
  font-size: 12px;
  line-height: 22px;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  margin-right: 8px;
  white-space: nowrap;
}

.model-item:hover {
  color: #3662ff;
  background-color: #e8efff;
  border-color: #e8efff;
}

.model-item-selected {
  color: #3662ff;
  background-color: #e8efff;
  border-color: #e8efff;
}
</style>
