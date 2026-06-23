<script>
import ModelChooser from "@/views/mainPage/components/ModelChooser.vue";
import UserInputOperations from "@/views/mainPage/components/UserInputOperations.vue";
import UserInputOptions from "@/views/mainPage/components/UserInputOptions.vue";
import TreeSelect from "@/views/mainPage/components/TreeSelect.vue";
import FileList from "@/components/FileUpload/FileList.vue";
import UploadButton from "@/views/mainPage/components/UploadButton.vue";
import NoteActionButtons from "@/views/mainPage/components/NoteActionButtons.vue";
import { nanoid } from "nanoid";
import { getCustomKnowledgeBaseTree } from "@/api/custom/customKnowledgeBase";
import { getCustomKnowledgeBaseList } from "@/api/custom/customKnowledgeBase";
import {isWriteMode, isDeepThinkMode, isMustUploadAttach, getLLMInputPlaceholder} from "@/plugins/aiAnserConfig.js";

export default {
  name: "LLMInput",
  components: {
    UserInputOptions,
    UserInputOperations,
    ModelChooser,
    TreeSelect,
    FileList,
    UploadButton,
    NoteActionButtons,
  },
  props: {
    initConfig: { type: Object, required: false },
    className: { type: String, required: false, default: null },
    rows: { type: Number, required: false, default: 4 },
    loading: { type: Boolean, required: false, default: false },
    doSend: { type: Function, required: true },
    answerOptionChange: { type: Function, required: false, default: null },
    simpleMode: { type: Boolean, required: false, default: false },
  },
  computed: {
    isWriteMode() {
      return isWriteMode();
    },
    isDeepThinkMode() {
      return isDeepThinkMode();
    },
    llmInputPlaceholder() {
      return getLLMInputPlaceholder();
    }
  },
  data() {
    return {
      // 是否使用知识库
      useKnowledge: false,
      // 当前选择的模型
      usedModel: "",
      // 用户输入的问题
      question: "",
      // 文件
      attachments: [],
      // 图片
      pictures: [],
      sessionUniqueId: "",
      treeData: [],
      selectedLeafIds: [],
      deepThinkMode: 'no-think',
      networkMode: 'offline',
    };
  },
  watch: {
    initConfig: {
      handler(newVal, oldVal) {
        this.initDefaultConfig();
      },
      deep: true
    }
  },
  created() {
    if (this.$store.state.history.scene === "sop-agent") {
      this.useKnowledge = true;
    }
  },
  mounted() {
    this.initDefaultConfig();
    getCustomKnowledgeBaseTree().then((data) => {
      this.treeData = data;
    });
    // 为写作模式注册ai润色事件
    if (this.isWriteMode) {
      this.$bus.$on('doAIRewrite', (type) => {
        this.callSend(type);
      });
    }
  },
  destroyed() {
    // 为写作模式注销ai润色事件
    if (this.isWriteMode) {
      this.$bus.$off('doAIRewrite');
    }
  },
  methods: {
    initDefaultConfig() {
      if (this.initConfig) {
      if (this.initConfig.useKnowledge !== undefined) {
        this.useKnowledge = this.initConfig.useKnowledge;
        this.useKnowledge && (this.selectedLeafIds = this.initConfig.knowledgeDatabases || []);
      }
      if (this.initConfig.model !== undefined) {
        this.usedModel = this.initConfig.model;
      }
      if (this.initConfig.sessionUniqueId !== undefined) {
        this.sessionUniqueId = this.initConfig.sessionUniqueId;
      }

      // 需要深度思考按钮的模式下，初始化回答选项：是否深度思考或联网
      if (this.isDeepThinkMode) {
        let activeTabs = [];
      if (this.initConfig.deepThinkMode === 'think') {
        activeTabs.push('deepThink');
      }
      if (this.initConfig.networkMode === 'online') {
        activeTabs.push('searchMaterial');
      }
      if(this.$refs.noteActionButtons) {
        this.$refs.noteActionButtons.initActiveTabs(activeTabs);
      }
      }
    }
    },
    setQuestion(value) {
      this.question = value;
    },
    reset() {
      this.setQuestion("");
      this.pictures = [];
      if(this.$refs.userInputOperations) {
        this.$refs.userInputOperations.clearFileList();
      }
    },
    callSend(question) {
      this.question = question;
      this.send();
    },
    async send() {
      if (this.loading || !this.question || this.question.length <= 0) {
        return;
      }

      // 必须上传附件的场景，校验是否上传了附件
      if (isMustUploadAttach() && this.$store.state.mainPageChat.mode === 'newChat') {
        if (this.attachments.length <= 0) {
          this.$message.warning('请上传附件');
          return;
        }
      }

      // 质量管理知识库只从pro知识库中参考
      if (this.$store.state.history.scene === "sop-agent") {
        const res = await getCustomKnowledgeBaseList({ permissionType: "PRO" });
        const p = [];
        for (let item of res.records) {
          if (item && item.name && item.name === "生物样本库知识库") {
            p.push({ knowledgeDatabaseId: item.id, ...item });
          }
        }
        this.selectedLeafIds = p;
        this.selectedLeafIds = [{knowledgeDatabaseId: 17}];
      }
      const params = {
        sessionUniqueId: this.sessionUniqueId,
        requestUniqueId: nanoid(32),
        model: this.usedModel,
        question: this.question,
        useKnowledge: this.useKnowledge,
        knowledgeDatabases: this.selectedLeafIds,
        attachments: this.attachments,
        pictures: this.pictures,
        deepThinkMode: this.deepThinkMode,
        networkMode: this.networkMode,
        literatureId: this.initConfig?.literatureId || undefined,
        literatureSource: this.initConfig?.literatureSource || undefined,
      };
      this.doSend(params);
      this.reset();
    },
    handleKeydown(e) {
      if (e.shiftKey || e.altKey || e.metaKey) {
        return;
      } else if (e.ctrlKey) {
          this.question += '\n';
          this.$nextTick(() => {
            const textarea = e.target;
            textarea.scrollTop = textarea.scrollHeight; // 滚动到底部
            textarea.focus();
            return;
          });
        } else {
          e.preventDefault();
          e.stopPropagation();
          this.send();
        }
    },
    selectComplete(data) {
      this.selectedLeafIds = data.map((item) => {
        return { knowledgeDatabaseId: item.id, ...item };
      });
      if (data.length === 0) {
        this.useKnowledge = false;
      }
    },
    fileListChange(res) {
      this.attachments = res;
    },
    handleDelete(val) {
      this.$refs.userInputOperations.handleDeleteWithoutConfirm(val);
    },
    handleAnswerOptionChange(activeTabs) {
      this.deepThinkMode = activeTabs.includes("deepThink") ? 'think' : 'no-think';
      this.networkMode = activeTabs.includes("searchMaterial") ? 'online' : 'offline';
    },
  },
};
</script>

<template>
  <div
    class="w-full h-full flex flex-col items-center justify-between py-2 px-4 border-[#3662FF] border rounded-2xl bg-white"
    :class="className"
  >
    <div v-if="!simpleMode"
      class="flex justify-between w-full gap-[12px] h-[32px]"
    >
      <UserInputOptions class="flex-none" v-model="useKnowledge" />
      <tree-select
        v-if="useKnowledge && $store.state.history.scene !== 'sop-agent'"
        class="flex-1"
        @selectComplete="selectComplete"
        :tree-data="treeData"
        :selected-leaf-ids="selectedLeafIds"
      />
    </div>

    <div v-if="!simpleMode" class="w-full h-[1px] bg-[#E5E6EB] mt-[8px] mb-[8px]" />

    <FileList :file-list="attachments" @delete="handleDelete" />

    <div class="w-full my-[8px]" style="height: 50px">
      <el-input
        type="textarea"
        :placeholder="llmInputPlaceholder"
        resize="none"
        class="h-full"
        :rows="rows"
        :style="{ textarea: { border: 'none' } }"
        v-model="question"
        @keydown.enter.native="handleKeydown"
      />
    </div>

    <div v-if="!simpleMode" class="flex flex-row items-center justify-between w-full h-[32px]">
        <div class="flex   justify-start w-full gap-[10px]">
          <!--  -笔记、报告、学术课件、科普文章 场景下显示功能按钮 -->
          <NoteActionButtons
            ref="noteActionButtons"
            v-if="isDeepThinkMode"
            :on-action="handleAnswerOptionChange"
          />
          <!-- 其他场景显示模型选择器 -->
          <ModelChooser v-else v-model="usedModel" />
      </div>

      <UserInputOperations
        ref="userInputOperations"
        :do-send="send"
        :list="attachments"
        @fileListChange="fileListChange"
      />
    </div>
    <div v-else class="w-full h-[32px] flex justify-end">
      <div
      class="flex w-[56px] h-[32px] py-1 px-4 rounded-[34px] bg-[#3662FF] hover:bg-[#2041FF] items-center justify-center ml-4 cursor-pointer"
      @click.stop="send">
      <svg-icon icon-class="llm-send" class-name="!w-[22px] !h-[22px]" />
    </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
::v-deep .el-textarea__inner {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

::v-deep .el-textarea__inner:focus {
  outline: none !important;
  padding: 0 !important;
}
</style>
