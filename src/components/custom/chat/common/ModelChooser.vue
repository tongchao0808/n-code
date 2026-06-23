<script>
import {getModels} from "@/api/custom/common";

export default {
  name: "ModelChooser",
  props: {
    value: {type: String, required: true},
  },
  data() {
    return {
      /** @type ModelOption[] */
      models: [],
    }
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(nValue) {
        this.$emit("input", nValue);
      }
    },
    currentSelectModelName() {
      if (this.models === undefined || this.models.length === 0) {
        return "";
      }
      const selectModel = this.models.find(item => item.value === this.bindValue);
      if (selectModel === undefined || selectModel === null) {
        return "";
      }
      return selectModel.label;
    }
  },
  methods: {
    handleClick(command) {
      this.bindValue = command;
    },
    async loadModels() {
      this.models = await getModels();
    }
  },
  mounted() {
    this.loadModels();
  },
  watch: {
    value: {
      immediate: true,
      handler(nValue) {
        if (nValue === null || nValue === undefined) {
          if (this.models != null && this.models.length > 0) {
            this.bindValue = this.models[0].value;
          }
        }
      }
    }
  }
}
</script>

<template>
  <div class="w-full flex items-center">
    <div v-if="currentSelectModelName.length > 0"
         class="h-8 mr-2 border border-[#E8EFFF] bg-[#E8EFFF] rounded-lg px-4 py-1 text-[12px] leading-[22px] flex justify-center items-center cursor-pointer whitespace-nowrap">
      {{ currentSelectModelName }}
    </div>
    <el-dropdown trigger="click" @command="handleClick">
      <div
        class="h-8 border border-[#e5e6eb] bg-white rounded-lg px-4 py-1 text-[12px] leading-[22px] flex justify-center items-center gap-2 cursor-pointer whitespace-nowrap">
        <span>选择模型</span>
        <svg-icon icon-class="right-arrow" class-name="!w-[14px] !h-[14px] text-[#4e5969]"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        <el-dropdown-item v-for="(option, index) in models" :key="index" :command="option.value">
          <div :class="`w-full flex items-center gap-1 ${bindValue === option.value ? 'bg-[#E8EFFF]' : ''}`">
            <span class="text-[#1D2129] text-[14px]">{{ option.label }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.custom-dropdown-menu {
  padding: 4px !important;
  border-radius: 8px;
  margin-top: 2px;

  ::v-deep .el-dropdown-menu__item {
    padding: 8px !important;
    line-height: 14px !important;
    border-radius: 8px;

    &:hover {
      background: #F2F3F5;
    }
  }

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
