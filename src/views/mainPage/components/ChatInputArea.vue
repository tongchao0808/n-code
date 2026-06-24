<script>
import LLMInput from "@/views/mainPage/components/LLMInput.vue";

import SuggestQuestions from "@/components/SuggestQuestions";
export default {
  name: "ChatInputArea",
  components: { LLMInput, SuggestQuestions },
  props: {
    initConfig: { type: Object, required: false },
    doSend: { type: Function, required: true },
    rows: { type: Number, required: false, default: 4 },
    showCreateButton: { type: Boolean, required: false, default: false },
    answerOptionChange: { type: Function, required: false, default: null },
    loading: { type: Boolean, required: false, default: false },
    simpleMode: { type: Boolean, required: false, default: false },
  },
  methods: {
    createNewChat() {
      this.$store.state.history.sidebarOpen = false;
      this.$store.state.mainPageChat.mode = "newChat";
    },
    handleQuestionSelect(question) {
      // 拿到子组件传过来的问题，填入输入框或直接发送
      // this.inputMessage = question.title || question;
      this.$refs.llm.callSend(question.name);
    },
  },
};
</script>

<template>
  <div class="w-full flex flex-col items-center gap-[8px] mt-[15px]">
    <div
      v-if="showCreateButton"
      class="w-full flex justify-between items-center gap-[8px]"
    >
      <div class="w-[calc(100%-120px)] overflow-auto">
        <SuggestQuestions layoutType="list" @select="handleQuestionSelect" />
      </div>

      <div
        class="new-answer-button cursor-pointer flex justify-center items-center gap-[5px] text-[#3662FF] bg-[#F5F8FF] hover:bg-[#E8EFFF] rounded-lg text-[14px] p-[8px] hover:scale-105"
        @click="createNewChat"
      >
        <svg-icon
          icon-class="chats"
          class-name="!w-[16px] !h-[16px] hover:rotate-12"
        />
        <span>开启新对话</span>
      </div>
    </div>
    <LLMInput
      ref="llm"
      class-name="w-full h-auto max-h-[230px]"
      :init-config="initConfig"
      :do-send="doSend"
      :rows="rows"
      :loading="loading"
      :answer-option-change="answerOptionChange"
      :simple-mode="simpleMode"
    />
    <div
      class="w-full flex justify-center text-[12px] leading-[24px] text-[#959BA1]"
    >
      内容由AI生成，仅供参考
    </div>
  </div>
</template>

<style scoped lang="scss">
.new-answer-button {
  transition: all 0.3s;
  width: 32px;
  height: 32px;
  overflow: hidden;
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    background-color: #f5f8ff;
  }
  span {
    transition: all 0.3s;
    position: absolute;
    min-width: 60px;
    top: 100%;
    transform: translateY(-50%);
    right: 8px;
    font-size: 12px;
    line-height: 15px;
    opacity: 0;
  }
}
.new-answer-button:hover {
  width: 100px;
  span {
    opacity: 1;
    top: 50%;
  }
}
</style>
