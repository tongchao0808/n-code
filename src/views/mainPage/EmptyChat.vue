<script>
import FunctionShortcut from "@/components/custom/FunctionShortcut.vue";
import LLMInput from "@/views/mainPage/components/LLMInput.vue";
import {createNewChatSession} from "@/api/custom";
import { getEmptyChatTitle, getEmptyChatDesc } from "@/plugins/aiAnserConfig";

export default {
  name: "EmptyChat",
  components: {
    FunctionShortcut, LLMInput
  },
  props: {
    className: {type: String, required: false, default: ""},
    width: {type: Number, required: false, default: 85},
    doSend: {type: Function, required: true,},
    simpleMode: {type: Boolean, required: false, default: false},
    initConfig: {type: Object, required: false, default: null},
  },
  data() {
    return {

    }
  },
  async mounted() {
  },
  computed: {
    getTitle(){
      return getEmptyChatTitle()
    },
    getDesc(){
      return getEmptyChatDesc()
    }
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
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full h-full" :class="className">
    <div class="flex flex-col items-center" :style="{width: `${width}%`}">
      <div class="mt-[160px] mb-[40px] text-[36px] leading-[48px] font-bold text-[#1D2129] font-ms-yahei"
        :class="getDesc?'mb-[8px]':'mb-[40px]'">{{getTitle}}</div>
      <div v-if="getDesc" class="mb-[40px] text-[16px] leading-[48px] text-[#1D2129] font-ms-yahei">{{getDesc}}</div>
      <LLMInput class-name="w-full h-auto" :do-send="onNewMessageSend" :rows="2" :simple-mode="simpleMode" :init-config="initConfig" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
