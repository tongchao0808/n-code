<template>
    <el-dialog :visible.sync="visible" @close="$emit('close')" width="60%">
        <template #title>
            <span class="flex items-center gap-[8px] font-bold">
                <span>{{ (scene === 'literature-read-translate' ? '翻译' : '阅读') + '上传记录' }}</span>
                <el-tooltip v-if="scene === 'literature-read-translate'" class="item" effect="dark"
                    content="关闭此界面不影响翻译进度，翻译完成后可前往“最近翻译”页查看" placement="top-start">
                    <i class="el-icon-warning-outline text-[#959BA1]"></i>
                </el-tooltip>
            </span>
        </template>
        <div class="w-full h-full flex flex-col border-[1px] border-[#E5E6EB] rounded-[8px]">
            <div class="flex-1 w-full flex flex-col gap-[8px] px-[8px] overflow-hidden">
                <div class="w-full h-[52px] px-[16px] flex items-center border-b-[1px] border-[#E5E6EB]">
                    <span class="pl-[24px] shrink-0" style="flex:2">文章标题</span>
                    <span class="shrink-0" style="flex:1">上传时间</span>
                    <span class="shrink-0"
                        :class="(scene === 'literature-read-translate') ? 'w-[160px]' : 'w-[60px]'"></span>
                </div>
                <div class="flex-1 w-full flex flex-col gap-[8px] overflow-y-auto">
                    <div v-for="item in allFileList" :key="item.taskId" @mouseenter="mouseEnterRow(item)"
                        @click="handleFileClick(item)"
                        :class="{ '!border-[#3662FF] bg-[#F5F8FF]': item.taskId == highlightItem?.taskId }"
                        class="file-item w-full px-[16px] flex items-center text-[16px] rounded-[8px] border-[1px] border-[#fff] cursor-pointer hover:bg-[#F5F8FF]">
                        <span class="flex items-center gap-[8px] text-[#1D2129] shrink-0 overflow-hidden"
                            style="flex:2"><svg-icon :icon-class="getIconName(item.fileName)"
                                class-name="!w-[32px] !h-[32px]"></svg-icon><span
                                class="w-[80%] overflow-box"
                                :title="item.fileName">{{ item.fileName }}</span></span>
                        <span class="text-[#5F646C] shrink-0" style="flex:1">{{ parseTime(item.uploadTime) }}</span>
                        <TranslationButton v-if="scene === 'literature-read-translate'" :item="item" />
                        <span class="hover-show text-[#3662FF] shrink-0 w-[60px] text-center cursor-pointer"
                            @click.stop="handleDelete(item)"><i
                                class="el-icon-delete text-[#FF5656] text-[20px]"></i></span>
                    </div>
                </div>
            </div>
            <div class="w-full mt-[45px]">
                <pagination v-show="total > params.pageSize" :total="total" :page.sync="params.pageNum"
                    :limit.sync="params.pageSize" @pagination="getAllFileList" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { getUploadHistory } from "@/api/custom/docReader";
import { getIconName } from "@/utils/file";
import { sceneUploadDelete } from "@/api/custom/file";
import TranslationButton from "./translationButton.vue"
export default {
    name: 'UploadHistoryDialog',
    components: {
        TranslationButton
    },
    props: {
        detail: {
            type: Object,
            default: () => { },
        }
    },
    data() {
        return {
            visible: false,
            params: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            allFileList: [],
            translationQueue: [], //翻译队列
            highlightItem: null, // 高亮项
        }
    },
    computed: {
        scene() {
            return this.$store.state.history.scene
        }
    },
    mounted() {
        if(this.detail.taskId) {
        }
    },
    methods: {
        getAllFileList() {
            getUploadHistory(this.params).then(res => {
                if(res.code === 200) {
                    this.allFileList = res.data.records
                    this.total = res.data.total
                }
            })
        },
        async handleFileClick(item) {
            if(this.scene == 'literature-read-translate' && item.status !== 'COMPLETED') {
                return
            }
            this.visible = false
            this.$emit('fileClick', {...item, source: 'CHAT_UPLOAD'})
        },
        showUploadHistory() {
            this.visible = true
            this.params.pageNum = 1
            this.getAllFileList()
            if(this.detail.taskId) {
                this.highlightItem = this.detail
            }
        },
        closeUploadHistory() {
            this.visible = false
        },
        handleDelete(item) {
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sceneUploadDelete(item.id).then(res => {
                    if (res.code == 200) {
                        this.getAllFileList();
                    }
                })
            })
        },
        getIconName(url) {
            return getIconName(url)
        },
        mouseEnterRow(item) {
            if(!this.highlightItem) return
            if(item.taskId == this.highlightItem.taskId) {
                this.highlightItem = null
            }
        },
    }
}
</script>

<style scoped lang="scss">
.file-item {
    flex: 1;
    max-height: 56px;
}

::v-deep {
    .el-dialog {
        border-radius: 8px;
        height: 90%;
    }
    .el-dialog__header {
        height: 48px;
        padding: 14px 24px;
    }
    .el-dialog__title {
        font-size: 16px;
        line-height: 20px;
        font-weight: 700;
    }
    .el-dialog__body {
        padding: 16px 24px;
        height: calc(100% - 48px);
        width: 100%;
    }
    }

        .hover-show {
            opacity: 0;
        }
    
        .file-item:hover .hover-show {
            opacity: 1;
        }
    
</style>