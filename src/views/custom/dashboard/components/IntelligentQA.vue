<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
  >
    <div
      class="flex justify-between items-center p-[16px] -mx-4 -mt-4 border-b border-[#E5E6EB]"
    >
      <span class="text-[24px] text-[#333333] font-bold">智能问答</span>
    </div>
    <div class="flex flex-col items-center justify-end flex-1 text-gray-400">
      <div
        @click="handleJump"
        class="w-full h-auto flex flex-col items-center justify-between py-2 px-4 border-[#3662FF] border rounded-2xl bg-white cursor-text transition-shadow hover:shadow-md"
      >
        <div class="flex justify-between w-full gap-[12px] h-[32px]">
          <div class="flex flex-row items-center justify-start flex-none">
            <div
              class="flex flex-row items-center justify-start gap-2"
              @click.stop
            >
              <el-switch v-model="useKnowledgeBase" size="small"></el-switch>
              <span
                class="text-[12px] leading-[15px] text-[#333333] font-medium"
                >生物样本库知识库</span
              >
            </div>
          </div>
        </div>

        <div class="w-full h-[1px] bg-[#E5E6EB] mt-[8px] mb-[8px]"></div>

        <div class="w-full my-[8px] min-h-[50px]">
          <el-input
            v-model="question"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="内容输入区 / 发消息或输入问题"
            resize="none"
            class="custom-textarea"
            @focus="handleJump"
          />
        </div>

        <div class="flex flex-row items-center justify-between w-full h-[32px]">
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
        </div>
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
::v-deep .custom-textarea .el-textarea__inner {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: #333333;
  font-size: 14px;
}

::v-deep .custom-textarea .el-textarea__inner:focus {
  outline: none;
  border: none;
  box-shadow: none;
}

::v-deep .custom-textarea .el-textarea__inner::placeholder {
  color: #c0c4cc;
}
</style>
