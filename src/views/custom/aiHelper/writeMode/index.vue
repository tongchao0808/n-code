<template>
  <!-- 工作报告-work-report -->
  <div class="container-box">
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- 自定义面包屑 -->
      <slot name="breadcrumb" v-if="$slots.breadcrumb"></slot>
      <el-breadcrumb v-else class="w-full h-[55px] pl-[32px] flex items-center">
        <el-breadcrumb-item><a @click="onCancel">{{ homePath.title }}</a></el-breadcrumb-item>
        <el-breadcrumb-item class="font-bold">{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-chat-box w-full flex-1 overflow-hidden hide-scroll-bar flex justify-between gap-[8px]">
        <div class="flex-1 h-full flex justify-center overflow-hidden">
          <div v-if="mode === 'newChat'" class="h-full w-full flex justify-center">
            <!-- 自定义空状态 -->
            <slot name="emptyChat" v-if="$slots.emptyChat"></slot>
            <EmptyChat v-else :width="100" class-name="w-full max-w-[780px]" :do-send="doNewMessageSend" />
          </div>
          <div v-else class="message-container w-full h-full flex m-[0 auto] bg-white rounded-[16px] overflow-hidden">
            <MainChat ref="mainChat" source="index" :width="isPanelOpen ? 90 : 60" class-name="flex-1"
              :init-config="initConfig" @answer-end="onAnswerEnd"
              @initConfigChange="(config) => { initConfig = config }" @changeSession="changeSessionEvent">
            </MainChat>
            <slot name="chatPanel" v-if="$slots.chatPanel"></slot>
            <FileDetailPanel v-else-if="isPanelOpen" :editContent="editContent" @save="onSave"
              class="border-l-[1px] border-[#E5E5E5] w-[50%]" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="historySideBar" class="w-[260px] border-l border-l-[#E5E6EB] bg-white transition-all duration-300"
      :class="[historySideBarOpen ? '' : (mode == 'chat') ? 'w-[40px]' : 'w-0']">
      <HistoryList :use-this-session="useThisSession" />
    </div>
    <img src="@/assets/images/aihelper-bg.png" alt="Background Image" class="fullscreen-img" />
  </div>
</template>

<script>
import EmptyChat from "@/views/mainPage/EmptyChat.vue";
import SimilarQuestion from "@/views/mainPage/SimilarQuestion.vue";
import MainChat from "@/views/mainPage/MainChat.vue";
import HistoryList from "@/views/mainPage/components/HistoryList.vue";
import FileDetailPanel from "./components/FileDetailPanel.vue";
import { saveUserAnswer, checkUserAnswerChanged } from "@/api/custom/workReport";

export default {
  name: "writeMode",
  props: {
    scene: {
      type: String,
      default: 'work-report',
    },
    title: {
      type: String,
      default: '工作报告',
    },
    isPanelSlotOpen: {
      type: Boolean,
      default: false,
    },
    homePath: {
      type: Object,
      default: () => ({
        path: '/aiHelper/entry',
        title: 'AI智办助手',
      }),
    },
    historySideBar: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    HistoryList,
    MainChat,
    SimilarQuestion,
    EmptyChat,
    FileDetailPanel,
  },
  data() {
    return {
      initConfig: {},
      sessionUniqueId: "",
      editContent: '',
      saveAnswerData: {
        sessionUniqueId: '',
        aiMessageUniqueId: '',
        content: '',
      },
    };
  },
  watch: {
    mode: {
      handler(newVal) {
        if(newVal === 'newChat') {
          this.editContent = '';
          this.$emit('newChat');
        }
      },
    }
  },
  computed: {
    historySideBarOpen() {
      return this.$store.state.history.sidebarOpen;
    },
    mode() {
      return this.$store.state.mainPageChat.mode;
    },
    isPanelOpen() {
      const hasChatPanel = this.$slots.chatPanel;
      if(hasChatPanel) {
        return this.isPanelSlotOpen;
      }else{
        return !this.isEmptyOrMeaningless(this.editContent);
      }
    }
  },
  created() {
    this.$store.state.history.scene = this.scene;
    this.$store.state.mainPageChat.mode = "newChat";
    this.$store.state.history.sidebarOpen = false;
  },
  methods: {
    async doNewMessageSend(params) {
      this.initConfig = params;
      this.saveAnswerData.sessionUniqueId = params.sessionUniqueId;
      this.$store.state.mainPageChat.mode = "chat";
    },
    useThisSession(record) {
      this.initConfig = undefined;
      this.$store.state.mainPageChat.mode = "chat";
      const _this = this;
      this.$nextTick(() =>
        _this.$refs.mainChat.changeSession({ sessionUniqueId: record.sessionUniqueId, title: record.title})
      );
    },
    onCancel() {
      this.$tab.openPage(this.homePath.title, this.homePath.path);
    },
    onSave(content, callback) {
      this.saveAnswerData.content = content;
      saveUserAnswer(this.saveAnswerData).then(res => {
        if(res.code === 200) {
          callback && callback();
        } else {
          this.$message.error(res.msg || '保存失败');
        }
      })
    },
    onAnswerEnd(message) {
      this.saveAnswerData.aiMessageUniqueId = message.messageUniqueId;
      const content = this.extractContent(message.content.content).join('\n');
      if(content) {
        this.editContent = content;
      }
      this.$emit('answer-end', message);
    },
    changeSessionEvent(sessionUniqueId, chatHistory) {
      if(!sessionUniqueId || !chatHistory || chatHistory.length === 0) {
        return;
      }
      this.saveAnswerData.sessionUniqueId = sessionUniqueId;
      const params = {
        sessionUniqueId: sessionUniqueId,
        aiMessageUniqueId: chatHistory[chatHistory.length - 1].messageUniqueId
      }
      checkUserAnswerChanged(params).then(res => {
        if(res.code === 200) {
          this.editContent = res.data.content || '';
        }
      })
    },
    extractContent(str) {
      // 正则表达式匹配<Content>和</Content>之间的内容
      const regex = /<Content>([\s\S]*?)<\/Content>/g;
      const results = [];
      let match;
      while ((match = regex.exec(str)) !== null) {
        results.push(match[1]);
      }
      return results;
    },
    // 校验字符串是否为空或仅包含空标签或空白字符
    isEmptyOrMeaningless(str) {
      const trimmed = str.trim();
      if (trimmed === '') {
        return true;
      }
      const emptyTagPattern = /^[\s\n]*<[^>]*>\s*<\/[^>]*>[\s\n]*$/;
      return emptyTagPattern.test(trimmed);
    }
  },
};
</script>

<style scoped lang="scss">
.container-box {
  width: 100%;
  height: calc(100vh - 55px);
  overflow: hidden;
  display: flex;
}

.main-chat-box {
  padding: 0 32px 16px;
}
</style>
