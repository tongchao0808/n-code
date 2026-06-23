<template>
    <div class="w-full h-full flex flex-col">

        <header
            class="header-search h-[64px] w-full flex justify-between items-center gap-[124px] pl-[436px] mt-[24px] mb-[24px]">
            <!-- 搜索框 -->
            <div
                class="flex-1 h-full bg-white rounded-[12px] px-[16px] py-[8px] flex items-center justify-between gap-[24px]">
                <el-input v-model="inputValue" placeholder="例如：产品检验流程、文件变更管理..." clearable
                    class="flex-1 border-[#00000000]" />
                <div @click="handleSearch"
                    class="w-[120px] h-[48px] bg-[#3662FF] text-[#fff] text-[14px] leading-[24px] rounded-[8px] flex items-center justify-center cursor-pointer">
                    搜索</div>
            </div>

            <!-- 排列方式 -->
            <div class="flex items-center justify-end">
                <el-dropdown @command="handleCommand" placement="bottom-start">
                    <span class="el-dropdown-link hover:text-[#3662FF]">
                        {{ orderLabel }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="">无</el-dropdown-item>
                        <el-dropdown-item v-for="item in orderList" :key="item.value" :command="item.value">{{
                            item.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <i @click="onSortOrderClick" :class="{ 'rotate-180': queryParams.sortOrder == 'desc' }"
                    class="el-icon-arrow-down flex items-center justify-center w-[16px] h-[16px] ml-[4px] cursor-pointer hover:text-[#3662FF] transition-all"></i>
                <svg-icon :icon-class="orderType == 'block' ? 'fileList-block-active' : 'fileList-block'"
                    @click="orderType = 'block'" class="!w-[32px] !h-[32px] ml-[24px] cursor-pointer"></svg-icon>
                <svg-icon :icon-class="orderType == 'list' ? 'fileList-list-active' : 'fileList-list'"
                    @click="orderType = 'list'" class="!w-[32px] !h-[32px] ml-[8px] cursor-pointer"></svg-icon>
            </div>
        </header>

        <!-- 当前所属文件夹 -->
        <div class="h-[58px] flex items-center gap-[12px] py-[5px]" :class="{'h-hidden': !currentFolders.length}">
            <span class="flex items-center gap-[12px]">
                <svg-icon icon-class="right-arrow"
                    class-name="!w-[24px] !h-[24px] rotate-180 text-[#5F646C] cursor-pointer hover:text-[#3662FF] hover:scale-110"
                    @click="returnToFolder" />
                <svg-icon icon-class="folder" class-name="!w-[48px] !h-[48px]" />
            </span>
            <span v-if="currentFolders.length > 0" class="text-[16px] font-bold">{{
                currentFolders[(currentFolders.length - 1)]?.name }}</span>
        </div>

        <!-- 文件上传和新建文件夹按钮 -->
        <div class="h-[48px] w-full flex mb-[16px]">
            <el-button type="primary" class="rounded-[8px]" icon="el-icon-upload2"
                @click="uploadVisible = true">批量上传</el-button>
            <el-button type="primary" class="rounded-[8px]" icon="el-icon-circle-plus"
                @click="createFolder">新建文件夹</el-button>
        </div>

        <!-- 文件列表 -->
        <main class="fileList-box flex-1 w-full rounded-[16px] p-[16px] mb-[24px] overflow-hidden">
            <FileList ref="fileListRef" :queryParams="queryParams" :orderType="orderType" :currentFolders="currentFolders"
                @currentFoldersChange="currentFoldersChange" />
        </main>
        <FileUploadDialog ref="fileUploadDialogRef" :visible.sync="uploadVisible" @onCancel="handleDialogCancel"
            :currentFolder="currentFolders.length ? (currentFolders[(currentFolders.length - 1)]) : {}" />
    </div>
</template>

<script>
import FileList from './fileList.vue'
import FileUploadDialog from './fileUploadDialog.vue'
export default {
    name: 'AgentFileManage',
    components: {
        FileList,
        FileUploadDialog
    },
    data() {
        const orderList = [
            {
                label: '文件名',
                value: 'fileName'
            },
            {
                label: '解析状态',
                value: 'parseStatus'
            },
            {
                label: '文件类型',
                value: 'fileType'
            },
            {
                label: '创建时间',
                value: 'createTime'
            },
        ]
        return {
            meta: new Blob([JSON.stringify({ fileType: '检验记录' })], { type: 'application/json' }),
            uploadFileList: [],
            inputValue: '',
            orderList: orderList,
            orderType: 'block',
            queryParams: {
                keyword: '',
                sortBy: '',
                sortOrder: 'asc',
                parentId: ""
            },
            currentFolders: [],
            uploadVisible: false
        }
    },
    computed: {
        orderLabel() {
            return this.orderList.find(item => item.value == this.queryParams.sortBy)?.label || '排序'
        }
    },
    methods: {
        // 刷新列表。notReturnToHome：不清空当前文件夹层级
        getList(notReturnToHome) {
            !notReturnToHome && this.currentFoldersChange([])
            this.$refs.fileListRef.refreshList()
        },
        handleSearch() {
            this.queryParams.keyword = this.inputValue
            this.getList()
        },
        handleCommand(command) {
            this.queryParams.sortBy = command
            this.getList()
        },
        onSortOrderClick() {
            this.queryParams.sortOrder = this.queryParams.sortOrder == 'asc' ? 'desc' : 'asc'
            this.getList(true)
        },
        returnToFolder() {
            this.$refs.fileListRef.returnToParent()
        },
        createFolder() {
            this.$refs.fileListRef.addNewFolder()
        },
        currentFoldersChange(currentFolders) {
            this.currentFolders = currentFolders
            this.queryParams.parentId = currentFolders.length ? (currentFolders[(currentFolders.length - 1)].dataId || "") : ""
        },
        handleDialogCancel() {
            this.uploadVisible = false
            this.$refs.fileListRef.refreshList()
        },
    }
}
</script>

<style scoped lang="scss">
.aside-upload {
    padding: 16px;
    background: linear-gradient(180deg, #C1D4FF, #F4EAFF);

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
}

.header-search {
    ::v-deep {
        .el-input__inner {
            border: none;
        }
    }
}

.fileList-box {
    background: linear-gradient(180deg, rgba(193, 212, 255, 0.5), rgba(244, 234, 255, 0.5));
}

.my-breadcrumb-box {
    position: relative;

    .my-breadcrumb {
        line-height: 16px;
        position: absolute;
        left: 0;
        top: 0;
    }
}

::v-deep.el-popper {
    .popper__arrow {
        display: none;
    }
}

::v-deep.el-dropdown-menu--medium {
    padding: 8px;

    .el-dropdown-menu__item {
        font-size: 14px;
        line-height: 24px;
        padding: 8px 16px;
        border-radius: 4px;
        font-family: "Microsoft YaHei UI";


        &:not(.is-disabled):hover {
            background-color: #F5F8FF;
            color: #3662FF;
        }
    }
}

::v-deep.el-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 3px 7px 0 rgba(156, 163, 175, 0.25);
}

.upload-dialog {
    ::v-deep {
        .el-dialog {
            border-radius: 16px;
        }

        .el-dialog__title {
            font-size: 14px;
            font-weight: bold;
        }

        .el-dialog__body {
            padding: 24px;
        }

        .el-select {
            .el-input--medium .el-input__inner {
                height: 48px;
            }
        }
    }
}

.h-hidden {
    height: 0;
    overflow: hidden;
    transition: height .3s ease;
    margin: 0;
    align-items: flex-start;
}
</style>