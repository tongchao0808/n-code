<script>
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import Markdown from "@/components/custom/md/Markdown.vue";
import OperateButtonGroup from "@/components/custom/button/OperateButtonGroup.vue";
import EmptyPlaceholder from "@/components/custom/chat/common/EmptyPlaceholder.vue";
import AffixTools from "@/components/custom/chat/common/AffixTools.vue";
import {addToKnowledge, copyChat, downloadChat, removeChat} from "@/api/custom/chat";
import HistoryListDrawer from "@/components/custom/chat/history/HistoryListDrawer.vue";

export default {
  name: "AIGenerateWorkspace.vue",
  components: {AffixTools, EmptyPlaceholder, HistoryListDrawer, OperateButtonGroup, Markdown, RecordDropdown},
  props: {
    chat: {type: Object, required: false},
    toggleLanguage: {type: Function, required: true},
    reGenerate: {type: Function, required: true},
  },
  data() {
    return {
      historySideDrawerShow: false,
    }
  },
  computed: {
    bindChat: {
      get() {
        return this.chat;
      },
      set(nValue) {
        this.$emit("update:chat", nValue);
      }
    },
    hasResponse() {
      return this.bindChat === undefined || this.bindChat.think.length <= 0;
    },
    chatTitle() {
      if (this.bindChat === undefined) {
        return "未命名对话"
      }
      return this.bindChat.title;
    },
    chatThink() {
      if (this.bindChat === undefined) {
        return ""
      }
      return this.bindChat.think;
    },
    chatContent() {
      if (this.bindChat === undefined) {
        return ""
      }
      return this.bindChat.content;
    },
  },
  methods: {
    downloadChat,
    copyChat,
    async removeCurrentChat() {
      await removeChat(this.bindChat);
      this.bindChat = {
        title: "",
        think: "",
        content: "",
      };
    },
    async addCurrentChatToKnowledge() {
      // TODO 弹窗选择知识库列表?
      await addToKnowledge(this.bindChat);
    },
    fullScreen() {
    },
    openAIHistorySideDrawer() {
      this.historySideDrawerShow = true;
    },
    scrollToTop() {
      const container = this.$refs.contentCanvas;
      if (container) {
        container.scrollTo({top: 0, behavior: 'smooth'});
      }
    },
  }
}
</script>

<template>
  <div class="w-full h-full py-2 flex flex-col relative" v-if="bindChat">
    <div class="w-full flex justify-between items-center">
      <div class="w-full px-6 text-[16px] text-[#3662FF] font-bold">生成结果</div>
      <div class="pr-8">
        <OperateButtonGroup :refresh="reGenerate"
                            :copy="() => copyChat(bindChat)"
                            :download="() => downloadChat(bindChat)"
                            :remove="removeCurrentChat"
                            :add-to-kg="addCurrentChatToKnowledge"/>
      </div>
    </div>
    <div v-if="hasResponse" class="w-full flex-1 flex justify-center items-center">
      <EmptyPlaceholder/>
    </div>
    <div v-else class="w-full flex-1 flex flex-col overflow-y-auto hide-scroll-bar" ref="contentCanvas">
      <div class="px-6 py-2 w-full border-b border-b-[#49576414]">{{ chatTitle }}</div>
      <div class="px-6 w-full h-full flex flex-col gap-2">
        <div class="bg-[#e8e8e8] rounded-lg px-8 py-4">{{ chatThink }}</div>
        <div class="w-full" v-loading="chatContent.length <= 0">
          <Markdown :content="chatContent"/>
        </div>
      </div>
    </div>
    <div>
      <AffixTools :scroll-to-top="scrollToTop"
                  :ai-history="openAIHistorySideDrawer"
                  :toggle-language="toggleLanguage"
                  :full-screen="fullScreen"/>
      <HistoryListDrawer :show.sync="historySideDrawerShow"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
