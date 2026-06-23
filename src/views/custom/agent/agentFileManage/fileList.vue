<template>
    <div class="w-full h-full flex flex-col gap-[8px]">
        <div class="flex justify-between text-[#1D2129] text-[16px] leading-[32px] font-bold">
            <span class="">{{ `文件列表 (${total})` }}</span>
        </div>
        <!-- 堆叠排布 -->
            <div v-if="orderType == 'block' && fileList.length" class="block-files-box flex-1 overflow-y-auto grid content-start gap-[16px] grid-cols-5 pr-[10px]"
                v-infinite-scroll="scrollBottom" :infinite-scroll-disabled="disabled" infinite-scroll-distance="0" v-loading="isLoading">
                <div v-for="item in fileList" :key="item.dataId"
                    class="max-h-[160px] p-[16px] flex flex-col gap-[12px] bg-white rounded-[8px]">
                    <div class="flex justify-between">
                        <div class="h-[48px] flex-1 flex gap-[8px] items-center overflow-hidden">
                            <svg-icon :icon-class="item.fileType == 'folder' ? 'folder' : 'file-rainbow'"
                                class-name="!w-[48px] !h-[48px]" />
                            <div class="flex-1 flex flex-col items-start gap-[4px] overflow-hidden">
                                <el-input v-if="item.new" ref="newFolderInput" v-model="item.name"
                                    @blur="createFolder(item)" @keyup.enter.native="createFolder(item)" />
                                <span v-else
                                    :class="item.fileType == 'folder' ? 'cursor-pointer hover:text-[#3662FF]' : ''"
                                    @click="handleFolderClick(item)"
                                    class="w-full text-[#1D2129] text-[14px] leading-[24px] overflow-box">{{
                                        item.name }}</span>
                                <div v-if="item.fileType == 'file'"
                                    class="flex items-center gap-[16px] text-[10px] leading-[16px]">
                                    <span class="text-[#3662FF] px-[8px] py-[2px] rounded-[4px] bg-[#E8EFFF]">{{
                                        item.fileTag }}</span>
                                    <span class="flex items-center">
                                        <svg-icon v-if="item.parseStatus == 'success'" icon-class="success-icon"
                                            class-name="!w-[16px] !h-[16px] text-[#6DD401]"></svg-icon>
                                        <svg-icon v-else-if="item.parseStatus == 'failed'" icon-class="close-area"
                                            class-name="!w-[16px] !h-[16px] text-[#FF5656]"></svg-icon>
                                        <span class="ml-[4px]" v-html="formatStatus(item.parseStatus)"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Dropdown :doc="item" :refresh-list="getList" />
                    </div>

                    <div class="flex justify-between px-[8px] text-[#959BA1] text-[12px] leading-[20px]">
                        <div class="flex-1 overflow-box">{{
                            formatDate(item.createTime) }}</div>
                        <div v-if="item.fileType == 'file'" class="flex gap-[16px]">
                            <router-link v-if="['docx', 'xlsx'].includes(getFileType(item.filePublicUrl))"
                                :to="`/filePreview/${encodeURIComponent(item.filePublicUrl)}`" target="_blank"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="preview-open" class="!w-[16px] !h-[16px]"></svg-icon>预览</router-link>
                            <a v-else :href="item.filePublicUrl" target="_blank"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="preview-open" class="!w-[16px] !h-[16px]"></svg-icon>预览</a>
                            <div @click="downloadFile(item.filePublicUrl, item.name)"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="download1" class="!w-[16px] !h-[16px]"></svg-icon>下载</div>
                        </div>
                    </div>
                </div>
        </div>

        <!-- 列表排布 -->
        <div v-if="orderType == 'list' && fileList.length" class="list-files-box flex-1">
            <el-table :data="fileList" v-loading="isLoading" class="rounded-[8px]" height="550px"
                :header-cell-style="headerCellStyle" @scroll="handleTableScroll">
                <el-table-column prop="name" label="名称">
                    <template slot-scope="scope">
                        <div class="flex items-center w-full gap-[6px]">
                            <svg-icon :icon-class="scope.row.fileType == 'folder' ? 'folder' : 'file-rainbow'"
                                class-name="!w-[20px] !h-[20px] ml-[6px]" />
                            <el-input v-if="scope.row.new" ref="newFolderInput" v-model="scope.row.name"
                                @blur="createFolder(scope.row)" @keyup.enter.native="createFolder(scope.row)" />
                            <div v-else
                                class="text-[#1D2129] text-[14px] leading-[24px] overflow-box"
                                :class="scope.row.fileType == 'folder' ? 'cursor-pointer hover:text-[#3662FF]' : ''"
                                @click="handleFolderClick(scope.row)">{{ scope.row.name }}</div>
                            <span v-if="scope.row.fileType == 'file'"
                                class="text-[#3662FF] text-[10px] leading-[16px] px-[8px] py-[2px] rounded-[4px] bg-[#E8EFFF]">{{
                                    scope.row.fileTag }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="parseStatus" label="状态" width="160">
                    <template slot-scope="scope">
                        <svg-icon v-if="scope.row.parseStatus == 'success'" icon-class="success-icon"
                            class-name="!w-[16px] !h-[16px] text-[#6DD401]"></svg-icon>
                        <svg-icon v-else-if="scope.row.parseStatus == 'failed'" icon-class="close-area"
                            class-name="!w-[16px] !h-[16px] text-[#FF5656]"></svg-icon>
                        <span class="ml-[8px]" v-html="formatStatus(scope.row.parseStatus, 'text')"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="上传时间" width="160">
                    <template slot-scope="scope">{{ formatDate(scope.row.createTime) }}</template>

                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <div class="flex gap-[16px]">
                             <router-link v-if="['docx', 'xlsx'].includes(getFileType(scope.row.filePublicUrl))"
                                :to="`/filePreview/${encodeURIComponent(scope.row.filePublicUrl)}`" target="_blank"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="preview-open" class="!w-[16px] !h-[16px]"></svg-icon>预览</router-link>
                            <a v-else :href="scope.row.filePublicUrl" target="_blank"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="preview-open" class="!w-[16px] !h-[16px]"></svg-icon>预览</a>
                            <div @click="downloadFile(scope.row.filePublicUrl, scope.row.name)"
                                class="flex items-center gap-[4px] cursor-pointer hover:text-[#3662FF]"><svg-icon
                                    icon-class="download1" class="!w-[16px] !h-[16px]"></svg-icon>下载</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100">
                    <template slot-scope="scope">
                        <div class="flex items-center justify-start w-full gap-2">
                            <Dropdown :doc="scope.row" :refresh-list="getList" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="!fileList.length" class="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
            <img src="@/assets/images/file-empty.png" class="w-[40%]" alt>
            <span class="text-[18px]">还没有文件，请上传</span>
        </div>
    </div>
</template>

<script>
import BasicTable from '@/components/custom/table/BasicTable.vue'
import Dropdown from './dorpDown.vue'
import { getAgentFileList, createFolder, getFolderFileList } from '@/api/custom/agentFileManage'
import { formatDate } from '@/utils/index'
import { downloadGet } from '@/utils/request'

export default {
    name: 'FileList',
    components: {
        BasicTable,
        Dropdown
    },
    props: {
        queryParams: {
            type: Object,
            default: () => ({})
        },
        orderType: {
            type: String,
            default: 'block'
        },
        currentFolders: {
            type: Array,
            default: () => []
        },
    },
    data() {
        const headerCellStyle = {
            'background-color': '#F2F3F5',
            'color': '#1D2129',
            'font-size': '16px',
            'font-weight': '400',
            'text-align': 'left',
            'padding': '10px 6px',
            'height': '60px'
        }
        return {
            headerCellStyle,
            total: 0,
            fileList: [],
            isLoading: false,
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    },
    computed: {
        noMore() {
            return this.fileList.length >= this.total
        },
        disabled() {
            console.log(this.isLoading || this.noMore);
            
            return this.isLoading || this.noMore
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList(params = {}) {
            const {append = undefined, noKeyWord = undefined} = params
            console.log('queryParams', this.queryParams);
            this.isLoading = true
            let data = {
                ...this.queryParams,
                ...this.page
            }
            if (noKeyWord) {
                data.keyword = ""
            }
            getAgentFileList(data).then(res => {
                if (append) {
                    this.fileList = [...this.fileList, ...res.data.records]
                } else {
                    this.fileList = res.data.records
                }
                this.total = res.data.total
                this.isLoading = false
            })
        },
        refreshList(params) {
            this.page.pageNum = 1
            this.getList(params)
        },
        getFileType(url) {
            let fileType = url.split('.').pop()
            return fileType
        },
        async createFolder(item) {
            if (item.submit) return
            item.submit = true
            let res = await createFolder({
                name: item.name,
                parentId: this.currentFolders.length ? (this.currentFolders[this.currentFolders.length - 1].dataId) : 0
            })
            if (res?.code == 200) {
                this.fileList = this.fileList.map(file => {
                    if (file.new) {
                        return {...res.data, dataId: res.data.id}
                    }
                    return file
                })
            } else {
                this.fileList = this.fileList.filter(file => !file.new)
            }
        },
        returnToParent() {
            this.$emit('currentFoldersChange', this.currentFolders.slice(0, this.currentFolders.length - 1))
            this.refreshList()
        },
        async handleFolderClick(item) {
            if (item.fileType != 'folder') {
                return
            }
            let hasFolder = this.currentFolders.some(e => e.dataId == item.dataId)
            if (!hasFolder) {
                this.$emit('currentFoldersChange', [...this.currentFolders, item])
            }
            this.refreshList({noKeyWord: true})
        },
        formatDate(time) {
            return formatDate(time)
        },
        formatStatus(status, type) {
            switch (status) {
                case 'pending':
                    if (type == 'text') return '待解析...'
                    return '<span class="text-[#3662FF]">待解析...</span>'
                    break;
                case 'parsing':
                    if (type == 'text') return '解析中...'
                    return '<span class="text-[#3662FF]">解析中...</span>'
                    break;
                case 'success':
                    if (type == 'text') return '解析完成'
                    return '<span class="text-[#6DD401]">解析完成</span>'
                    break;
                case 'failed':
                    if (type == 'text') return '解析失败'
                    return '<span class="text-[#FF5656]">解析失败</span>'
                    break;
            }
        },
        downloadFile(url, name) {
            downloadGet(url, name)
        },
        addNewFolder() {
            this.fileList.unshift({
                name: '新建文件夹',
                new: true,
                fileType: 'folder',
                id: ''
            })
            this.$nextTick(() => {
                const elInputInstance = Array.isArray(this.$refs.newFolderInput) ? this.$refs.newFolderInput[0] : this.$refs.newFolderInput
                if (elInputInstance) {
                    elInputInstance.focus()
                    const nativeInput = elInputInstance.$el.querySelector('input') || elInputInstance.$refs.input;
                    if (nativeInput) {
                        setTimeout(() => nativeInput.select(), 0);
                    }
                }
            })
        },
        scrollBottom() {
            if (this.disabled) return
            this.page.pageNum += 1
            this.getList({append: true})
        },
        handleTableScroll(event) {
            // 节流控制：防止滚动时频繁触发
            if (this.disabled) return;
            const { target } = event;
            // 滚动容器的高度
            const clientHeight = target.clientHeight;
            // 内容总高度
            const scrollHeight = target.scrollHeight;
            // 已滚动距离
            const scrollTop = target.scrollTop;
            // 当滚动到底部附近（10px内）时加载更多
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                this.scrollBottom()
            }
        }
    }
}
</script>

<style scoped lang="scss">
.list-files-box {
    width: calc(100% - 6px);
}

.bottom-text {
    width: 100%;
    font-size: 14px;
    color: #5e6d82;
    display: flex;
    justify-content: center;
}
</style>
