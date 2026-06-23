<template>
  <div class="container-box">
    <div class="w-full h-full overflow-hidden hide-scroll-bar flex flex-row justify-between gap-[8px]">
    <div class="flex-1 w-full flex justify-center">
      <EmptyChat v-if="mode === 'newChat'" :width="100"
                 class-name="w-full max-w-[780px]"
                 :do-send="doNewMessageSend"/>
      <MainChat ref="mainChat" v-else source="index" :width="60"
                class-name="w-full bg-white rounded-[16px]"
                :init-config="initConfig"
                @initConfigChange="(config) => {initConfig = config}"/>
    </div>
    <transition name="fade">
      <div v-if="historySideBarOpen" class="w-[368px] bg-white rounded-[16px]">
        <HistoryList :use-this-session="useThisSession"/>
      </div>
    </transition>
  </div>
  </div>
</template>

<script>
import EmptyChat from "@/views/mainPage/EmptyChat.vue";
import SimilarQuestion from "@/views/mainPage/SimilarQuestion.vue";
import MainChat from "@/views/mainPage/MainChat.vue";
import HistoryList from "@/views/mainPage/components/HistoryList.vue";

export default {
  name: "agentMain",
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
    this.$store.state.history.scene = 'sop-agent';
    this.$store.state.mainPageChat.mode = 'newChat';
    this.$store.state.history.sidebarOpen = false;
  },
  methods: {
    async doNewMessageSend(params) {
      this.initConfig = params;
      this.$store.state.mainPageChat.mode = 'chat';
    },
    useThisSession(record) {
      this.initConfig = undefined;
      this.$store.state.mainPageChat.mode = 'chat';
      const _this = this;
      this.$nextTick(() => _this.$refs.mainChat.changeSession({sessionUniqueId: record.sessionUniqueId, title: record.title}));
    }
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

<style scoped lang="scss">
.container-box {
  width: 100%;
  height: calc(100vh - 103px);
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: 24px 0;
}

/* 进入动画 - 起始状态 */
.fade-enter-from {
  opacity: 0;
  transform: translateX(-360px);
}

/* 进入和离开动画的共同活跃状态 */
.fade-enter-active,
.fade-leave-active {
  /* 关键：设置过渡属性和时长 */
  transition: all 0.3s ease;
}

/* 离开动画 - 结束状态 */
.fade-leave-to {
  opacity: 0;
  transform: translateX(368px);
}

</style>
