<script>
import LLMInput from "@/views/mainPage/components/LLMInput.vue";
import MessageBubble from "@/views/mainPage/components/MessageBubble.vue";
import FunctionShortcut from "@/components/custom/FunctionShortcut.vue";
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import AddKnowledgeDialog from "@/components/custom/dialog/AddKnowledgeDialog.vue";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";
import AddToKgButton from "@/views/mainPage/components/AddToKgButton.vue";
import { randomString } from "@/api/custom/fake";
import {
  addUserChatMessageHistoryToKg,
  addUserChatSessionHistoryToKg,
  downloadUserChatSessionHistory,
  removeChatSession,
  renameUserChatSessionHistory,
} from "@/api/custom/history";
import {
  createNewKg,
  getUserKnowledgeList,
} from "@/api/custom/customKnowledgeBase";
import {
  getMessageReferences,
  fetchMessageId,
  fetchRecommendMessage,
} from "@/api/custom/index.js";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import ChatHeader from "@/views/mainPage/components/ChatHeader.vue";
import NoteChatHeader from "@/views/mainPage/components/NoteChatHeader.vue";
import ChatBubbles from "@/views/mainPage/components/ChatBubbles.vue";
import ChatInputArea from "@/views/mainPage/components/ChatInputArea.vue";
import SimilarQuestion from "@/views/mainPage/components/SimilarQuestion.vue";
import WebSearch from "@/views/mainPage/components/WebSearch.vue";
import {
  getChatMessages,
  sseChat,
  renameSession,
  getReferenceData,
  removeChatMessage,
} from "@/api/custom/chat";
import _ from "lodash";
import pdf from "@/assets/images/pdf.svg";
import docx from "@/assets/images/docx.svg";
import jpg from "@/assets/images/jpg.svg";
import png from "@/assets/images/png.svg";
import fileIconBlue from "@/assets/images/file-blue.svg";
import txt from "@/assets/images/txt.svg";
import fileIconLine from "@/assets/images/file-line.svg";
import { getCurrentChatSession } from "@/api/custom/history";
import { nanoid } from "nanoid";
import {
  isWriteMode,
  getGenerateUrl,
  isNoRefrenceSugesstion,
} from "@/plugins/aiAnserConfig";
import {
  extractContent,
  parseTagsToObject,
  replaceContentTag,
} from "@/utils/generator/parseString";

export default {
  name: "MainChat",
  components: {
    WebSearch,
    SimilarQuestion,
    ChatInputArea,
    ChatBubbles,
    ChatHeader,
    MessageDialog,
    AddToKgButton,
    NewKnowledgeBaseDialog,
    AddKnowledgeDialog,
    RenameDialog,
    FunctionShortcut,
    MessageBubble,
    LLMInput,
    NoteChatHeader,
  },
  props: {
    source: { type: String, required: true, default: "" },
    className: { type: String, required: false, default: "" },
    initConfig: { type: Object, required: false, default: null },
    width: { type: Number, required: false, default: 85 },
    simpleMode: { type: Boolean, required: false, default: false },
    showCreateButton: { type: Boolean, required: false, default: true },
  },
  data() {
    return {
      chatHistory: [],
      sessionUniqueId: "fake-session-id",
      chatTitle: "",
      isLoading: false,
      currentMessage: {},
      addToKgMode: "session",
      aiParams: {},
      answerStatus: "idle", // idle, waiting, thinking, answering
      knowledgeBaseDataList: [],
      dialogStatus: {
        rename: false,
        addToKg: false,
        createKg: false,
      },
      assistPanelShow: true,
      assistPanelMode: "similar",
      similarQuestions: [],
      webReferences: [],
      buffer: [],
      typer: null,
      imgIcon: {
        pdf,
        docx,
        jpg,
        png,
        txt,
        fileIconLine,
        fileIconBlue,
      },
      sessionList: [],
      sessionAddKgAlready: false,
      isAtBottom: true, // 新增标志位，用于跟踪用户是否在底部
      popover: {
        show: false,
        x: 0,
        y: 0,
        content: "",
        docName: "",
        ext: "",
        timer: null,
        isHovering: false,
      },
    };
  },
  async mounted() {
    if (this.initConfig) {
      this.init({
        sessionUniqueId: this.initConfig.sessionUniqueId,
        title: "新对话",
      });
      await this.doSend(this.initConfig);
    }
    const copyBox = document.getElementById("copy-box");
    const chatInputContainer = document.getElementById("chat-input-container");
    if (copyBox && chatInputContainer) {
      copyBox.style.minHeight = chatInputContainer.offsetHeight + "px";
    }

    // 添加滚动事件监听器
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.addEventListener(
        "mouseover",
        this.handleReferenceHover,
        true
      );
      messageContainer.addEventListener(
        "mouseout",
        this.handleReferenceOut,
        true
      );
    }

    this.scrollToEnd();
  },

  beforeUnmount() {
    // 移除滚动事件监听器
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.removeEventListener(
        "mouseover",
        this.handleReferenceHover,
        true
      );
      messageContainer.removeEventListener(
        "mouseout",
        this.handleReferenceOut,
        true
      );
    }
  },
  watch: {
    "dialogStatus.addToKg": {
      handler(newVal) {
        if (newVal) {
          this.reloadKnowledgeBaseList();
        }
      },
    },
  },
  methods: {
    handleScroll(e) {
      const element = e.target;
      // 计算距离底部的距离
      const distanceToBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      // 只要距离底部大于 20px，就认为用户正在往上翻看，立刻停止自动滚动
      this.isAtBottom = distanceToBottom <= 20;
    },
    handleReferenceHover(e) {
      const target = e.target.closest(".cite-marker");
      if (target) {
        clearTimeout(this.popover.timer);
        const refId = target.getAttribute("data-ref-id");

        // 从聊天记录中寻找对应的引用数据
        let refData = null;
        for (const msg of this.chatHistory) {
          if (msg.content?.referenceChunks?.has(refId)) {
            refData = msg.content.referenceChunks.get(refId);
            break;
          }
        }

        if (refData) {
          const rect = target.getBoundingClientRect();
          this.popover.content = refData.content;
          this.popover.docName = refData.docName;
          this.popover.ext = refData.ext;

          // 计算位置：展示在小标的上方
          this.popover.x = rect.left;
          // 减去的大致像素可视你的实际气泡高度进行微调，确保不会挡住鼠标
          this.popover.y = rect.top - 240;
          this.popover.show = true;
        }
      }
    },
    handleReferenceOut(e) {
      const target = e.target.closest(".cite-marker");
      if (target) {
        // 延迟 200ms 隐藏，方便用户把鼠标移动到气泡内部去滚动查看内容
        this.popover.timer = setTimeout(() => {
          if (!this.popover.isHovering) {
            this.popover.show = false;
          }
        }, 200);
      }
    },
    closePopover() {
      this.popover.isHovering = false;
      this.popover.show = false;
    },
    init({ title = "新对话", ...params }) {
      this.aiParams = {
        ...params,
      };
      this.sessionUniqueId = params.sessionUniqueId;
      this.chatHistory = [];
      this.chatTitle = title;
      this.isLoading = false;
      this.currentMessage = {};
      this.answerStatus = "idle";
      this.dialogStatus = {
        rename: false,
        addToKg: false,
        createKg: false,
      };
      this.buffer = [];
      if (this.typer !== null) {
        clearInterval(this.typer);
        this.typer = null;
      }
      this.getSessionKnowledge(params.sessionUniqueId);
    },
    // 查询会话被加入到知识库里了吗
    async getSessionKnowledge(sessionUniqueId) {
      if (!this.sessionList || this.sessionList.length == 0) {
        this.sessionList = await getCurrentChatSession();
      }
      let currentSession = "";
      this.sessionList.some((group) => {
        return group.sessions.some((session) => {
          if (session.sessionUniqueId == sessionUniqueId) {
            currentSession = session;
            return true;
          }
        });
      });
      this.sessionAddKgAlready =
        currentSession && currentSession.knowledgeDatabaseRelations?.length > 0;
    },
    async changeSession(params) {
      this.init(params);
      params?.sessionUniqueId &&
        (await this.reloadSessionMessages(params.sessionUniqueId));
    },
    async reloadSessionMessages(sessionUniqueId) {
      this.chatHistory = [];
      this.chatHistory = await getChatMessages(sessionUniqueId);
      console.log("历史记录：", this.chatHistory);
      this.$emit("initConfigChange", this.aiParams);
      this.$emit("changeSession", sessionUniqueId, this.chatHistory);
      this.handleAiAnser();
    },
    // 数据处理，删掉markdown字符串中的图片和链接(当前历史记录数据中并没有缓存引用数据块和引用文章列表，因此历史记录中仅能展示文字，无法展示引用)
    handleAiAnser() {
      this.chatHistory.forEach((item) => {
        if (item.role == "ai" && item.content?.content) {
          item.content.content = item.content.content.replace(
            /!?\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*\)/g,
            ""
          );
          // 解析slide标签
          this.parseSlideTags(item);
        }
      });
    },
    closeAssistPanel() {
      this.assistPanelShow = false;
    },
    openAssistPanel() {
      this.assistPanelShow = true;
    },
    openRenameDialog() {
      this.$set(this.dialogStatus, "rename", true);
    },
    closeRenameDialog() {
      this.$set(this.dialogStatus, "rename", false);
    },
    openSessionAddToKgDialog() {
      this.currentMessage = undefined;
      this.addToKgMode = "session";
      this.$set(this.dialogStatus, "addToKg", true);
    },
    async openMessageToKgDialog(messageId) {
      this.currentMessage = this.chatHistory.find(
        (x) => x.content.messageUniqueId === messageId
      ).content;
      this.addToKgMode = "message";
      this.$set(this.dialogStatus, "addToKg", true);
    },
    closeAddToKgDialog() {
      this.$set(this.dialogStatus, "addToKg", false);
    },
    openCreateKgDialog() {
      this.$set(this.dialogStatus, "createKg", true);
    },
    closeCreateKgDialog() {
      this.$set(this.dialogStatus, "createKg", false);
    },
    async doRename(record, newTitle) {
      await renameUserChatSessionHistory(record.sessionUniqueId, newTitle);
      this.chatTitle = newTitle;
      this.$store.state.history.refreshId =
        this.$store.state.history.refreshId + 1;
      this.closeRenameDialog();
    },
    async doAddToKg(sessionUniqueId, messageId, kgIds, mode, fileTitle) {
      if (mode === "session") {
        const sessionRes = await addUserChatSessionHistoryToKg(
          sessionUniqueId,
          kgIds,
          fileTitle
        );
        if (sessionRes?.code == 200) {
          this.sessionAddKgAlready = true;
        }
        this.$store.state.history.refreshId =
          this.$store.state.history.refreshId + 1;
        this.closeAddToKgDialog();
        this.$message.success("加入知识库成功");
      }
      if (mode === "message") {
        const mesRes = await addUserChatMessageHistoryToKg(
          messageId,
          kgIds,
          fileTitle
        );
        if (mesRes?.code == 200) {
          const idx = this.chatHistory.findIndex((x) => {
            return x.messageUniqueId == messageId;
          });
          if (idx > -1) {
            this.$set(
              this.chatHistory[idx].content,
              "knowledgeDatabaseRelations",
              mesRes.data || ["placeholder"]
            );
          }
        }
        this.$store.state.history.refreshId =
          this.$store.state.history.refreshId + 1;
        this.closeAddToKgDialog();
        this.$message.success("加入知识库成功");
      }
    },
    doCopySession() {
      const c = [];
      for (let i = 0; i < this.chatHistory.length; i++) {
        const item = this.chatHistory[i];
        if (item.role === "human") {
          c.push(`用户: ${item.content.content}`);
        } else {
          c.push(`AI: ${item.content.originalContent}`);
        }
      }
      this.$copyText(c.join("\n")).then((e) => {
        this.$modal.msgSuccess("复制成功");
      });
    },
    getIconName(documentExtension) {
      if (Object.keys(this.imgIcon).includes(documentExtension)) {
        return this.imgIcon[documentExtension];
      } else {
        return this.imgIcon.fileIconBlue;
      }
    },
    async doDownloadSession() {
      await downloadUserChatSessionHistory(this.sessionUniqueId);
    },
    async doDeleteSession() {
      await removeChatSession(this.sessionUniqueId);
      this.$store.state.history.refreshId =
        this.$store.state.history.refreshId + 1;
      this.$message.success("删除对话记录成功");
      this.$store.state.history.sidebarOpen = false;
      this.$store.state.mainPageChat.mode = "newChat";
    },
    async doDeleteMessage(param) {
      if (_.isString(param)) {
        const messageId = param;
        const idx = this.chatHistory.findIndex(
          (x) => x.messageUniqueId === messageId
        );
        if (idx > -1) {
          let res = await removeChatMessage(messageId);
          res &&
            this.chatHistory.splice(idx) &&
            this.$message.success("删除消息成功");
        }
      }
    },
    async doReAnswer(messageId) {
      const idx = this.chatHistory.findIndex(
        (x) => x.messageUniqueId === messageId
      );
      if (idx <= -1) {
        return;
      }
      this.chatHistory.splice(idx);
      await this.appendAiEmptyMessage();
      this.aiParams = {
        ...this.aiParams,
        question: this.chatHistory[idx - 1].content.content,
        attachments: [],
        pictures: [],
      };
      await this.startAnswer(messageId);
    },
    async doSuggestion(suggest) {
      const suggestionParam = { ...this.aiParams };
      suggestionParam.question = suggest;
      await this.doSend(suggestionParam);
    },
    async doViewReferences(messageId) {
      this.webReferences = this.chatHistory.find(
        (x) => x.messageUniqueId === messageId
      ).content.references;
      if (this.webReferences.length > 0) {
        this.assistPanelShow = true;
        this.assistPanelMode = "web";
      }
    },
    async appendUserMessage(params) {
      this.chatHistory.push({
        role: "human",
        content: {
          messageUniqueId: randomString(10),
          content: params.question || "hahaha",
          references: [],
          suggestions: [],
          attachments: params.attachments || [],
        },
      });
    },
    async appendAiEmptyMessage() {
      this.chatHistory.push({
        role: "ai",
        content: {
          messageUniqueId: "",
          content: "",
          originalContent: "",
          references: [],
          suggestions: [],
        },
      });
    },
    async doCreateKg(name, permission) {
      await createNewKg(name, permission);
      await this.reloadKnowledgeBaseList();
      this.closeCreateKgDialog();
    },
    async reloadKnowledgeBaseList() {
      this.knowledgeBaseDataList = await getUserKnowledgeList(3);
    },
    async doSend(params) {
      this.aiParams = params;
      await this.appendUserMessage(params);
      await this.appendAiEmptyMessage();
      this.scrollToEnd();
      await this.startAnswer();
    },
    async appendMessageSuggestions(messageId) {
      if (messageId === undefined || messageId === "") {
        return;
      }
      const idx = this.chatHistory.findIndex(
        (x) => x.messageUniqueId === messageId
      );
      const { data } = await fetchRecommendMessage(messageId);
      if (idx > -1) {
        this.$set(
          this.chatHistory[idx].content,
          "suggestions",
          data.recommends
            .filter((item) => item.question)
            .map((v) => {
              return v.question;
            })
        );
      }
    },
    async appendMessageReferences({ messageUniqueId: messageId, content }) {
      if (messageId === undefined || messageId === "") {
        return;
      }
      let references = await getMessageReferences(messageId);
      if (content?.documentAndReferenceMap?.size) {
        references = this.sortByArrayOrder(
          content.documentAndReferenceMap.keys(),
          references
        );
      }
      const idx = this.chatHistory.findIndex(
        (x) => x.messageUniqueId === messageId
      );
      if (idx > -1) {
        this.$set(this.chatHistory[idx].content, "references", references);
      }
    },
    sortByArrayOrder(a, b) {
      // 创建id到索引的映射，提高查找效率
      const idIndexMap = {};
      a.forEach((id, index) => {
        idIndexMap[id] = index;
      });

      // 排序数组b
      return [...b].sort((obj1, obj2) => {
        const index1 = idIndexMap[obj1.id];
        const index2 = idIndexMap[obj2.id];

        // 两个id都存在于数组a中，按索引位置排序
        if (index1 !== undefined && index2 !== undefined) {
          return index1 - index2;
        }

        // 只有obj1的id存在于数组a中，排在前面
        if (index1 !== undefined) {
          return -1;
        }

        // 只有obj2的id存在于数组a中，排在前面
        if (index2 !== undefined) {
          return 1;
        }

        // 两个id都不存在于数组a中，按id本身排序
        return obj1.id - obj2.id;
      });
    },
    // 处理文本中出现的"[XXXX](CITE)"关键词，转换成引用文献详情弹出气泡的html
    async appendReferenceChunks(content, message) {
      const reg = /^[a-zA-Z0-9]+$/;
      if (content.length != 32 || !reg.test(content.slice(1, 25))) {
        return "&nbsp;";
      }

      if (!message.content.referenceChunks) {
        this.$set(message.content, "referenceChunks", new Map());
      }
      if (!message.content.documentAndReferenceMap) {
        this.$set(message.content, "documentAndReferenceMap", new Map());
      }

      const referenceChunkId = content.slice(1, 25);
      let referenceOrder = this.getIndexFromMap(
        message.content.referenceChunks,
        referenceChunkId
      );

      // 【新增】：提取一个生成标记字符串的公共函数
      const getMarkerHtml = (order, id) =>
        `<span class="cite-marker" style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;border-radius:4px;color:#3662ff;font-size:12px;line-height:1.5;font-weight:500;background-color:#f5f8ff;cursor:pointer;margin:0 2px;" data-ref-id="${id}">${order}</span>`;

      if (referenceOrder > -1) {
        // 【核心修复】：命中缓存时，不能直接返回对象！
        // 取出对象中的 order 属性，重新生成标记字符串返回
        const cachedData =
          message.content.referenceChunks.get(referenceChunkId);
        return getMarkerHtml(cachedData.order, referenceChunkId);
      }

      const res = await getReferenceData(referenceChunkId).catch((e) => {});
      if (res?.data?.documentId) {
        let {
          content: fullContent,
          documentName,
          documentExtension,
          documentId,
        } = res.data;
        if (documentId) {
          const docReferences =
            message.content.documentAndReferenceMap.get(documentId);
          if (!docReferences) {
            message.content.documentAndReferenceMap.set(documentId, [
              fullContent,
            ]);
          } else {
            message.content.documentAndReferenceMap.set(documentId, [
              ...new Set([...docReferences, fullContent]),
            ]);
          }
        }

        // 1. 清理内容
        let cleanContent = fullContent
          .replace(/```[a-zA-Z0-9_-]*\n?/g, "")
          .replace(/`/g, "");
        referenceOrder = message.content.referenceChunks.size + 1;

        // 2. 将数据对象存入缓存
        message.content.referenceChunks.set(referenceChunkId, {
          order: referenceOrder,
          content: cleanContent,
          docName: documentName,
          ext: documentExtension,
        });

        // 3. 返回标记字符串
        return getMarkerHtml(referenceOrder, referenceChunkId);
      } else {
        const reg = /^[a-zA-Z0-9]+$/;
        if (reg.test(referenceChunkId)) {
          return "&nbsp;";
        }
      }
    },
    // 工具类：获取map的index  参数：（map实体，查询的key）
    getIndexFromMap(map, key) {
      const keyArr = Array.from(map.keys());
      return keyArr.indexOf(key);
    },
    // 批量替换ai回答中需要转换格式的内容
    replaceAnswerContents(str, replaceList) {
      replaceList.forEach((item) => {
        str = str.replaceAll(item[0], item[1]);
      });
      return str;
    },
    // 解析slide标签
    parseSlideTags(message) {
      if (message.content.content.includes("<slide>")) {
        const slideContents = extractContent(message.content.content, "slide");
        const slideObj = parseTagsToObject(slideContents[0]);
        this.$store.state.mainPageChat.filesCache[slideObj.taskId] = slideObj;
        this.$bus.$emit("doSlideClick", slideObj.taskId);
        message.content.content = replaceContentTag(
          message.content.content,
          "slide",
          `<div ref="slideBox" class="slide-box" name="${slideObj.taskId}"><img style="width:16px;height:16px;" src="${this.imgIcon.fileIconLine}" /><div>${slideObj.name}</div></div>`
        );
      }
    },
    async startAnswer(messageId) {
      this.answerStatus = "answering";
      const aiAnswerEmptyMessage =
        this.chatHistory[this.chatHistory.length - 1];
      let refreshHistory = false;

      const callback = async (chunkType, value, message, citesExtractor) => {
        if (chunkType === "end") {
          handleReferenceString.call(this);

          this.answerStatus = "idle";
          const requestUniqueId = value.requestUniqueId;
          // 替换思考内容样式
          this.$set(
            message.content,
            "content",
            this.replaceAnswerContents(message.content.content, [
              [
                "<think>",
                "<details class='think-block' ><summary class='think-title'>思维链（点击折叠/展开）</summary><div class='think-content'>",
              ],
              ["</think>", "</div></details>"],
              ["~", "\\~"],
            ])
          );

          // 解析slide标签
          this.parseSlideTags(message);

          // 立即获取无法获取到messageId，设置100ms的延时，确保messageId存在
          setTimeout(async () => {
            if (!message.messageUniqueId) {
              const { messageUniqueId } = await fetchMessageId(requestUniqueId);
              this.$set(message, "messageUniqueId", messageUniqueId);
              this.$set(message.content, "messageUniqueId", messageUniqueId);
            }
            if (!this.isNoRefrenceSugesstion) {
              await this.appendMessageSuggestions(message.messageUniqueId);
              await this.appendMessageReferences(message);
            }
            this.scrollToEnd();
            this.$emit("answer-end", message);
            console.log("answer-end:chatHistory", this.chatHistory);
          }, 100);

          // 只在首次对话时重命名
          if (this.chatHistory.length < 3) {
            const resData = await renameSession(this.sessionUniqueId);
            this.chatTitle = resData.title;
          }
          // 每次回答完成之后, 重刷一次相似问题推荐
          await this.reFetchSimilarQuestions();
          if (this.chatHistory.length === 2 && refreshHistory === false) {
            this.$store.state.history.refreshId =
              this.$store.state.history.refreshId + 1;
          }
          return;
        }

        if (chunkType === "chunk") {
          for (let c of value.content) {
            // this.buffer.push(c);
            this.$set(message.content, "content", message.content.content + c);
            this.$set(
              message.content,
              "originalContent",
              message.content.originalContent + c
            );
          }

          const hasNewLink = citesExtractor.getHasNewLink();
          if (hasNewLink) {
            handleReferenceString.call(this);
          }
        }

        // 获取slide标签中的参数,slide标签当前没有分片，返回的是一整个文件的属性
        if (value.content.includes("<slide>")) {
          callback("end", value, message, citesExtractor);
          return;
        }

        this.scrollToEnd();

        // 处理引用类型字符串
        function handleReferenceString() {
          const resultMap = citesExtractor.getResultMap();
          resultMap.forEach(async (content, link) => {
            if (
              message.content.content.includes(link) ||
              message.content.originalContent.includes(link)
            ) {
              const result = this.isWriteMode
                ? "&nbsp;"
                : await this.appendReferenceChunks(link, message);
              // 异步查询出引用数据块的详情后，使用replace替换掉文本中的引用关键词
              if (result) {
                // 【核心修复】：防止 AI 把引用 ID 放在反引号里，连带反引号一起替换掉！
                let newContent = message.content.content;
                newContent = newContent.replaceAll("`" + link + "`", result);
                newContent = newContent.replaceAll(link, result);
                this.$set(message.content, "content", newContent);

                let newOriginal = message.content.originalContent;
                newOriginal = newOriginal.replaceAll("`" + link + "`", "");
                newOriginal = newOriginal.replaceAll(link, "");
                this.$set(message.content, "originalContent", newOriginal);
              }
            }
          });
        }
      };
      if (messageId) {
        const params = {
          requestUniqueId: this.aiParams.requestUniqueId || nanoid(32),
          sessionUniqueId: this.aiParams.sessionUniqueId,
          aiMessageUniqueId: messageId,
          networkMode: this.aiParams.networkMode,
        };
        sseChat(
          params,
          aiAnswerEmptyMessage,
          "regenerate",
          callback,
          this.baseUrl
        );
      } else {
        sseChat(
          this.aiParams,
          aiAnswerEmptyMessage,
          "generate",
          callback,
          this.baseUrl
        );
      }
      // this.aiAnswering(aiAnswerEmptyMessage);
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
    async reFetchSimilarQuestions() {
      // this.similarQuestions = await fetchSimilarQuestions(this.sessionUniqueId);
    },
    aiAnswering(targetMessage) {
      this.answerStatus = "answering";
      this.buffer = [];
      const _this = this;
      const callback = () => {
        if (_this.buffer.length > 0) {
          const c = _this.buffer.shift();
          if (c === "<END>") {
            _this.x();
          }
          _this.$set(
            targetMessage.content,
            "content",
            targetMessage.content.content + c
          );
        }
      };
      this.typer = setInterval(callback, 20);
    },
    aiAnswerEnd() {
      clearInterval(this.typer);
      this.typer = null;
      this.buffer = [];
      this.answerStatus = "idle";
    },
    doAIRewrite(type) {
      this.$bus.$emit("doAIRewrite", type);
    },
    handleWheel(e) {
      if (e.deltaY < 0) {
        this.isAtBottom = false;
      } else {
        const messageContainer = document.getElementById("message-container");
        if (!messageContainer) return;
        const distanceToBottom =
          messageContainer.scrollHeight -
          messageContainer.scrollTop -
          messageContainer.clientHeight;
        this.isAtBottom = distanceToBottom <= 200;
      }
    },
    // 智能滚动到底部，只有在用户处于底部时才执行
    scrollToEnd() {
      // 只有当用户在底部时才自动滚动
      if (!this.isAtBottom) return;
      // this.$nextTick(() => {
      const element = document.getElementById("message-container");
      if (!element) return;
      // setTimeout(() => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
      // }, 0)
      // })
    },
    parseChatTitle() {
      if (this.addToKgMode == "session") {
        return "对话_" + this.chatTitle;
      } else if (this.addToKgMode == "message") {
        return "消息_" + this.chatTitle;
      }
    },
    toBottom() {
      this.isAtBottom = true;
      this.scrollToEnd();
    },
  },
  computed: {
    baseUrl() {
      return getGenerateUrl();
    },
    scene() {
      return this.$store.state.history.scene;
    },
    isWriteMode() {
      // 写作模式场景下，不显示建议和引用，并提取出Content内容单独显示
      return isWriteMode();
    },
    isNoRefrenceSugesstion() {
      return isNoRefrenceSugesstion();
    },
  },
};
</script>

<template>
  <div class="flex w-full h-full" :class="className">
    <div class="flex flex-col items-center flex-1 h-full overflow-hidden">
      <ChatHeader
        v-if="!simpleMode"
        :title="chatTitle"
        :do-open-assist-panel="openAssistPanel"
        :do-rename="openRenameDialog"
        :do-add-session-to-kg="openSessionAddToKgDialog"
        :show-session-operation-buttons="chatHistory.length >= 1"
        :do-copy-session="doCopySession"
        :do-download-session="doDownloadSession"
        :do-delete-session="doDeleteSession"
        :sessionAddKgAlready="sessionAddKgAlready"
        :scene="scene"
        :doAIRewrite="doAIRewrite"
      />
      <div
        class="relative flex flex-col items-center flex-1 w-full h-full overflow-hidden"
      >
        <div
          id="message-container"
          class="flex flex-col items-center flex-1 w-full overflow-y-auto"
          :class="{ 'scrollbar-small': simpleMode }"
          @scroll="handleScroll"
        >
          <ChatBubbles
            ref="chatBubbles"
            :chat-messages="chatHistory"
            :answer-status="answerStatus"
            :do-add-message-to-kg="openMessageToKgDialog"
            :do-delete-message="doDeleteMessage"
            :style="{ width: `${width}%` }"
            :do-re-answer="doReAnswer"
            :do-suggestion="doSuggestion"
            :do-view-references="doViewReferences"
            :simple-mode="simpleMode"
          />
          <div id="copy-box" class="shrink-0 w-[1px]"></div>
        </div>
        <div
          class="flex flex-col items-center gap-[20px] absolute bottom-0 z-[1]"
          :style="{ width: `calc(${width}% + 20px)` }"
        >
          <div
            v-if="!isAtBottom"
            @click="toBottom"
            class="down-btn"
            :class="{ active: answerStatus === 'answering' }"
          >
            <i class="el-icon-arrow-down !text-[20px] text-[#000000dd]" />
          </div>
          <div
            id="chat-input-container"
            class="w-full flex items-center justify-center px-[10px] bg-white"
          >
            <ChatInputArea
              :init-config="initConfig"
              :do-send="doSend"
              :rows="2"
              :show-create-button="showCreateButton"
              :simple-mode="simpleMode"
              :loading="answerStatus === 'answering'"
            />
          </div>
        </div>
      </div>
      <div
        v-show="popover.show"
        class="global-reference-popover"
        :style="{ top: popover.y + 'px', left: popover.x + 'px' }"
        @mouseenter="popover.isHovering = true"
        @mouseleave="closePopover"
      >
        <div class="bubble-content">
          <div style="color: #959ba1; height: 21px; font-size: 12px">
            引用内容
          </div>
          <div
            class="main scrollbar-small"
            v-html="popover.content.replaceAll('\n', '<br/>')"
            style="
              max-height: 200px;
              overflow-y: auto;
              font-size: 12px;
              padding: 12px 0;
            "
          ></div>
          <div
            v-if="popover.docName"
            class="footer"
            style="
              display: flex;
              align-items: center;
              margin-top: 8px;
              font-size: 12px;
              color: #666;
            "
          >
            <img
              style="width: 20px; height: 20px; margin-right: 4px"
              :src="getIconName(popover.ext)"
            />
            <span class="document-name">{{ popover.docName }}</span>
          </div>
        </div>
      </div>
      <RenameDialog
        :show="this.dialogStatus.rename"
        :on-ok="doRename"
        :on-cancel="closeRenameDialog"
        :record="{ sessionUniqueId: sessionUniqueId, title: chatTitle }"
      />
      <AddKnowledgeDialog
        :chat-title="parseChatTitle()"
        :data-list="knowledgeBaseDataList"
        :show="this.dialogStatus.addToKg"
        :sessionUniqueId="sessionUniqueId"
        :mode="addToKgMode"
        :on-ok="doAddToKg"
        :on-cancel="closeAddToKgDialog"
        :message="currentMessage"
        :on-add-new="openCreateKgDialog"
      />
      <NewKnowledgeBaseDialog
        :show="this.dialogStatus.createKg"
        :on-ok="doCreateKg"
        :on-cancel="closeCreateKgDialog"
      />
    </div>
    <!-- <div v-if="assistPanelShow" class="2xl:w-[384px] w-[300px] h-full flex border-l border-l-[#E5E6EB]">
      <SimilarQuestion v-if="assistPanelMode === 'similar'"
                       :similar-questions="similarQuestions"
                       :do-suggestion="doSuggestion"
                       :do-close="closeAssistPanel"/>
      <WebSearch v-else :references="webReferences" :do-close="closeAssistPanel"/>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.down-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #e5e6eb;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
}

.down-btn:hover {
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.02),
    0 10px 16px 0 rgba(47, 53, 64, 0.14);
}

.down-btn.active::before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 50%;
  /* 使用锥形渐变作为背景 */
  background: conic-gradient(from 0deg, #fff, #3662ff, #fff, #fff, #fff);
  /* 通过遮罩和内边距实现渐变边框效果 */
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1px;
  /* 边框宽度 */
  /* 动画 */
  animation: rotate 1s linear infinite;
  /* 让伪元素在盒子下方 */
  z-index: -1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.global-reference-popover {
  position: fixed;
  z-index: 9999;
  width: 340px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 12px;
}
.think-block {
  margin: 12px 0;
  padding: 10px 14px;
  background-color: #f7f8fa;
  border-left: 3px solid #959ba1;
  border-radius: 4px;
  font-size: 13px;
  color: #505968;

  // 展开状态下的样式调整
  &[open] {
    .think-title {
      margin-bottom: 8px;
      color: #1d2129;
    }
  }

  // 标题（折叠块的把手）
  .think-title {
    font-weight: 500;
    color: #86909c;
    cursor: pointer;
    user-select: none;
    outline: none;
    padding: 2px 0;
    display: list-item; /* 保持原生小三角箭头 */

    &:hover {
      color: #3662ff; /* 悬浮时变蓝色提示可点击 */
    }
  }

  // 内部思考流文本内容
  .think-content {
    color: #4e5969;
    line-height: 1.6;
    border-top: 1px dashed #e5e6eb;
    padding-top: 8px;
    font-style: italic; /* 思考内容呈斜体（可选） */
  }
}
</style>
