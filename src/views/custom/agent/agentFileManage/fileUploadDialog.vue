<template>
    <el-dialog :visible.sync="visible" :show-close="false" width="450px" class="upload-dialog">
        <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
            <span class="text-[#1D2129] text-[16px] font-bold">批量上传</span>
            <div class="cursor-pointer" @click="handleCancel">
                <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]" />
            </div>
        </div>
        <div v-if="visible" class="w-full flex flex-col gap-[24px]">
            <div class="flex items-center gap-[6px]">
                <svg-icon icon-class="folder" class-name="!w-[36px] !h-[36px]" />
                <Treeselect ref="treeSelectRef" class="w-[500px]" :currentFolder="currentFolder"
                    :disabled="uploadFileList.length > 0" @selectedFoldersChange="selectedFoldersChange" />
            </div>

            <FileUpload v-if="selectedFolder.dataId" ref="fileUpload" v-model="uploadFileList" :is-show-tip="false"
                class="w-full flex flex-col gap-[16px] h-[500px] overflow-y-auto" :class="[{ isUpload: uploadFileList.length }]" :limit="20"
                :file-size="100" :file-type="['pdf', 'docx', 'doc', 'xlsx', 'txt']" url='/agent/sop/file/upload' :data="{ meta: meta }"
                del-confirm-text="将清除上传记录且彻底删除该文件">
                <div class="upload-border w-full">
                    <div class="w-full bg-white p-[24px] rounded-[7px] flex flex-col justify-center items-center"
                        :style="`height: ${uploadFileList.length ? '120px' : '100%'}`">
                        <img src="@/assets/images/file-upload.png" class="w-[30px]">
                        <span class="text-[14px] leading-[18px] mt-[8px] mb-[2px]">批量上传</span>
                        <div class="text-[#C9CDD4] px-[32px] text-[12px] leading-[18px]">
                            可上传pdf、docx、doc、xlsx、txt文件,每个文件不超过100MB,每次上传数量不超过20个</div>
                    </div>
                </div>
            </FileUpload>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleCancel">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Treeselect from './treeSelect.vue';

export default {
    name: 'FileUploadDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        currentFolder: {
            type: Object,
            default: {}
        }
    },
    components: {
        Treeselect
    },
    data() {
        return {
            selectedFolder: {},
            uploadFileList: [],
            fileLoading: false,
        }
    },
    computed: {
        meta() {
            return new Blob([JSON.stringify({ parentId: this.selectedFolder.dataId || this.currentFolder.dataId || 0, fileTag: '检验记录' })], { type: 'application/json' })
        }
    },
    mounted() {
    },
    methods: {
        selectedFoldersChange(selectedFolder) {
            this.selectedFolder = selectedFolder;
        },
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.dataId,
                label: node.name,
                children: node.children
            };
        },
        handleCancel() {
            this.selectedFolder = {};
            this.uploadFileList = [];
            this.$emit('onCancel')
        }
    }
}
</script>

<style scoped lang="scss">
.upload-border {
    background: linear-gradient(180deg, #9BCCFF, #D1A6FF, #9799FF);
    border-radius: 8px;
    padding: 1px;
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
            padding: 0;

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
</style>