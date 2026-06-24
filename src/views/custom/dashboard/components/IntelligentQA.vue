<template>
  <div
    class="bg-white pb-4 rounded-lg flex flex-col overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
  >
    <div
      class="flex justify-between items-center p-[16px] px-4 border-b border-[#E5E6EB]"
    >
      <span class="text-[24px] text-[#333333] font-bold">研小样智能助手</span>
      <div class="text-[14px] text-[#959ba1] flex items-center">
        <div class="w-[10px] h-[10px] rounded-full bg-[#6dd401] mr-[6px]"></div>
        研小样在线
      </div>
    </div>
    <div
      class="flex flex-col items-center justify-between flex-1 text-gray-400"
    >
      <!-- <img
        src="@/assets/images/index-ai-bg.png"
        alt="Intelligent QA"
        class="w-full"
      /> -->
      <div class="index-bg flex flex-col items-center justify-center w-full">
        <img
          src="@/assets/images/index-ai-bg.png"
          alt="Intelligent QA"
          class="w-[140px] mb-[12px]"
        />
        <div class="text-[#5F646c] text-[12px] mb-[4px]">
          你好，我是<span class="text-[#1d2129]" style="font-weight: bolder"
            >研小样</span
          >智能助手
        </div>
        <div class="text-[#5F646c] text-[12px]">有什么可以帮助你的吗？</div>
      </div>
      <div
        @click="handleJump"
        class="w-full px-4 flex flex-col items-center justify-between bg-white cursor-text transition-shadow"
      >
        <div
          class="w-full my-[8px] px-[12px] h-[56px] flex flex-row items-center justify-between border-[#3662FF] border rounded-2xl hover:shadow-md"
        >
          <el-input
            v-model="question"
            type="input"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="输入问题，与研小样对话……"
            resize="none"
            class="custom-textarea"
            @focus="handleJump"
          />
          <div
            class="flex w-[56px] h-[32px] py-1 px-4 rounded-[34px] bg-[#3662FF] hover:bg-[#2041FF] items-center justify-center ml-4 cursor-pointer text-white transition-colors"
          >
            <i class="el-icon-position text-[18px]"></i>
          </div>
        </div>

        <!-- <div
          class="flex flex-row items-center justify-between w-full h-[32px] "
        >
          <div class="flex justify-start w-full gap-[10px] overflow-hidden">
            <div
              class="flex flex-row items-center justify-start flex-1 gap-2 overflow-x-auto hide-scroll-bar"
            >
              <div
                v-for="model in modelList"
                :key="model.value"
                @click.stop="selectedModel = model.value"
                class="px-3 py-1 text-[12px] rounded border cursor-pointer whitespace-nowrap transition-colors select-none"
                :class="
                  selectedModel === model.value
                    ? 'bg-[#E8EFFF] text-[#3662FF] border-[#3662FF]'
                    : 'bg-white text-[#666666] border-[#E5E6EB] hover:border-[#3662FF] hover:text-[#3662FF]'
                "
                style="display: none"
              >
                {{ model.label }}
              </div>
            </div>
          </div>

          <div class="flex flex-row items-center justify-between flex-none">
            <div class="w-[1px] h-[26px] bg-[#E5E6EB] mx-4"></div>

            <div
              class="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center hover:bg-[#E8EFFF] cursor-pointer text-gray-500 transition-colors"
            >
              <i class="el-icon-paperclip text-[20px]"></i>
            </div>

            <div
              class="flex w-[56px] h-[32px] py-1 px-4 rounded-[34px] bg-[#3662FF] hover:bg-[#2041FF] items-center justify-center ml-4 cursor-pointer text-white transition-colors"
            >
              <i class="el-icon-position text-[18px]"></i>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntelligentQA",
  data() {
    return {
      useKnowledgeBase: true,
      question: "",
      selectedModel: "qwen3",
      modelList: [
        { label: "DeepSeek", value: "deepseek" },
        { label: "qwen3", value: "qwen3" },
        { label: "qwen2.5:latest", value: "qwen2.5" },
      ],
    };
  },
  methods: {
    handleJump() {
      this.$router.push({
        path: "/agent/agentMain",
      });
    },
  },
};
</script>

<style scoped>
::v-deep .custom-textarea .el-input__inner {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: #333333;
  font-size: 14px;
}

::v-deep .custom-textarea .el-input__inner:focus {
  outline: none;
  border: none;
  box-shadow: none;
}

::v-deep .custom-textarea .el-input__inner::placeholder {
  color: #c0c4cc;
  line-height: 42px;
}
.index-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(238, 246, 254, 1) 0%,
    rgba(240, 253, 244, 1) 100%
  );
}
</style>
