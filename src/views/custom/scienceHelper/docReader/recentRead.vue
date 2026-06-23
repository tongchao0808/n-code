<template>
    <div class="recent-box w-full h-full flex flex-col gap-[8px] bg-white rounded-[12px] px-[16px] py-[10px]">
        <div class="h-[46px] flex items-center justify-between">
            <span class="text-[14px] font-bold">{{readType == 'translation' ? '最近翻译' : '最近阅读'}}</span>
            <span class="flex items-center text-[14px] text-[#3662FF] cursor-pointer"
                @click="openAllFileDialog">查看更多<svg-icon icon-class="double-left"
                    class-name="!w-[20px] !h-[20px] ml-[6px] rotate-180"></svg-icon></span>
        </div>
        <div v-loading="loading" class="flex-1 w-full flex flex-col gap-[8px]">
            <div v-for="file in recentReadList"
                class="file-item flex items-center gap-[8px] px-[16px] rounded-[8px] hover:bg-[#F5F8FF] cursor-pointer overflow-hidden"
                @click="handleFileClick(file)">
                <svg-icon :icon-class="getIconName(file.literatureName)"
                    class-name="!w-[32px] !h-[32px]"></svg-icon>
                <span class="w-[80%] text-[16px] overflow-box">{{file.literatureName}}</span>
            </div>
            <div v-if="!recentReadList.length && !loading"
                class="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
                <img src="@/assets/images/file-empty.png" class="w-[40%]" alt>
                <span class="text-[16px] text-[#5F646C]">还没有任何记录哦，选择一篇文献开始{{readType == 'translation' ? '翻译' : '阅读'}}吧</span>
            </div>
        </div>
        <el-dialog :title="readType == 'read' || readType == '' ? '阅读记录' : '翻译记录'" :visible.sync="allFileVisible" @close="getList('recentReadList')"
            width="60%">
            <div v-loading="loading" class="w-full h-full flex flex-col border-[1px] border-[#E5E6EB] rounded-[8px]">
                <div class="flex-1 w-full flex flex-col gap-[8px] px-[8px] overflow-hidden">
                    <div class="w-full h-[52px] px-[16px] flex items-center border-b-[1px] border-[#E5E6EB]">
                        <span class="pl-[24px] shrink-0" style="flex:2">文章标题</span>
                        <span class="shrink-0" style="flex:1">上次阅读时间</span>
                        <span class="shrink-0 w-[60px]"></span>
                    </div>
                    <div class="flex-1 w-full flex flex-col gap-[8px] overflow-y-auto">
                        <div v-for="item in allFileList"
                            class="file-item w-full px-[16px] flex items-center text-[16px] rounded-[8px] hover:bg-[#F5F8FF] cursor-pointer"
                            @click="handleFileClick(item)">
                            <span class="flex items-center gap-[8px] text-[#1D2129] overflow-hidden shrink-0"
                                style="flex:2"><svg-icon :icon-class="getIconName(item.literatureName)"
                                    class-name="!w-[32px] !h-[32px]"></svg-icon><span
                                    class="w-[80%] overflow-box">{{ item.literatureName }}</span></span>
                            <span class="text-[#5F646C] shrink-0" style="flex:1">{{ parseTime(item.accessTime) }}</span>
                            <span class="hover-show text-[#3662FF] shrink-0 w-[60px] text-center cursor-pointer"
                                @click.stop="handleDelete(item)"><i class="el-icon-delete text-[#FF5656] text-[20px]"></i></span>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-[45px]">
                    <pagination v-show="total > params.pageSize" :total="total" :page.sync="params.pageNum"
                        :limit.sync="params.pageSize" @pagination="getList('allFileList')" />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getReadHistory, deleteReadHistory } from '@/api/custom/docReader';
import { getIconName } from "@/utils/file";
export default {
    name: 'recentRead',
    props: {
        readType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            recentReadList: [],
            allFileVisible: false,
            allFileList: [],
            loading: false,
            total: 0,
            params: {
                pageNum: 1,
                pageSize: 10
            }
        }
    },
    created() {
        this.getList('recentReadList')
    },
    computed: {
        scene() {
            return this.$store.state.history.scene;
        }
    },
    watch: {
        scene(newVal, oldVal) {
            if(newVal != oldVal) {
                this.getList('recentReadList')
            }
        }
    },
    methods: {
        getList(type) {
            this.loading = true
            if (type == 'recentReadList') {
                this.params.pageNum = 1
                this.params.pageSize = 10
            }
            getReadHistory(this.params).then(res => {
                if (res.code == 200) {
                    this.loading = false
                    this[type] = res.data.records || []
                    this.total = res.data.total || 0
                }
            })
        },
        openAllFileDialog() {
            this.allFileVisible = true
            this.getList('allFileList')
        },
        handleFileClick(file) {
            this.allFileVisible = false
            this.$emit('fileClick', file)
        },
        handleDelete(item) {
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteReadHistory(item.sessionUniqueId).then(res => {
                    if (res.code == 200) {
                        this.getList('allFileList')
                    }
                })
            })
        },
        getIconName(url) {
            return getIconName(url)
        }
    }
}
</script>

<style scoped lang="scss">
.file-item {
    flex: 1;
    max-height: 56px;
}

.recent-box {
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
}

.hover-show {
    opacity: 0;
}

.file-item:hover .hover-show {
    opacity: 1;
}
</style>
