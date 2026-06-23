<template>
    <div class="w-full h-full flex flex-col items-center">
        <el-breadcrumb class="w-full px-[32px] py-[16px]">
            <el-breadcrumb-item>
                <a @click="$tab.openPage('科研辅助', '/medicalResearch/scienceHelper')">
                    科研辅助
                </a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>项目申报辅助编写</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="w-[75%] p-[24px] flex-1 overflow-hidden flex flex-col items-center">
            <h1 class="font-bold text-center text-[36px] leading-[46px]">医学综述AI辅助生成</h1>
            <div class="search-box w-full flex mt-[20px] mb-[24px] px-[10px]">
                <el-input v-model="keyword" placeholder="请输入医学相关关键词" size="medium" clearable
                    @keyup.enter.native="clickSearch" />
                <el-button type="primary" size="medium" class="font-bold" style="width:200px;"
                    @click="clickSearch">搜索</el-button>
            </div>
            <div class="flex-1 flex gap-[20px] overflow-hidden p-[20px] m-[-20px]" style="width: calc(100% + 40px);">
                <div
                    class="container-shadow flex-1 h-full flex flex-col gap-[12px] bg-white rounded-[12px] py-[32px] overflow-hidden relative">
                    <div class="header font-bold text-[24px] leading-[30px] px-[64px]">
                        关键词: {{ title }}
                    </div>
                    <div id="message-container" class="flex-1 w-full overflow-y-auto px-[64px]">
                        <AIBubbleThinkingStatus :thinking="answerStatus === 'answering'" :showCompleteStatus="false" />
                        <Markdown :content="parsedChatHistory" />
                    </div>
                    <div v-if="answerStatus === 'idle'" class="footer px-[64px]">
                        <el-button icon="el-icon-copy-document" size="mini" class="rounded-[38px]"
                            @click="copyContent">复制</el-button>
                        <el-button icon="el-icon-refresh-right" size="mini" class="rounded-[38px]"
                            @click="restartChat">重新生成</el-button>
                    </div>

                    <div v-if="!chatHistory.length"
                        class="empty-content absolute top-[0] left-[0] w-full h-full overflow-hidden flex flex-col items-center justify-center z-[100]">
                        <img src="@/assets/images/file-empty.png" class="w-[50%]" alt>
                        <span class="text-[18px] text-[#5F646C]">无分析结果，请输入关键词</span>
                    </div>
                </div>
                <div class="container-shadow w-[200px] h-full bg-white rounded-[12px]">
                    <HistoryList :use-this-session="useThisSession" :showCloseIcon="false" />
                </div>
            </div>
        </div>

        <img src="@/assets/images/aihelper-bg.png" alt="Background Image" class="fullscreen-img" />
    </div>
</template>

<script>
import HistoryList from "@/views/mainPage/components/HistoryList.vue";
import { getChatMessages } from "@/api/custom/chat";
import { extractContent } from "@/utils/generator/parseString";
import Markdown from "@/components/custom/md/Markdown.vue";
import { sseChat } from "@/api/custom/chat";
import { nanoid } from "nanoid";
import { createNewChatSession, fetchMessageId } from "@/api/custom";
import { getGenerateUrl } from "@/plugins/aiAnserConfig";
import AIBubbleThinkingStatus from "@/views/mainPage/components/AIBubbleThinkingStatus.vue";
export default {
    name: 'MedicalReviewAi',
    components: {
        HistoryList,
        Markdown,
        AIBubbleThinkingStatus,
    },
    data() {
        return {
            keyword: '',
            chatHistory: [],
            reqParams: {
                sessionUniqueId: '',
                requestUniqueId: '',
            },
            answerStatus: 'idle',
            time: null
        }
    },
    computed: {
        parsedChatHistory() {
            if (this.chatHistory.length === 0) {
                return '';
            }
            let content = this.chatHistory[this.chatHistory.length - 1]?.content?.content || '';
            content = content.replace(/!?\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*\)/g, '');
            return content;
        },
        title() {
            if (this.chatHistory.length < 2) {
                return '';
            }
            return this.chatHistory[this.chatHistory.length - 2]?.question || '';
        }
    },
    created() {
        this.$store.state.history.scene = 'review-generate';
        this.$store.state.history.sidebarOpen = true;
    },
    methods: {
        clickSearch() {
            if (this.keyword) {
                this.reqParams.sessionUniqueId = '';
                this.createHumanMessage(this.keyword);
                this.startAnswer();
            }
        },
        createHumanMessage(question) {
            let humanMessage = {
                requestUniqueId: nanoid(32),
                question: question,
                role: 'human',
            }
            let aiMessage = {
                messageUniqueId: '',
                role: 'ai',
                content: { content: '' },
            }
            this.chatHistory = [humanMessage, aiMessage];
        },
        async startAnswer(messageId) {
            this.answerStatus = 'answering';
            if (!this.reqParams.sessionUniqueId) {
                await this.createNewChatSession();
            }
            this.reqParams.requestUniqueId = this.chatHistory[0].requestUniqueId;
            const aiAnswerEmptyMessage = this.chatHistory[this.chatHistory.length - 1];
            let state = {
                waitingForContentEnd: false, // 是否已匹配到 <Content>，等待 </Content>
                buffer: ''              // 缓存未处理的片段（用于跨分片拼接标签）
            };

            const callback = async (chunkType, value, message) => {
                let current = state.buffer + value.content; // 拼接缓存的未处理内容
                state.buffer = ''; // 清空缓存，准备存储新的未处理内容
                let extracted = ''; // 本次提取的有效内容

                while (current.length > 0) {
                    // 只需要提取 <Content> 标签内的内容
                    if (!state.waitingForContentEnd) {
                        // 状态：未找到 <Content>，寻找开始标签
                        const startTag = '<Content>';
                        const startIndex = current.indexOf(startTag);

                        if (startIndex === -1) {
                            // 未找到完整的 <Content>，缓存所有内容，等待下次分片
                            state.buffer = current;
                            break;
                        } else {
                            // 找到 <Content>，跳过标签本身，进入"等待结束标签"状态
                            current = current.slice(startIndex + startTag.length);
                            state.waitingForContentEnd = true;
                        }
                    } else {
                        // 状态：已找到 <Content>，寻找 </Content> 结束标签
                        const endTag = '</Content>';
                        const endIndex = message.content.content.indexOf(endTag);

                        if (endIndex === -1) {
                            // 未找到完整的 </Content>，缓存当前所有内容（属于标签内内容）
                            extracted += current; // 暂存标签内的内容（等待结束标签出现）
                            state.buffer = ''; // 已将内容存入 extracted，无需缓存
                            break;
                        } else {
                            // 找到 </Content>，提取标签内的内容（到结束标签前）
                            this.$set(message.content, 'content', message.content.content.slice(0, endIndex));
                            // 重置状态，退出标签区间
                            state.waitingForContentEnd = false;
                            console.log('结束标签')
                            endEvent(this);
                            break;
                        }
                    }
                }
                // 将本次提取的有效内容追加到最终结果
                for (let c of extracted) {
                    this.$set(message.content, 'content', message.content.content + c);
                }

                // 流式对话结束时的操作
                async function endEvent(self) {
                    const requestUniqueId = value.requestUniqueId;
                    if (!message.messageUniqueId) {
                        const { messageUniqueId } = await fetchMessageId(requestUniqueId);
                        self.$set(message, 'messageUniqueId', messageUniqueId);
                    }
                    self.answerStatus = 'idle';
                    if (!messageId) {
                        self.$store.state.history.refreshId = self.$store.state.history.refreshId + 1;
                    }
                }

                state.waitingForContentEnd && this.scrollToEnd();
            }

            if (messageId) {
                // 重新回答
                sseChat({ ...this.reqParams, aiMessageUniqueId: messageId }, aiAnswerEmptyMessage, 'regenerate', callback, getGenerateUrl());
            } else {
                // 初次回答
                sseChat({ ...this.reqParams, keyword: this.keyword }, aiAnswerEmptyMessage, 'generate', callback, getGenerateUrl());
            }
        },
        async createNewChatSession() {
            const { sessionUniqueId } = await createNewChatSession();
            this.reqParams.sessionUniqueId = sessionUniqueId;
        },
        // 点击历史记录词条，查看历史记录
        async useThisSession(record) {
            let list = await getChatMessages(record.sessionUniqueId);
            if (list.length > 1) {
                // 只显示最后一条回答
                let endTwoArr = list.slice(list.length - 2);
                endTwoArr.forEach(item => {
                    if (item.role === 'ai') {
                        item.content.content = this.parseContent(item.content.content);
                    }
                })
                this.chatHistory = endTwoArr;
            }
        },
        // 查看历史记录时，如果有<Content>标签，只显示标签包裹的内容
        parseContent(content) {
            if (content.includes('<Content>') && content.includes('</Content>')) {
                return extractContent(content, 'Content').join('\n');
            } else {
                return content;
            }
        },
        copyContent() {
            if (this.parsedChatHistory) {
                this.$copyText(this.parsedChatHistory);
                this.$message.success('复制成功');
            }
        },
        // 重新回答
        restartChat() {
            const messageId = this.chatHistory[this.chatHistory.length - 1].messageUniqueId;
            this.createHumanMessage(this.title);
            this.startAnswer(messageId);
        },
        scrollToEnd() {
            this.$nextTick(() => {
                const element = document.getElementById("message-container");
                setTimeout(() => {
                    element.scrollTo({
                        top: element.scrollHeight,
                        behavior: "smooth"
                    })
                }, 0)
            })
        },
    }
}
</script>

<style scoped lang="scss">
.container-shadow {
    box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05), 0px 5px 7px 0px rgba(65, 114, 209, 0.08);
}

.empty-content {
    background: linear-gradient(180.00deg, rgba(223, 238, 255, 1), rgba(253.18905639648438, 253.6417999267578, 255, 1) 59%);
    ;
}

.search-box {
    ::v-deep {
        .el-input__inner {
            border-radius: 8px 0 0 8px;
        }

        .el-button--medium {
            border-radius: 0 8px 8px 0;
        }
    }
}
</style>