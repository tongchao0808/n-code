<template>
    <div class="h-full w-full py-[24px] flex flex-col gap-[36px] text-[#1D2129] position-relative">
        <!-- 收藏夹和历史记录 -->
        <div class="w-full flex justify-end items-center text-[14px] leading-[24px] gap-[36px] relative">

            <div v-if="isDetail" class="absolute top-0 left-0">
                <el-breadcrumb>
                    <el-breadcrumb-item><a @click="isDetail = false">条款速查</a></el-breadcrumb-item>
                    <el-breadcrumb-item class="font-bold">详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="flex items-center cursor-pointer hover:text-[#3662FF]" @click="favoriteOpen = true"><svg-icon
                    icon-class="favorites" class="!w-[16px] !h-[16px] mr-[8px]"></svg-icon>
                <span>收藏夹</span>
            </div>
            <div class="flex items-center cursor-pointer hover:text-[#3662FF]" @click="historyOpen = true"><svg-icon
                    icon-class="records" class="!w-[16px] !h-[16px] mr-[8px]"></svg-icon>
                <span>历史记录</span>
            </div>
        </div>

        <!-- 搜索框 -->
        <div class="header-search h-[64px] w-full flex justify-center items-center">
            <div
                class="h-full w-[60%] bg-white rounded-[12px] px-[16px] py-[8px] flex items-center justify-between gap-[24px]">
                <el-input v-model="keyword" @keyup.enter.native="handleSearch" placeholder="请输入条款编号或条款关键词" class="flex-1 border-[#00000000]" />
                <el-button @click="handleSearch" type="primary"
                    class="w-[120px] h-[48px] bg-[#3662FF] text-[#fff] text-[14px] leading-[24px] rounded-[8px] flex items-center justify-center cursor-pointer">开始搜索</el-button>
            </div>
        </div>

        <!-- 最近访问 -->
        <div v-if="recentList.length" class="linear-bg p-[24px] rounded-[16px]">
            <div class="text-[18px] leading-[32px] mb-[16px]">最近访问</div>
            <div class="w-full grid grid-cols-5 gap-[16px] z-[1]">
                <div v-for="item in recentList" :key="item.id" @click="handleRecent(item)"
                    class="w-full hover-border-style hover:text-[#3662FF] bg-[#F5F8FF] rounded-[8px] flex items-center gap-[16px] px-[24px] py-[12px] cursor-pointer">
                    <svg-icon icon-class="recentlyVisited" class="!w-[48px] !h-[48px] flex-shrink-0"></svg-icon>
                    <div class="flex-1 flex flex-col text-[14px] leading-[24px] min-w-0">
                        <span class="min-w-0 overflow-box">#{{item.title}}</span>
                        <span class="min-w-0 overflow-box">{{item.content}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-loading="searchLoading" class="linear-bg flex-1 w-full flex p-[24px] gap-[16px] rounded-[16px] overflow-hidden">

            <!-- 搜素结果 -->
            <div class="flex-1 h-full min-w-0 bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]">
                <div class="text-[18px] leading-[32px]">搜索结果<span>({{searchList.length}})</span></div>
                <div class="flex-1 w-full h-full min-w-0 p-[1px] overflow-y-auto text-[14px] leading-[24px] flex flex-col gap-[16px] z-[1]"
                    :class="{'pr-[12px]':searchList.length > 2}">
                    <div v-for="item in searchList" :key="item.id" @click="toZoomDetail(item)"
                        class="w-full min-w-0 flex flex-col gap-[12px] hover-border-style hover:bg-[#F5F8FF] bg-white px-[24px] py-[12px] rounded-[8px] cursor-pointer">
                        <div class="flex justify-between text-[16px] leading-[21px]">
                            <span>#{{item.title}}</span>
                            <svg-icon :icon-class="item.favorite?'star':'star-line'"
                                class="!w-[16px] !h-[16px] hover:scale-110" :class="{'text-[#FAAD14]':item.favorite}"
                                @click.stop="handleFavorite(item)"></svg-icon>
                        </div>
                        <div class="min-w-0 text-[#5F646C] overflow-box">
                            {{item.content}}
                        </div>
                        <div class="text-[#5F646C] flex items-center justify-end">
                            <svg-icon icon-class="file-line" class="!w-[16px] !h-[16px] mr-[8px]"></svg-icon>
                            <span
                                class="max-w-[240px] overflow-box">{{item.documentName}}</span>
                        </div>
                    </div>
                    <div v-if="!searchList.length && !searchLoading"
                        class="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
                        <img src="@/assets/images/file-empty.png" class="h-[90%]" alt>
                        <span class="text-[18px]">未找到搜索结果</span>
                    </div>
                </div>
            </div>

            <!-- 相关条款 -->
            <div v-if="searchList.length"
                class="w-[320px] h-full bg-white bg-opacity-80 rounded-[8px] p-[24px] flex flex-col gap-[16px]">
                <div class="text-[18px] leading-[32px]">相关条款<span>({{relatedList.length}})</span></div>
                <div class="flex-1 w-full overflow-y-auto p-[1px] flex flex-col gap-[16px] z-[1]"
                    :class="{'pr-[6px]':relatedList.length > 6}">
                    <div v-for="item in relatedList" :key="item.id" @click="toZoomDetail(item)"
                        class="w-full h-[48px] flex items-center justify-between hover-border-style hover:bg-[#F5F8FF] hover:text-[#3662FF] p-[12px] rounded-[8px] bg-white cursor-pointer">
                        <div class="text-[14px] leading-[24px]">#{{item.title}}</div>
                        <svg-icon icon-class="right-arrow" class="!w-[16px] !h-[16px]"></svg-icon>
                    </div>
                </div>
            </div>
        </div>
        <el-drawer title="收藏夹" :visible.sync="favoriteOpen" :size="1120" custom-class="zoom-drawer">
            <FavoriteDialog v-if="favoriteOpen" @getDetail="toZoomDetail" />
        </el-drawer>
        <el-drawer title="历史记录" :visible.sync="historyOpen" :size="500" custom-class="zoom-drawer">
            <HistoryDialog v-if="historyOpen" @getDetail="toZoomDetail" />

        </el-drawer>
        <!-- 详情 -->
        <div class="detail-info p-[24px] rounded-[8px] flex flex-col" v-if="isDetail">
            <div class="text-center text-[28px] leading-[34px] font-bold mb-[16px]">{{ formatTitle(detailInfo.documentName) }}</div>
            <div class="w-full flex-1 overflow-y-auto"><Markdown :content="detailInfo.documentContent"/></div>
        </div>
    </div>
</template>

<script>
import HistoryDialog from './historyDialog.vue'
import FavoriteDialog from './favoriteDialog.vue'
import Markdown from "@/components/custom/md/Markdown.vue";
import { getZoomList, getZoomDetail, setFavorite, getZoomHistory } from '@/api/custom/agentZoom'
import { MarkdownSplitter } from './MarkdownSplitter'



export default {
    name: 'AgentZoom',
    components: {
        HistoryDialog,
        FavoriteDialog,
        Markdown,

    },
    data() {
        return {
            keyword: '',
            recentList: [],
            searchList: [],
            relatedList: [],
            favoriteOpen: false,
            historyOpen: false,
            isDetail: false,
            searchLoading: false,
            detailInfo: {}

        }
    },
    created() {
        this.getRecentList()
    },
    methods: {
        handleSearch() {
            if (!this.keyword) {
                this.$message.error('请输入搜索内容')
                return
            }
            this.searchLoading = true
            getZoomList(this.keyword).then(res => {
                this.searchList = res.data.resultSections
                this.relatedList = res.data.relatedSections
                this.searchLoading = false
            })
        },
        getRecentList() {
            getZoomHistory().then(res => {
                this.recentList = res.data.slice(0, 5)
            })
        },
        handleFavorite(item) {
            setFavorite(item.id, !item.favorite).then(res => {
                if (res.code === 200) {
                    item.favorite = !item.favorite
                    if (item.favorite) {
                        this.$message.success('收藏成功')
                    }
                }
            })
        },
        async toZoomDetail(item) {
            const res = await getZoomDetail(item.id)
                if (res.code === 200) {
                    this.detailInfo = res.data
                    this.favoriteOpen = false
                    this.historyOpen = false
                    this.isDetail = true
                    this.highlightAndScroll(res.data.documentContent, res.data.startPosition, res.data.endPosition)
                }
        },
        formatTitle(title) {
            return title.split('.')[0]
        },
        handleRecent(item) {
            this.toZoomDetail(item)
        },
        highlightAndScroll(fullText, startIdx, endIdx) {
            // 2. 校验输入（防止下标越界或逻辑错误）
            if (isNaN(startIdx) || isNaN(endIdx) || startIdx < 0 || endIdx > fullText.length || startIdx >= endIdx) {
                alert('请输入有效的下标（开始下标 < 结束下标，且不超出文本长度）');
                return;
            }

            // 3. 切割文本：将完整文本拆分为「前半段 + 高亮段 + 后半段」
            const beforeText = fullText.slice(0, startIdx); // 高亮前的文本
            const highlightText = fullText.slice(startIdx, endIdx); // 需高亮的文本
            const afterText = fullText.slice(endIdx); // 高亮后的文本

            // 处理高亮文本
            const splitter = new MarkdownSplitter();
            const result = splitter.split(highlightText);
            result.forEach(item => {
                if (item.type === 'text') {
                    item.content = `<span class="highlight">${item.content}</span>`
                    // item.content = item.content.replace(highlightText, `<span class="highlight">${highlightText}</span>`)
                }else if (Object.keys(item.details).length > 0) {
                    item.content = item.content.replace(item.details.text, `<span class="highlight">${item.details.text}</span>`)
                }
            })
            const highlightedText = result.map(item => item.content).join('').replace('<span', '<span id="highlightedElement"')
            
            

            // 4. 渲染高亮：用 <span class="highlight"> 包裹目标片段，插入容器
            // 注意：用 innerHTML 而非 textContent，才能解析 HTML 标签
            this.detailInfo.documentContent = `${beforeText}${highlightedText}${afterText}`;

            this.$nextTick(() => {
                // 5. 滚动定位：找到高亮元素，将其滚动到视图中
                const highlightedElement = document.getElementById('highlightedElement');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({
                        behavior: 'smooth', // 平滑滚动（可选：'auto' 为瞬间定位）
                        block: 'start' // 高亮元素垂直居中显示（可选：'start' 顶部对齐，'end' 底部对齐）
                    });
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">

.header-search {
    ::v-deep {
        .el-input__inner {
            border: none;
        }
    }
}

.linear-bg {
    background: linear-gradient(114deg, rgba(193, 212, 255, 0.30) 11.85%, rgba(244, 234, 255, 0.30) 112.95%);
}

::v-deep .hover-border-style {
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: -1px;
        right: -1px;
        left: -1px;
        bottom: -1px;
        border-radius: 9px;
        background: #E5E6EB;
        z-index: -1;
    }

    &:hover {
    &::before {
        background: linear-gradient(180deg, #C0AAFD 0%, #6889FF 100%);
    }
}
}

::v-deep .zoom-drawer {
    border-radius: 16px 0 0 16px;
    background: linear-gradient(180deg, #EDF7FF 0%, #FFF 10%, #FFF 90%, #EEEAFF 100%);

    .el-drawer__header {
        padding: 71px 32px 0 32px;
        margin-bottom: 8px;
    }

    .el-drawer__body {
        padding: 32px;
        z-index: 1;
    }
}

.detail-info {
    background: #fff;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 24px;
    z-index: 10;
}

::v-deep .highlight {
      color: #3662FF;
    }    
</style>