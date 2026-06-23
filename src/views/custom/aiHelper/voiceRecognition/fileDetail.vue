<template>
    <div class="file-detail flex flex-col bg-[#EEF6FD]">
        <header class="w-full h-[58px]">
            <FileDetailHeader ref="fileDetailHeader" :currentRow="currentRow" :optionType="optionType"
                :detailId="detailId" @onCancel="$emit('onCancel')" @onAddSuccess="handleAddKgSuccess" />
        </header>
        <div class="flex-1 w-full flex gap-[16px] py-[16px] pl-[32px] pr-[48px] overflow-hidden">
            <!-- 智能记录和发言人tab -->
            <aside class="w-[480px] h-full flex flex-col gap-[10px] px-[16px] py-[10px] rounded-[16px] bg-white">
                <div class="flex justify-between items-center">
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="智能记录" name="1"></el-tab-pane>
                        <el-tab-pane label="发言人" name="2"></el-tab-pane>
                    </el-tabs>
                    <!-- <svg-icon icon-class="double-left" class-name="!w-[24px] !h-[24px] cursor-pointer" /> -->
                </div>

                <!-- 智能记录内容 -->
                <div v-if="activeTab === '1'" class="flex-1 w-full flex flex-col gap-[10px] overflow-hidden">
                    <div v-for="(item, index) in minutes" :key="item.id"
                        class="chat w-full py-[10px] px-[12px] flex flex-col gap-[8px] overflow-hidden"
                        :class="`chat-${(index) % 2} ${activeMinutes === item.id ? 'active' : 'cursor-pointer'}`"
                        @click="activeMinutes = item.id">
                        <div class="w-full flex items-center justify-between">
                            <span class="chat-title">{{ item.title }}</span>
                            <transition name="delay-appear">
                                <span v-if="activeMinutes === item.id">
                                    <OperateButtonGroup :copy="() => handleCopy(item.id)"
                                        :add-to-kg="() => handleToKg(item.id)"
                                        :alreadyAddToKg="alreadyAddToKg[item.id]" />
                                </span>
                                <svg-icon v-else icon-class="knowledge-down"
                                    class-name="!w-[24px] !h-[24px] text-[#5F646C] cursor-pointer" />
                            </transition>
                        </div>
                        <div v-if="activeMinutes === item.id" class="text-[#959BA1] text-[12px] leading-[17px]">总结</div>
                        <div v-if="activeMinutes === item.id"
                            class="flex-1 text-[#1D2129] text-[14px] leading-[26px] px-[12px] ml-[-12px] mr-[-12px] overflow-y-auto scrollbar-small">
                            <div v-if="item.id == '1'">{{ currentRow.summary.content }}</div>
                            <div v-if="item.id == '2'" class="flex flex-col gap-[10px]">
                                <div v-for="chapter in currentRow.chapterSummaries" :key="chapter.id"
                                    class="flex flex-col items-start gap-[4px]">
                                    <div
                                        class="flex items-center px-[8px] py-[2px] rounded-[4px] bg-[#B8CDFF] text-[#3662FF] text-[14px] leading-[18px]">
                                        <svg-icon icon-class="time"
                                            class-name="!w-[16px] !h-[16px] mr-[4px]" />{{ formatDuration(chapter.startTime) }}-{{ formatDuration(chapter.endTime) }}
                                    </div>
                                    <div>{{ chapter.content }}</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="activeMinutes === item.id" class="w-full flex justify-end">
                            <svg-icon icon-class="knowledge-down" @click.stop="activeMinutes = ''"
                                class-name="!w-[24px] !h-[24px] text-[#5F646C] cursor-pointer rotate-180" />
                        </div>
                    </div>
                </div>
                <div v-if="activeTab === '1'" class="text-[#666666] text-[12px] leading-[22px]">
                    智能纪要内容由AI生成，不代表平台立场，请谨慎甄别后使用</div>
                <div v-if="activeTab === '2'" class="flex-1 w-full">
                    <SpeechTimeLine
                        :speeches="(isShowFilterResult ? filterRow.recognitionResults : currentRow.recognitionResults)"
                        @speech-click="handleSpeechClick" />
                </div>

            </aside>
            <!-- 右侧文本记录 -->
            <main class="flex-1 h-full flex flex-col py-[10px] bg-white rounded-[16px] overflow-hidden">
                <!-- title栏和搜索 -->
                <div class="h-[46px] flex items-center justify-between px-[16px]">
                    <span class="text-[14px] font-bold">文本记录</span>
                    <div class="flex items-center gap-[8px]">
                        <el-input v-model="keyword" class="h-[40px] w-[300px]" placeholder="请输入搜索关键字" clearable
                            @input="handleSearch" suffix-icon="el-icon-search" />
                        <span>
                            <OperateButtonGroup v-if="Object.keys(currentRow).length > 0" :copy="() => handleCopy('3')"
                                :add-to-kg="() => handleToKg('3')" :alreadyAddToKg="alreadyAddToKg['3']" />
                        </span>

                    </div>
                </div>
                <!-- 主要内容 -->
                <div class="speech-box relative flex-1 w-full flex flex-col gap-[8px] px-[16px] overflow-y-auto scrollbar-small">
                    <div v-for="item in (isShowFilterResult ? filterRow.recognitionResults : currentRow.recognitionResults)"
                        :key="item.id" :class="{ 'highlighted-speech': highlightedSpeechId === item.id }"
                        @mouseover="cancelHighlight" @click="cancelHighlight">
                        <div class="flex items-center gap-[8px]">
                            <div class="h-[24px] w-[24px] rounded-full border-[1px] border-[#fff] flex items-center justify-center text-[12px] text-[#fff]"
                                :style="{ backgroundColor: item.speaker.color || '#9C8EFF' }">{{ item.speaker.abbr }}</div>
                            <div class="text-[#959BA1] text-[12px] leading-[24px]">{{ item.speaker.name }}</div>
                        </div>
                        <div class="pl-[32px] text-[14px] leading-[26px]" v-html="item.content"></div>
                    </div>
                </div>
                <!-- 音频 -->
                <div v-if="currentRow.publicUrl" class="h-[68px] w-full px-[16px]">
                    <AudioPlayer :audioSrc="currentRow.publicUrl" />
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import FileDetailHeader from "./fileDetailHeader.vue";
import { getDetail } from "@/api/custom/voiceRecognition";
import { deepClone } from "@/utils";
import getRandomColor from "./getRandomColor.js"
import OperateButtonGroup from "@/components/custom/button/OperateButtonGroup.vue";
import SpeechTimeLine from "./speechTimeLine.vue";
import AudioPlayer from "./audioPlayer.vue";
export default {
    name: 'FileDetail',
    props: {
        detailId: {
            type: Number,
            default: -1
        }
    },
    components: {
        FileDetailHeader,
        OperateButtonGroup,
        SpeechTimeLine,
        AudioPlayer
    },
    data() {
        return {
            keyword: '',
            activeTab: '1',
            // 纪要
            minutes: [{
                id: '1',
                title: '会议纪要',
                content: '纪要1内容'
            }, {
                id: '2',
                title: '章节纪要',
                content: '纪要2内容'
            }],
            activeMinutes: '',
            currentRow: {},
            filterRow: {},
            isShowFilterResult: false,
            time: null,
            getRandomColor,
            optionType: '1',// 1-会议纪要 2-章节纪要 3-文本记录
            alreadyAddToKg: {
                '1': false,
                '2': false,
                '3': false,
            },
            // 当前高亮的发言ID
            highlightedSpeechId: null,
        }
    },
    created() {
        this.getDetailInfo()
    },
    methods: {
        getDetailInfo() {
            getDetail(this.detailId).then(res => {
                if (res.code === 200) {
                    let result = res.data
                    // 发言人颜色为空则填充随机颜色
                    result.speakers.forEach(speaker => {
                        if (!speaker.color) {
                            speaker.color = this.getRandomColor()
                        }
                    })
                    // 发言中有id为-1的发言人id时，在发言人列表中加入未知发言人
                    let isUnknownSpeaker = result.recognitionResults.some(item => item.speakerId === -1)
                    if (isUnknownSpeaker) {
                        result.speakers.push({
                            id: -1,
                            name: '未知发言人',
                            abbr: '?',
                            color: this.getRandomColor()
                        })
                    }
                    // 将对应发言人填充到句子中
                    result.recognitionResults.forEach(item => {
                        item.speaker = result.speakers.find(speaker => speaker.id === item.speakerId)
                    })
                    this.currentRow = result
                }
            })
        },
        handleTabClick(tab) {
            this.activeTab = tab.name
        },
        formatDuration(duration) {
            if (!duration) {
                return '00:00'
            }
            duration = Math.round(duration)
            const minutes = Math.floor(duration / 60)
            const seconds = duration % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },
        handleSearch(value) {
            if (this.time) {
                clearTimeout(this.time)
            }
            if (!value) {
                this.isShowFilterResult = false
            }
            this.time = setTimeout(() => {
                console.time('handleSearch')
                this.filterRow = deepClone(this.currentRow)
                this.filterRow.recognitionResults = this.filterRow.recognitionResults.filter(item => {
                    if (item.content.includes(value)) {
                        item.content = item.content.replaceAll(value, `<span style="color: #3662FF;">${value}</span>`)
                        return true
                    }
                    return false
                })
                this.isShowFilterResult = true
                console.timeEnd('handleSearch')
            }, 500);
        },
        handleCopy(type) {
            console.log('handleCopy', type);

            if (!this.$refs.fileDetailHeader) {
                return
            }
            this.optionType = type
            setTimeout(() => {
                this.$refs.fileDetailHeader.copyChat()
            }, 0)
        },
        handleToKg(type) {
            if (!this.$refs.fileDetailHeader) {
                return
            }
            this.optionType = type
            setTimeout(() => {
                this.$refs.fileDetailHeader.addCurrentChatToKnowledge()
            }, 0)
        },
        handleAddKgSuccess(type) {
            this.alreadyAddToKg[type] = true
        },

        // 处理时间线点击事件
        handleSpeechClick(speech) {
            // 找到对应的发言记录索引
            const displayResults = this.isShowFilterResult ? this.filterRow.recognitionResults : this.currentRow.recognitionResults;
            const targetIndex = displayResults.findIndex(item => item.id === speech.id);

            if (targetIndex !== -1) {
                // 高亮当前记录
                this.highlightedSpeechId = speech.id;

                // 滚动到对应记录
                setTimeout(() => {
                    const contentContainer = document.querySelector('.speech-box');
                    if (contentContainer) {
                        const targetElement = contentContainer.children[targetIndex];
                        if (targetElement) {
                            contentContainer.scrollTo({
                                top: targetElement.offsetTop - 20,
                                behavior: 'smooth'
                            });
                        }
                    }
                }, 100);

                // 3秒后自动取消高亮（如果没有手动取消）
                setTimeout(() => {
                    if (this.highlightedSpeechId === speech.id) {
                        this.highlightedSpeechId = null;
                    }
                }, 3000);
            }
        },

        // 取消高亮
        cancelHighlight() {
            this.highlightedSpeechId = null;
        },
    },
}
</script>

<style scoped lang="scss">
.file-detail {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

    ::v-deep .el-tabs__nav-wrap::after {
        display: none;
    }
}

.chat {
    box-sizing: border-box;
    border-radius: 12px;
    transition: flex 0.3s ease-in-out;

    .chat-title {
        font-size: 14px;
        font-weight: 700;
        line-height: 28px;
    }

    &.active {
        flex: 1;
    }
}

.chat-0 {

    border: 1px solid rgba(242, 244, 255, 1);
    background: linear-gradient(180.00deg, rgba(239, 241, 255, 1), rgba(249, 250, 255, 1) 100%);

    .chat-title {
        color: #8445FF;
    }
}

.chat-1 {
    border: 1px solid rgba(228, 241, 255, 1);
    background: linear-gradient(179.43deg, rgba(230, 244, 255, 1), rgba(247, 251, 255, 1) 100%);

    .chat-title {
        color: #186AE3;
    }
}

/* 过渡动画定义 */
.delay-appear-enter-active {
    /* 延迟0.3秒后执行动画 */
    transition: opacity 0.3s ease, transform 0.3s ease;
    transition-delay: 0.2s;
}

/* 高亮发言记录的样式 */
.highlighted-speech {
    background-color: rgba(54, 98, 255, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
}

/* 动画结束状态 */
.delay-appear-enter-to {
    opacity: 1;
    transform: translateY(0);
}

/* 确保初始渲染时不显示（可选） */
.delay-appear-enter {
    opacity: 0;
    transform: translateY(-10px);
}

.delay-appear-leave {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
