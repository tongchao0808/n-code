<template>
  <div
    class="layout-container grid w-full h-full"
    style="grid-template-columns: 120fr 44fr"
  >
    <div class="left-panel flex flex-col h-full p-6">
      <div class="container-box">
        <div
          class="w-full h-full overflow-hidden hide-scroll-bar flex flex-row justify-between gap-[8px]"
        >
          <div class="w-full flex justify-center">
            <EmptyChat
              v-if="mode === 'newChat'"
              :width="100"
              class-name="w-full "
              :do-send="doNewMessageSend"
            />
            <MainChat
              ref="mainChat"
              v-else
              source="index"
              :width="85"
              class-name="w-full  rounded-[16px]"
              :init-config="initConfig"
              @initConfigChange="
                (config) => {
                  initConfig = config;
                }
              "
            />
          </div>
          <transition name="fade">
            <div
              v-if="historySideBarOpen"
              class="w-[368px] bg-white rounded-[16px]"
            >
              <HistoryList :use-this-session="useThisSession" />
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div
      class="right-panel flex flex-col items-center justify-start h-full p-4 overflow-hidden hide-scroll-bar"
    >
      <img src="@/assets/images/yxy-status.png" alt="right" class="w-[76px]" />
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
    EmptyChat,
  },
  data() {
    return {
      exInput: "",
      initConfig: {},
      sessionUniqueId: "",
    };
  },
  created() {
    this.$store.state.history.scene = "sop-agent";
    this.$store.state.mainPageChat.mode = "newChat";
    this.$store.state.history.sidebarOpen = false;
  },
  methods: {
    async doNewMessageSend(params) {
      this.initConfig = params;
      this.$store.state.mainPageChat.mode = "chat";
    },
    useThisSession(record) {
      this.initConfig = undefined;
      this.$store.state.mainPageChat.mode = "chat";
      const _this = this;
      this.$nextTick(() =>
        _this.$refs.mainChat.changeSession({
          sessionUniqueId: record.sessionUniqueId,
          title: record.title,
        })
      );
    },
  },
  computed: {
    historySideBarOpen() {
      return this.$store.state.history.sidebarOpen;
    },
    mode() {
      return this.$store.state.mainPageChat.mode;
    },
  },
};
</script>

<style scoped lang="scss">
.layout-container {
  height: calc(100vh - 55px); /* 根据你实际的 Header 高度调整 */
  background: linear-gradient(
      180deg,
      rgba(245, 251, 255, 0.85) 0%,
      rgba(231, 245, 255, 0.75) 50%,
      rgba(227, 243, 255, 0.1) 100%
    ),
    url("~@/assets/images/ai-bg.png") right/cover no-repeat;
  .right-panel {
    background: url("~@/assets/images/yxy-l.png") center no-repeat;
    // background-size: 100%;
  }
}
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
