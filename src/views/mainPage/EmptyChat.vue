<script>
import FunctionShortcut from "@/components/custom/FunctionShortcut.vue";
import LLMInput from "@/views/mainPage/components/LLMInput.vue";
import { createNewChatSession } from "@/api/custom";
import { getEmptyChatTitle, getEmptyChatDesc } from "@/plugins/aiAnserConfig";
import SuggestQuestions from "@/components/SuggestQuestions";
export default {
  name: "EmptyChat",
  components: {
    FunctionShortcut,
    LLMInput,
    SuggestQuestions,
  },
  props: {
    className: { type: String, required: false, default: "" },
    width: { type: Number, required: false, default: 85 },
    doSend: { type: Function, required: true },
    simpleMode: { type: Boolean, required: false, default: false },
    initConfig: { type: Object, required: false, default: null },
  },
  data() {
    return {};
  },
  async mounted() {},
  computed: {
    getTitle() {
      return getEmptyChatTitle();
    },
    getDesc() {
      return getEmptyChatDesc();
    },
  },
  methods: {
    async onNewMessageSend(params) {
      const chatParam = { ...params };
      if (!chatParam.sessionUniqueId) {
        const conn = await createNewChatSession();
        chatParam.sessionUniqueId = conn.sessionUniqueId;
      }
      this.doSend(chatParam);
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
  <div
    class="flex flex-col items-center justify-between w-full h-full px-[16px] py-[12px]"
    :class="className"
  >
    <div></div>
    <div>
      <div class="text-[#1d2129] text-[24px] text-center font-bold mb-[12px]">
        你好，有什么可以帮你？
      </div>
      <div class="text-[#5f646c] text-[14px] text-center mb-[24px]">
        选择快捷问题活或直接输入内容开始对话
      </div>
      <SuggestQuestions layoutType="grid" @select="handleQuestionSelect" />
    </div>

    <div class="flex flex-col items-center" :style="{ width: `${width}%` }">
      <div
        class="hidden mt-[160px] mb-[40px] text-[36px] leading-[48px] font-bold text-[#1D2129] font-ms-yahei"
        :class="getDesc ? 'mb-[8px]' : 'mb-[40px]'"
      >
        {{ getTitle }}
      </div>
      <div
        v-if="getDesc"
        class="mb-[40px] text-[16px] leading-[48px] text-[#1D2129] font-ms-yahei"
      >
        {{ getDesc }}
      </div>
      <LLMInput
        ref="llm"
        class-name="w-full h-auto"
        :do-send="onNewMessageSend"
        :rows="1"
        :simple-mode="simpleMode"
        :init-config="initConfig"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
