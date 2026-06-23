<script>
import EmptyChat from "@/views/mainPage/EmptyChat.vue";
import SimilarQuestion from "@/views/mainPage/SimilarQuestion.vue";
import MainChat from "@/views/mainPage/MainChat.vue";
import HistoryList from "@/views/mainPage/components/HistoryList.vue";

export default {
  name: "index",
  components: {
    HistoryList,
    MainChat,
    SimilarQuestion,
    EmptyChat
  },
  data() {
    return {
      exInput: "",
      initConfig: {},
      sessionUniqueId: "",
    }
  },
  created() {
    this.$store.state.history.scene = 'common';
    this.$store.state.mainPageChat.mode = 'newChat';
    this.$store.state.history.sidebarOpen = false;
  },
  mounted() {}, 
  methods: {
    async doNewMessageSend(params) {
      this.initConfig = params;
      this.$store.state.mainPageChat.mode = 'chat';
    },
    useThisSession(record) {
      this.initConfig = undefined;
      this.$store.state.mainPageChat.mode = 'chat';
      const _this = this;
      this.$nextTick(() => _this.$refs.mainChat.changeSession({ sessionUniqueId: record.sessionUniqueId, title: record.title}));
    },
  },
  computed: {
    historySideBarOpen() {
      return this.$store.state.history.sidebarOpen;
    },
    mode() {
      return this.$store.state.mainPageChat.mode
    }
  }
}
</script>

<template>
  <div class="w-full h-full overflow-y-scroll hide-scroll-bar flex flex-row justify-between relative">
    <div class="flex-1 w-full flex justify-center">
      <EmptyChat v-if="mode === 'newChat'" :width="90"
                 class-name="w-full max-w-[780px]"
                 :do-send="doNewMessageSend"/>
      <MainChat ref="mainChat" v-else source="index" :width="60"
                class-name="w-full"
                :init-config="initConfig"
                @initConfigChange="(config) => {initConfig = config}"/>
    </div>
    <div class="w-[260px] border-l border-l-[#E5E6EB] custom-aside transition-all duration-300" :class="{'w-[40px]': !historySideBarOpen}">
      <HistoryList :use-this-session="useThisSession"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
