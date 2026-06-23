<template>
    <div class="upload-history flex flex-col">
        <el-breadcrumb class="h-[55px] pl-[32px] flex items-center border-b-[1px] border-[#F2F3F5]">
            <el-breadcrumb-item><a @click="onCancel">语音识别</a></el-breadcrumb-item>
            <el-breadcrumb-item class="font-bold">上传记录</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="h-[54px] flex items-center px-[32px]">
            <el-button class="border-0 px-[12px] py-[10px]" type="danger" plain icon="el-icon-delete"
                @click="deleteRows">清空记录</el-button>
        </div>

        <content class="w-full flex-1 flex flex-col">
            <div class="w-full flex-1">
                <BasicTable need-select :data-list="fileList" :loading="isLoading" :selection-change="handleSelected"
                    :height="600" :header-cell-style="headerCellStyle" :row-style="{ height: '80px' }"
                    @cell-mouse-enter="handleRowMouseEnter" @cell-mouse-leave="handleRowMouseLeave">
                    <div slot="empty" class="w-full flex items-center flex-col gap-4 pt-[60px] pb-[20px]">
                        <svg-icon icon-class="voice-empty" class-name="!w-[283px] !h-[149px]"></svg-icon>
                        <div class="text-[#959BA1] text-[16px] leading-[20px]">暂无内容</div>
                    </div>
                    <el-table-column prop="name" label="文件名" align="left">
                        <template slot-scope="scope">
                            <div class="flex items-center w-full gap-2">
                                <svg-icon icon-class="kg-doc" class-name="!w-[32px] !h-[32px]" />
                                <div class="text-[#1D2129] leading-[22px]">{{ scope.row.name }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="left" width="200"></el-table-column>
                    <el-table-column width="400" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.row.showOperationBtn"
                                class="h-[42px] w-[78px] flex flex-row items-center justify-between p-1 rounded-lg bg-[#E8EFFF] mr-auto gap-x-2">
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
                <pagination v-show="total > 0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
                    @pagination="getList" />
            </div>
        </content>
    </div>
</template>

<script>
import BasicTable from '@/components/custom/table/BasicTable.vue'

export default {
    name: 'UploadHistory',
    components: {
        BasicTable,
    },
    props: {
        onCancel: {
            type: Function,
            default: () => { },
        },
    },
    data() {
        const headerCellStyle = {
            'background-color': '#FFF',
            'color': '#959BA1',
            'font-size': '16px',
            'font-weight': '400',
            'text-align': 'left',
        }
        return {
            isLoading: false,
            headerCellStyle,
            fileList: [],
            total: 0,
            params: {
                pageNum: 1,
                pageSize: 10,
            },
            showOperationBtn: false,
            selectedRows: [],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            let list = []
            for (let i = 0; i < 10; i++) {
                list.push({
                    id: i,
                    name: '文件' + i,
                    createTime: '2023-01-01',
                    showOperationBtn: false
                })
            }
            this.fileList = list
            this.total = 10
        },
        handleRowMouseEnter(row) {
            this.$set(row, 'showOperationBtn', true)
        },
        handleRowMouseLeave(row) {
            this.$set(row, 'showOperationBtn', false)
        },
        handleSelected(selection) {
            this.selectedRows = selection;
        },
        deleteRows() {
            this.selectedRows.forEach(row => {
                this.fileList = this.fileList.filter(item => item.id !== row.id);
            });
            this.selectedRows = [];
        },
        openDeleteDialog(row) {
        },
    }
}
</script>

<style scoped>
.upload-history {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 10;
}
</style>