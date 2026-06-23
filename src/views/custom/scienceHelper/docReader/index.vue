<template>
    <div class="page-box flex flex-col items-center relative">
        <MyBreadcrumb :items="breadcrumbItems" />

        <div class="w-[75%] flex-1 flex flex-col overflow-hidden">
            <!-- 文献阅读、文献翻译header -->
            <div v-if="!isSearch" class="w-full flex justify-center items-center text-[36px] leading-[46px] font-bold">
                <div v-if="readType == 'read'" class="py-[20px]">选择一篇文献开始深度阅读</div>
                <div v-else-if="readType == 'translation'" class="py-[20px]">选择一篇文献开始翻译 </div>
                <div v-else class="w-full flex justify-start items-center pt-[12px] pb-[16px] text-[#fff]">
                    <el-button type="primary" @click="readType = 'read'"><span class="flex items-center">
                            <svg-icon icon-class="eye-open"
                                class-name="!w-[20px] !h-[20px] mr-[6px]" />文献深度阅读</span></el-button>
                    <el-button type="primary" @click="readType = 'translation'"><span class="flex items-center">
                            <svg-icon icon-class="translate"
                                class-name="!w-[20px] !h-[20px] mr-[6px]" />文献翻译</span></el-button>
                </div>
            </div>

            <!-- 搜索框 -->
            <div v-if="readType" class="flex">
                <el-input v-model="keyword" placeholder="搜索你想要阅读的文献" clearable class="search-input" />
                <el-button type="primary" class="font-bold" style="width:200px;border-radius:0 8px 8px 0;"
                    @click="clickSearch">搜索</el-button>
            </div>

            <!-- 本地上传和最近阅读 -->
            <div v-if="!isSearch" class="flex-1 flex gap-x-[20px] mb-[32px]" :class="{'mt-[24px]': readType}">
                <div v-if="readType" class="upload w-[400px]">
                    <div class="flex justify-between items-center text-white text-[16px]">
                        <b>本地上传</b>
                        <div class="flex items-center cursor-pointer hover:underline" @click="showUploadHistory({})">
                            <svg-icon icon-class="history" class-name="!w-[20px] !h-[20px] mr-[6px]" />
                            <span class="text-[14px] leading-[20px]">上传记录</span>
                        </div>
                    </div>
                    <div class="flex-1 overflow-hidden mt-[16px] mb-[8px]">
                        <FileUpload v-model="fileList" :is-show-tip="false"
                            :class="['w-full', 'h-full', 'flex', 'flex-col', 'gap-[16px]', { isUpload: fileList.length }]"
                            :is-del-confirm="true" :limit="20" :file-size="100" :file-type="['pdf', 'docx']"
                            url='/attachment/chat/upload' del-confirm-text="将清除上传记录且彻底删除该文件">
                            <template v-slot:successSlot="{ item }">
                                <el-button type="text" size="mini" class="p-0 text-[10px] leading-[14px]"
                                    @click.stop="showUploadHistory(item)">{{ readType == 'read' ? '阅读' :
                                    '翻译'}}</el-button>
                            </template>
                            <div class="w-full rounded-[8px] bg-white flex flex-col justify-center items-center"
                                :style="`height: ${fileList.length ? '100px' : '100%'}`">
                                <img src="@/assets/images/file-upload.png" class="w-[30px]">
                                <span class="text-[14px] leading-[18px] mt-[8px] mb-[2px]">点击添加</span>
                                <div v-if="!fileList.length"
                                    class="text-[#C9CDD4] px-[32px] text-[12px] leading-[18px]">
                                    可上传pdf、docx文件,每个文件不超过100MB,每次上传数量不超过20个</div>
                            </div>
                        </FileUpload>
                    </div>
                </div>
                <div class="flex-1 h-full overflow-hidden">
                    <RecentRead ref="recentRead" :readType="readType" @fileClick="handleFileClick" />
                </div>
            </div>

            <!-- 搜索结果 -->
            <SearchResult ref="searchResult" v-if="isSearch" v-model="keyword" :readType="readType"
                @clickSearchRow="handleFileClick" />
        </div>
        <div v-if="isDetail" class="absolute top-0 right-0 w-full h-full bg-[#EEF6FD] z-[10]">
            <FileRead v-if="readType == 'read' || readType == ''" :detail="fileDetail" @close="isDetail = false" />
            <FileTranslation v-if="readType == 'translation'" :detail="fileDetail" @close="isDetail = false" />
        </div>
        <UploadHistoryDialog ref="uploadHistoryDialog" :detail="fileDetail" @fileClick="handleFileClick" @close="closeUploadHistoryDialog" />
        <img src="@/assets/images/aihelper-bg.png" alt="Background Image" class="fullscreen-img" />
    </div>
</template>

<script>
import RecentRead from './recentRead.vue';
import SearchResult from './searchResult.vue';
import MyBreadcrumb from './myBreadcrumb.vue';
import FileTranslation from './fileTranslation.vue';
import FileRead from './fileRead.vue';
import UploadHistoryDialog from './uploadHistoryDialog.vue';

export default {
    name: 'docReader',
    components: {
        RecentRead,
        SearchResult,
        MyBreadcrumb,
        FileTranslation,
        FileRead,
        UploadHistoryDialog,
    },
    data() {
        return {
            keyword: '',
            readType: '',
            fileList: [],
            isSearch: false,
            isDetail: false,
            fileDetail: {},
        }
    },
    watch: {
        readType: {
            handler(newVal, oldVal) {
                if(newVal == 'translation') {
                    this.$store.state.history.scene = 'literature-read-translate'
                }else {
                    this.$store.state.history.scene = 'literature-read-deep'
                }
                this.fileList = []
            },
            immediate: true
        }
    },
    computed: {
        breadcrumbItems() {
            const arr = [
                {
                    name: '科研辅助',
                    handle: () => {
                        this.$tab.openPage('', '/medicalResearch/scienceHelper')
                    },
                },
                {
                    name: '文献阅读',
                    handle: () => {
                        this.readType = '';
                        this.isSearch = false;
                        this.closeUploadHistoryDialog()
                    },
                },
                {
                    name: '深度阅读',
                    handle: () => {
                        this.isSearch = false;
                        this.closeUploadHistoryDialog()
                    },
                },
                {
                    name: '翻译',
                    handle: () => {
                        this.isSearch = false;
                        this.closeUploadHistoryDialog()
                    },
                },
                {
                    name: '搜索结果',
                    handle: () => {
                    },
                },
            ]
            let filterArr = ['科研辅助', '文献阅读']
            if(this.readType == 'read') {
                filterArr.push('深度阅读')
            }
            if(this.readType == 'translation') {
                filterArr.push('翻译')
            }
            if(this.isSearch) {
                filterArr.push('搜索结果')
            }
            return arr.filter(item => filterArr.includes(item.name))
        }
    },
    methods: {
        closeUploadHistoryDialog() {
            this.$refs.recentRead.getList('recentReadList')
        },
        clickSearch() {
            if (!this.keyword) {
                this.$message.error('搜索关键词不能为空')
                return
            }
            if(this.isSearch) {
                this.$refs.searchResult.changeKeyword()
                return
            }
            this.isSearch = true
        },
        handleFileClick(file) {
            this.fileDetail = file
            this.isDetail = true
        },
        showUploadHistory(item) {
            this.fileDetail = item
            this.$nextTick(() => {
                this.$refs.uploadHistoryDialog.showUploadHistory()
            })
        },
    }
}
</script>

<style scoped lang="scss">
.page-box {
    width: 100%;
    height: 100%;

    ::v-deep .el-button--medium {
        padding: 10px 16px;
        border-radius: 8px;
    }
}

.search-input {
    ::v-deep .el-input__inner {
        border-radius: 8px 0 0 8px;
    }
}

.upload {
    // 背景颜色从上向下渐变
    background: linear-gradient(180deg, #90b0fb 0%, #e9edfe 100%);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
        0px 5px 7px 0px rgba(65, 114, 209, 0.08);

    ::v-deep {
        .upload-file-uploader {
            width: 100%;
            height: 100%;

            .el-upload {
                width: 100%;
                height: 100%;
            }
        }
    }

    .isUpload {
        ::v-deep {
            .upload-file-uploader {
                width: 100%;
                height: auto;

                .el-upload {
                    width: 100%;
                    height: auto;
                }
            }

            .upload-file-list {
                flex: 1;
                overflow-y: auto;
                background: #fff;
                border-radius: 8px;
                padding: 0 8px;

                .el-upload-list__item {
                    padding: 8px;
                    display: flex;

                    .el-link--inner {
                        word-break: break-all;

                        .el-icon-document {
                            display: block;
                        }
                    }
                }
            }
        }
    }
}
</style>