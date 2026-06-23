<script>
import FunctionShortcut from "@/components/custom/FunctionShortcut.vue";
import FunctionTitle from "@/components/custom/FunctionTitle.vue";
import {getAuxiliaryWorkFunctions} from "@/api/custom/auxiliaryWork";

export default {
  name: "AiHelperEntry",
  components: {FunctionShortcut, FunctionTitle},
  data() {
    return {
      functions: [],
    }
  },
  async mounted() {
    let functionResp = await getAuxiliaryWorkFunctions();
    this.functions = functionResp;
  },
  methods: {
    onFunctionClick(functionItem) {
      if (!functionItem.path) {
        return;
      }
      this.$tab.openPage(functionItem.title, functionItem.path);
    }
  }
}
</script>

<template>
<div class="flex flex-col items-center w-full h-full overflow-hidden relative">
  <FunctionTitle title="AI智办助手" class-name="mt-[160px]"/> 
  <div class="w-full flex justify-center gap-[20px] mt-[40px]">
    <div class="agent-box" @click="$tab.openPage('智能体', '/agent/agentMain')">
        <img src="@/assets/images/agent-logo.png" class="agent-log w-[96px] h-[96px]" />
        <span class="text-[14px] leading-[18px] text-[#fff]">质量管理智能体</span>
        <span class="text-[12px] leading-[16px] text-[#ffffff88]">支持语音转文字，会议纪要生成等</span>
    </div>
  <div class="w-[920px] flex flex-wrap gap-2 2xl:gap-4">
    <div class="w-[292px] h-[128px]" v-for="functionItem in functions">
      <FunctionShortcut
        :title="functionItem.title"
        :icon="functionItem.icon"
        :desc="functionItem.desc"
        @click="() => onFunctionClick(functionItem)"
      />
    </div>
  </div>
  </div>

  <img src="@/assets/images/aihelper-bg.png" alt="Background Image" class="fullscreen-img" />
</div>
</template>

<style scoped lang="scss">
.fullscreen-img {
  // 固定定位，确保图片覆盖整个视口
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  // 关键属性：让图片填充整个区域并裁剪多余部分
  object-fit: cover;
  object-position: center; // 图片内容居中显示

  // 将图片放置在最底层，使其作为背景
  z-index: -10;
}
.agent-box {
    width: 260px;
    height: 276px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border-radius: 16px;
    background: linear-gradient(180.00deg, rgba(192, 170, 253, 1), rgba(104, 137, 255, 1) 100%);
    cursor: pointer;

    &:hover {
            background: linear-gradient(180.00deg, rgba(175, 147, 255, 1), rgba(58, 102, 255, 1) 100%);
        }
}
</style>
