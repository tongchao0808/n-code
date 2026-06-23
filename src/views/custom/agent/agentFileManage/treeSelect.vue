<template>
    <div class="popover-wrap" @click.stop="handleInputClick" :class="{ visible: popoverVisible, 'disabled': disabled }">
        <div class="text-[12px] text-[#1D2129]">
            <span v-if="selectedId == 0">请选择文件夹</span>
            <span v-else>{{ selectedNode.name }}</span>

        </div>
        <el-popover placement="bottom" trigger="manual" v-model="popoverVisible" @show="handlePopoverShow"
            @hide="handlePopoverHide" ref="popover" popper-class="top-[32px] left-0 right-0">
            <el-tree ref="tree" :data="treeData" node-key="dataId" :default-expand-all="true" :props="defaultProps"
                @node-click="handleNodeClick" class="w-full custom-tree" icon-class="el-icon-arrow-right">
                <span class="flex justify-between w-full custom-tree-node" slot-scope="{ node, data }">
                    <span class="text-[#1D2129] text-[14px] flex items-center"><svg-icon icon-class="folder" class-name="!w-[20px] !h-[20px] mr-[8px]" />{{ node.label }}</span>
                </span>
            </el-tree>
        </el-popover>
    </div>
</template>

<script>
import { getAgentFileList } from '@/api/custom/agentFileManage'
export default {
    name: 'treeSelect',
    props: {
        currentFolder: {
            type: Object,
            default: {}
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            popoverVisible: false,
            treeData: [],
            selectedId: 0,
            selectedNode: {},
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted() {
        this.selectedNode = this.currentFolder
        this.selectedId = this.currentFolder.dataId || 0
        this.$emit("selectedFoldersChange", this.currentFolder)
        this.getList()
    },
    beforeDestroy() {
        // 组件销毁前确保移除事件监听
        document.removeEventListener("click", this.handleDocumentClick);
    },
    methods: {
        closePopover() {
            this.popoverVisible = false;
        },
        handleInputClick() {
            if (this.disabled) {
                return
            }
            this.popoverVisible = !this.popoverVisible
        },
        handleNodeClick(data, node, e) {
            this.selectedId = data.dataId
            this.selectedNode = data
            this.$emit("selectedFoldersChange", data)
            this.closePopover()
        },
        getList() {
            let data = {
                pageNum: 1,
                pageSize: 1000,
                parentId: ""
            }
            getAgentFileList(data).then(res => {
                let fileList = res.data.records
                this.treeData = this.filterFolders(fileList)
            })
        },
        filterFolders(items) {
            if (!Array.isArray(items)) {
                return [];
            }
            // 过滤当前层级的对象，只保留fileType为'folder'的
            return items.filter(item => {
                return item && item.fileType === 'folder';
            }).map(folder => {
                // 递归处理每个folder的children（如果存在）
                const children = folder.children ? this.filterFolders(folder.children) : [];
                // 返回新对象，避免修改原对象
                return {
                    ...folder,
                    children: children
                };
            });
        },
        handlePopoverShow() {
            // Popover 显示时添加全局点击监听
            this.$nextTick(() => {
                document.addEventListener("click", this.handleDocumentClick);
            });
        },

        handlePopoverHide() {
            // Popover 隐藏时移除全局点击监听
            document.removeEventListener("click", this.handleDocumentClick);
            // 选择关闭
            // console.log("选择关闭", this.cacheSelect);
            this.$emit("selectComplete", this.cacheSelect);
        },
        handleDocumentClick(event) {
            try {
                // 确保所有引用都存在
                const popoverEl = this.$refs.popover ? this.$refs.popover.$el : "";
                const triggerEl = this.$refs.trigger ? this.$refs.trigger.$el : "";

                if (!popoverEl || !triggerEl) {
                    this.closePopover();
                    return;
                }

                // 检查点击位置
                const isClickInside =
                    popoverEl.contains(event.target) || triggerEl.contains(event.target);

                if (!isClickInside) {
                    this.closePopover();
                }
            } catch (error) {
                console.error("Error handling document click:", error);
                document.removeEventListener("click", this.handleDocumentClick);
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.popover-wrap {
    border-radius: 8px;
    background: #f7f8fa;
    min-height: 32px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    position: relative;
    
    &.disabled {
        cursor: not-allowed;
        background-color: #f0f0f0;
        opacity: 0.6;
    }

    &::after {
        content: "";
        top: 50%;
        right: 8px;
        transform: translateY(-6px);
        position: absolute;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-left-color: #5f646c;
        transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
    }

    &.visible::after {
        transform: rotate(90deg);
    }
}

.custom-tree {
    .is-pro {
        background: linear-gradient(135deg, #3397FFFF, #5F9CFFFF, #AB5CFFFF);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        display: flex;
        align-items: center;

        &::after {
            content: 'PRO';
            font-size: 10px;
            line-height: 12px;
            width: 28px;
            height: 15px;
            margin-left: 4px;
            border-radius: 8px 2px 8px 2px;
            padding: 2px 4px;
            background-clip: border-box;
            -webkit-text-fill-color: #fff;
            background: linear-gradient(135deg, #9BCCFF, #D1A6FF, #9799FF);
        }
    }

    ::v-deep .el-checkbox__inner {
        width: 16px;
        height: 16px;
        border-radius: 4px;
    }

    ::v-deep .el-tree-node__content {
        position: relative;
        height: 38px;
        line-height: 38px;

        // padding: 0 8px;
        &:hover {
            border-radius: 8px;
            background: #f7f8fa;
        }

        .el-tree-node__expand-icon {
            position: absolute;
            font-size: 22px;
            color: #5f646c;
            right: 8px;
            // top: 50%;
            // transform: translateY(-50%);
            // margin-top: -50%;
            transform: rotate(0);
            transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;

            // transform-origin: top;
            &.expanded {
                transform: rotate(90deg);
            }

            &.is-leaf {
                font-size: 0;
            }
        }
    }
}
</style>
