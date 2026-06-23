<template>
    <div class="voice-recognition w-full h-full flex flex-col gap-[26px] relative">
        <header class="voice-header">
            <!-- 标题和上传记录 -->
            <div class="w-full h-[78px] flex justify-between items-center px-[32px] bg-gradient-to-b from-[#EEF6FD] to-[#FFFFFF00]">
                <span class="text-[24px] font-bold leading-[30px] text-[#1D2129]">语音识别</span>
            </div>
            <!-- 上传按钮和搜索框 -->
            <div class="w-full h-[40px] flex justify-between items-center px-[32px]">
                <el-button type="primary" class="h-[40px] w-[228px] rounded-[8px]" @click="handleUpload">
                    <div class="w-full flex items-center justify-center gap-[6px]"><svg-icon icon-class="file-add"
                            class-name="!w-[20px] !h-[20px]"></svg-icon><span>上传</span></div>
                </el-button>
                <div class="flex gap-[8px] items-center">
                    <i class="el-icon-refresh-right text-[20px] text-[#959BA1] cursor-pointer mr-[20px] hover:text-[#777]" @click="getList" title="刷新列表"></i>
                    <el-input placeholder="请输入搜索关键字" class="h-[40px]" v-model="params.keyword" clearable
                        @keyup.enter="handleSearch" @clear="handleSearch"></el-input>
                    <el-button type="primary" class="h-[40px]" @click="handleSearch">搜索</el-button>
                </div>
            </div>
        </header>
        <!-- 表格 -->
        <content class="w-full flex-1 flex flex-col overflow-hidden">
            <div class="w-full flex-1 overflow-hidden">
                <BasicTable :data-list="fileList" :loading="isLoading" :selection-change="handleSelected"
                    height="100%" :header-cell-style="headerCellStyle" :row-style="{ height: '80px' }"
                    @cell-mouse-enter="handleRowMouseEnter" @cell-mouse-leave="handleRowMouseLeave">
                    <div v-if="!isLoading" slot="empty" class="w-full flex items-center flex-col gap-4 pt-[60px] pb-[20px]">
                        <svg-icon icon-class="voice-empty" class-name="!w-[283px] !h-[149px]"></svg-icon>
                        <div class="text-[#959BA1] text-[16px] leading-[20px]">暂无内容</div>
                        <el-button type="primary" class="h-[40px] w-[228px] rounded-[8px]" @click="handleUpload">
                            <div class="w-full flex items-center justify-center gap-[6px]"><svg-icon
                                    icon-class="file-add" class-name="!w-[20px] !h-[20px]"></svg-icon><span>上传</span>
                            </div>
                        </el-button>
                    </div>
                    <el-table-column prop="fileName" label="文件名" align="left">
                        <template slot-scope="scope">
                            <div class="flex items-center w-full gap-2 cursor-pointer pl-[40px]"
                                @click="() => handleListClick(scope.row)">
                                <svg-icon :icon-class="scope.row.recognitionStatus == 'FINISHED' ? 'voice-file' : 'voice-writting'" class-name="!w-[60px] !h-[60px] shrink-0" />
                                <div class="flex-1 flex flex-col gap-[4px] overflow-hidden">
                                    <span class="w-full text-[#1D2129] text-[16px] leading-[22px] overflow-box" :title="scope.row.fileName">{{ scope.row.fileName }}</span>
                                    <span class="text-[12px] leading-[22px]" :class="scope.row.recognitionStatus == 'FINISHED' ? 'text-[#5F646C]' : 'text-[#FF5656]'">{{ formatStatus(scope.row) }}</span>
                                    </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="left" width="200">
                        <template slot-scope="scope">
                            {{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}
                        </template>
                    </el-table-column>
                    <el-table-column width="300" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.row.showOperationBtn"
                                class="h-[42px] w-[180px] flex flex-row items-center justify-between p-1 rounded-lg bg-[#E8EFFF] mr-auto gap-x-2">
                                <div class="h-[34px] p-2 rounded-lg text-[#3662FF] text-[14px] flex items-center op-item cursor-pointer"
                                    @click.stop="() => handleRename(scope.row)">
                                    <svg-icon icon-class="base-op-text" class-name="!w-[18px] !h-[18px] mr-2" />
                                    重命名
                                </div>
                                <div class="h-[34px] p-2 rounded-lg text-[#3662FF] text-[14px] flex items-center op-item cursor-pointer"
                                    @click.stop="() => openDeleteDialog(scope.row)">
                                    <svg-icon icon-class="base-op-delete" class-name="!w-[18px] !h-[18px] mr-2" />
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </BasicTable>
            </div>

            <div class="w-full flex justify-end">
                <pagination v-show="total > 0" :total="total" :page.sync="params.page" :limit.sync="params.pageSize"
                    @pagination="getList"/>
            </div>
        </content>
        <UploadFileDialog :show="uploadFileDialogShow" :onCancel="() => { uploadFileDialogShow = false }" @complete="getList" @success="uploadSuccess" />
        <UploadHistory v-if="uploadHistoryShow" :onCancel="() => { uploadHistoryShow = false }" />
            <FileDetail v-if="fileDetailShow" :detailId="currentRow.id" @onCancel="closeFileDetail" />
            <RenameDialog :show="showRenameDialog"
                  :on-ok="doRename"
                  :on-cancel="() => { showRenameDialog = false }"
                  :record="currentRow"
                  titleProperty="fileName"/>
    </div>
</template>

<script>
import { getAudioList, renameFile, deleteAudio } from "@/api/custom/voiceRecognition";
import BasicTable from '@/components/custom/table/BasicTable.vue'
import UploadFileDialog from './uploadFileDialog.vue'
import UploadHistory from './uploadHistory.vue'
import FileDetail from './fileDetail.vue'
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import goPageHome from '@/components/mixins/goPageHome.js'

export default {
    name: 'VoiceRecognition',
    components: {
        BasicTable,
        UploadFileDialog,
        UploadHistory,
        FileDetail,
        RenameDialog,
    },
    mixins: [goPageHome],
    data() {
        const headerCellStyle = {
            'background-color': '#FFF',
            'color': '#959BA1',
            'font-size': '16px',
            'font-weight': '400',
            'text-align': 'center',
        }
        return {
            fileList: [],
            isLoading: false,
            headerCellStyle,
            total: 0,
            params: {
                keyword: '',
                page: 1,
                pageSize: 10,
            },
            currentRow: {},
            uploadFileDialogShow: false,
            uploadHistoryShow: false,
            fileDetailShow: false,
            showRenameDialog: false,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        handleGoPageHome() {
            this.getList()
        },
        getList() {
            this.isLoading = true
            const sortParams = {
                sortField: 'create_time',
                sortOrder: 'desc',
            }
            getAudioList({...this.params, ...sortParams}).then(res => {
                if (res.code === 200) {
                    this.fileList = res.data.records || []
                    this.total = res.data.total || 0
                }
                this.isLoading = false
            })
        },
        handleRowMouseEnter(row) {
            this.$set(row, 'showOperationBtn', true)
        },
        handleRowMouseLeave(row) {
            this.$set(row, 'showOperationBtn', false)
        },
        handleRename(row) {
            this.currentRow = row
            this.showRenameDialog = true
        },
        handleSearch() {
            console.log(this.params.keyword)
            this.params.page = 1
            this.getList()
        },
        handleUpload() {
            this.uploadFileDialogShow = true
        },
        handleSelected(selection) {
            console.log(selection)
        },
        handleListClick(row) {
            if (row.recognitionStatus != 'FINISHED') {
                this.$message.warning('只能查看转写成功的文件')
                return
            }
            console.log(row)
            this.fileDetailShow = true
            this.currentRow = row
        },
        openDeleteDialog(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAudio(row.id).then(res => {
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getList()
                    }
                })
            })
        },
        formatStatus(row) {
            if (row.recognitionStatus === 'FINISHED') {
                return '已转写'
            } else if (row.recognitionStatus === 'CREATED') {
                return '开始转写...'
            } else if (row.recognitionStatus === 'PROCESSING') {
                return '转写中...'+row.recognitionValue+'%'
            } else if (row.recognitionStatus === 'FAILED') {
                return '转写失败'
            }
        },
        doRename(row, title) {
            renameFile({
                fileId: this.currentRow.id,
                newName: title,
            }).then(res => {
                if (res.code === 200) {
                    this.showRenameDialog = false
                    this.getList()
                }
            })
        },
        uploadSuccess() {
            setTimeout(() => {
                this.$message.success('文件上传完毕');
                this.uploadFileDialogShow = false
            }, 3000)
        },
        closeFileDetail() {
            this.fileDetailShow = false
            this.currentRow = {}
            this.getList()
        },
    }
}
</script>

<style scoped lang="scss">
.voice-recognition {
    .voice-header {
        ::v-deep {
        .el-input--medium .el-input__inner {
            height: 100%;
            min-height: 40px;
        }
    }
    }
}

</style>