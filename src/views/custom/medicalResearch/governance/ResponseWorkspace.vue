<script>
import OperateButtonGroup from "@/components/custom/button/OperateButtonGroup.vue";
import Markdown from "@/components/custom/md/Markdown.vue";
import StructureViewer from "@/views/custom/medicalResearch/governance/StructureViewer.vue";
import HistoryDrawer from "@/views/custom/medicalResearch/governance/HistoryDrawer.vue";
import AffixTools from "@/components/custom/chat/common/AffixTools.vue";

export default {
  name: "ResponseWorkspace",
  components: {AffixTools, HistoryDrawer, StructureViewer, Markdown, OperateButtonGroup},
  computed: {
    bindChat: {
      get() {
        return this.$store.state.governance.chat
      },
      set(nValue) {
        this.$store.state.governance.chat = nValue;
      }
    },
    chatTitle() {
      if (this.bindChat === undefined || this.bindChat.title === undefined || this.bindChat.title.length <= 0) {
        return "未命名对话"
      }
      return this.bindChat.title;
    },
  },
  data() {
    return {
      activeButton: "病历标注",
      showHistorySideDrawer: false,
    }
  },
  methods: {
    openHistorySideDrawer() {
      this.showHistorySideDrawer = true;
    }
  }
}
</script>

<template>
  <div class="w-full h-full py-2 flex flex-col relative" v-if="bindChat">
    <div class="w-full flex justify-between items-center">
      <div class="w-full px-6 text-[16px] text-[#3662FF] font-bold">生成结果</div>
      <div class="pr-8">
        <OperateButtonGroup refresh="reGenerate"
                            copy="() => copyChat(bindChat)"
                            download="() => downloadChat(bindChat)"
                            remove="removeCurrentChat"/>
      </div>
    </div>
    <div class="w-full flex-1 flex flex-col overflow-y-auto hide-scroll-bar" ref="contentCanvas">
      <div class="px-6 py-2 w-full border-b border-b-[#49576414]">{{ chatTitle }}</div>
      <div class="px-6 w-full h-full flex flex-col gap-2">
        <div class="flex">
          <div class="rounded-[35px] bg-[#F2F3F5] p-1 h-[42px] inline-flex items-center mt-3 text-[#5F646C]">
            <div :class="`px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out ${activeButton === '病历标注' ? 'bg-white rounded-[35px] text-[#3662FF]' : ''}`"
                 @click="() => activeButton = '病历标注'">病历标注</div>
            <div :class="`px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out ${activeButton === '结构化数据' ? 'bg-white rounded-[35px] text-[#3662FF]' : ''}`"
                 @click="() => activeButton = '结构化数据'">结构化数据</div>
            <div :class="`px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out ${activeButton === '树形数据' ? 'bg-white rounded-[35px] text-[#3662FF]' : ''}`"
                 @click="() => activeButton = '树形数据'">树形数据</div>
          </div>
        </div>
      </div>
      <div class="px-6 w-full flex mt-8">
        <StructureViewer :record="bindChat.record" v-if="activeButton === '结构化数据'"/>
      </div>
      <HistoryDrawer :show="showHistorySideDrawer"/>
      <AffixTools scroll-to-top="" :ai-history="openHistorySideDrawer"
                  toggle-language="" full-screen=""/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
