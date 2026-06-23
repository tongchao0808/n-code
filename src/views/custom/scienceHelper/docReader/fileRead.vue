<template>
    <div class="file-read-page w-full h-full flex flex-col">
        <div class="h-[58px] flex items-center gap-[12px] px-[32px]">
            <svg-icon icon-class="right-arrow"
                class-name="!w-[24px] !h-[24px] rotate-180 text-[#5F646C] cursor-pointer hover:text-[#3662FF] hover:scale-110"
                @click="cancel" />
            <svg-icon icon-class="file-icon-read" class-name="!w-[48px] !h-[48px]" />
            <span class="text-[16px] font-bold">{{ readContent.title }}</span>
        </div>

        <div v-loading="isLoading" class="flex-1 w-full flex gap-[16px] px-[32px] pb-[24px] overflow-hidden">
            <!-- 预览 -->
            <!-- <div v-if="fileExt === 'pdf'" class="lefx-box w-[200px] shrink-0 flex flex-col">
                <div class="text-[16px] leading-[44px] text-[#fff] font-bold ml-[24px]">预览</div>
                <div class="flex-1 p-[16px] flex flex-col gap-[8px] overflow-y-auto">

                    <div class="thumbnail-sidebar">
                        <div class="thumbnail-item" v-for="(thumb, index) in thumbnails" :key="index"
                            @click="handleThumbnailClick(index + 1)" :class="{ active: currentPage === index + 1 }">
                            <img :src="thumb" />
                        </div>
                    </div>

                </div>
            </div> -->

            <!-- 文章详情 -->
            <div class="doc-content flex-1 rounded-[12px] bg-white overflow-y-auto scrollbar-small" :class="detail.source == 'PUBMED' ? 'px-[64px] py-[32px]' : 'p-[20px]'">
                <FilePreview v-if="detail.source != 'PUBMED' && readContent.literatureUrl" :src="readContent.literatureUrl"
                    :currentPage="currentPage" @load="handleLoad" @page-change="handlePageChange" />
                <Markdown v-if="detail.source == 'PUBMED' && readContent.content" :content="readContent.content" />
            </div>

            <!-- 右侧栏 -->
            <div class="right-box w-[400px] rounded-[12px] p-[16px] shrink-0 bg-white flex flex-col">
                <el-tabs v-model="activeTab">
                    <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
                        <span slot="label" class="flex flex-col items-center justify-center h-full">
                            <span class="text-[16px] leading-[22px]">{{
                                tab.label }}</span>
                        </span>
                    </el-tab-pane>
                </el-tabs>
                <el-divider class="mt-0"></el-divider>
                <div v-if="readContent.sessionUniqueId" class="flex-1 w-full overflow-y-auto scrollbar-small" :class="{'pr-[12px]': ['info', 'abstract'].includes(activeTab)}">
                    <Info v-if="activeTab === 'info'" :detail="readContent" />
                    <Abstract v-if="activeTab === 'abstract'" :detail="readContent" />
                    <AiRead v-if="activeTab === 'aiRead'" :detail="readContent" :listDetail="detail" />
                    <Note v-if="activeTab === 'note'" :detail="readContent"
                        :initContent="readContent.literatureNotes || ''" @change="onNoteChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Info from './readTabsContent/info.vue'
import Abstract from './readTabsContent/abstract.vue'
import AiRead from './readTabsContent/aiRead.vue'
import Note from '@/components/RichTextEditor/index.vue'
import { deepReadArticle, saveNotes } from "@/api/custom/docReader";
import FilePreview from '@/components/filePreview/index.vue'
import Markdown from '@/components/custom/md/Markdown.vue'
import {createNewChatSession} from "@/api/custom";

export default {
    name: 'FileRead',
    props: {
        detail: {
            type: Object,
            default: () => { },
        }
    },
    components: {
        Info,
        Abstract,
        AiRead,
        Note,
        FilePreview,
        Markdown,
    },
    data() {
        const tabs = [
            { label: '资料', name: 'info' },
            { label: '摘要', name: 'abstract' },
            { label: 'AI辅读', name: 'aiRead' },
            { label: '笔记', name: 'note' },
        ]
        return {
            activeTab: 'info',
            tabs,
            readContent: {},
            noteSaveTime: null,
            isLoading: false,
            currentPage: 1,
            thumbnails: [],              // 缩略图列表（base64）
            totalPages: 0,               // 总页数
            pdfDoc: null                 // PDF文档实例
        }
    },
    computed: {
        fileExt() {
            if(!this.readContent.literatureUrl || this.readContent.literatureUrl.split('.').length <= 1){
                return ''
            }
            return this.readContent.literatureUrl.split('.').pop()
        }
    },
    created() {
        this.initData();
    },
    methods: {
        async initData() {
            this.isLoading = true
            let sessionUniqueId = this.detail.sessionUniqueId || this.detail.sessionId;
            if (!sessionUniqueId) {
                const conn = await createNewChatSession();
                sessionUniqueId = conn.sessionUniqueId;
            }
            deepReadArticle({
                sessionUniqueId: sessionUniqueId,
                literatureSource: this.detail.source,
                literatureId: this.detail.literatureId || this.detail.taskId,
            }).then(res => {
                res.data.imageExtraction = JSON.parse(res.data.imageExtraction || '[]');
                this.readContent = res.data;
                this.isLoading = false
                
            })
        },
        cancel() {
            this.$emit('close');
        },
        onNoteChange(content) {
            if (this.noteSaveTime) {
                clearTimeout(this.noteSaveTime);
            }
            this.noteSaveTime = setTimeout(() => {
                saveNotes({
                    sessionId: this.readContent.sessionUniqueId,
                    content: content,
                })
            }, 3000);
        },
        async handleLoad(pdfDoc) {
            console.log('pdf加载完成', pdfDoc);
            this.pdfDoc = pdfDoc
            this.totalPages = pdfDoc.numPages
            await this.generateThumbnails()
        },
        handlePageChange(page) {
            console.log('当前页码', page);
            this.currentPage = page
        },
        // 生成缩略图（无页码，仅图片）
        async generateThumbnails() {
            const thumbnails = []
            for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
                const page = await this.pdfDoc.getPage(pageNum)
                // 缩略图缩放比例（0.2 适中，可根据需要调整）
                const viewport = page.getViewport({ scale: 0.2 })
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                canvas.width = viewport.width
                canvas.height = viewport.height
                await page.render({ canvasContext: ctx, viewport }).promise
                thumbnails.push(canvas.toDataURL('image/png'))
            }
            this.thumbnails = thumbnails
        },
        handleThumbnailClick(pageNum) {
      this.currentPage = pageNum
    },
    }
}
</script>

<style scoped lang="scss">
.file-read-page {
    .lefx-box {
        border-radius: 12px;
        /* 临时 */
        box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05), 0px 5px 7px 0px rgba(65, 114, 209, 0.08);
        background: linear-gradient(180.00deg, rgba(128.77703857421875, 176.23779296875, 253.8616180419922, 1), rgba(233.48452758789062, 238.2164764404297, 255, 1) 100%);
    }

    .doc-content {
        ::v-deep .vue-office-docx {
            padding-right: 6px;
        }
    }

    .right-box {
        ::v-deep {
            .el-tabs__active-bar {
                background: #ffffff00;
                height: 4px;
                display: flex;
                justify-content: center;

                &::after {
                    content: '';
                    width: 20px;
                    height: 100%;
                    border-radius: 34px;
                    background: #3662FF;
                }
            }

            .el-tabs__header {
                margin: 0;
            }

            .el-tabs__nav {
                display: flex;
                width: 100%;
            }

            .el-tabs__nav-wrap::after {
                display: none !important;
            }

            .el-tabs__item {
                color: #5F646C;
                flex: 1;
                text-align: center;
                /* 移除默认的最小宽度限制 */
                min-width: auto !important;
                padding: 0;
            }

            .el-tabs__item.is-active {
                color: #3662FF;
                font-weight: 600;
            }
        }
    }
}
</style>