<template>
    <el-dialog :key="`dialog-${fileLoading}`" class="upload-file-dialog" :class="{ 'right-bottom': fileLoading, 'dialog-less': dialogLess }" :visible="show" :show-close="false"
        :modal="!fileLoading" :width="uploadFileList.length ? '500px' : '400px'"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title"
            class="px-6 py-[14px] flex justify-between items-center border-b-[1px] border-[#E5E5E5] text-[#1D2129] text-[16px] font-bold"
            :class="`${dialogLess?(uploadComplete?'upload-success':'uploading'):''}`">
            <span v-if="fileLoading">
                <svg-icon :icon-class="uploadComplete?'success-icon':'uploading'"
                    :class-name="`!w-[18px] !h-[18px] text-[#3662FF] mr-[10px] ${uploadComplete?'':'rotate'}`"></svg-icon>
                    {{uploadComplete?'上传完成':'上传中…'}}</span>
            <span v-else>上传音视频文件</span>
            <div class="flex items-center gap-[32px]">
                <svg-icon v-if="fileLoading" @click="dialogLess = !dialogLess" icon-class="knowledge-down" :class-name="'!w-[24px] !h-[24px] cursor-pointer ' + (dialogLess ? 'rotate-180' : '')" />
                <svg-icon @click="onCancel" icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080] cursor-pointer" />
            </div>
        </div>

        <div class="w-full p-[16px]">
            <div class="w-full flex flex-col items-center border-[#C9CDD4] border-[1px] px-[8px] rounded-[8px] overflow-hidden relative"
                :class="{ 'bg-[#F2F3F588]': !uploadFileList.length }">
                <div v-if="fileLoading"
                    class="h-[46px] w-full px-[16px] border-b-[1px] border-[#E5E6EB] text-[14px] leading-[22px] flex items-center justify-between">
                    <div>
                        <span class="text-[#5F646C]">已上传 <span class="text-[#3662FF]">{{ uploadedFileCount
                        }}</span>/{{ uploadFileList.length }} 个文件:</span>
                    </div>
                    <!-- <span class="text-[#3662FF]">全部暂停</span> -->
                </div>
                <div v-else-if="uploadFileList.length"
                    class="h-[46px] w-full px-[16px] border-b-[1px] border-[#E5E6EB] text-[14px] leading-[22px] flex items-center justify-start">
                    <div>
                        <span class="text-[#5F646C]">已添加文件:</span>
                        <span class="text-[#3662FF] ml-[8px]">{{ uploadFileList.length }}</span>
                    </div>
                </div>
                <FileUpload ref="fileUpload" v-model="uploadFileList" :is-show-tip="false" :auto-upload="false"
                    :class="['w-full', 'h-full', 'flex', 'flex-col', 'max-h-[400px]', { 'isUpload': uploadFileList.length }]" :limit="20"
                    :file-size="100" :file-type="['mp3', 'm4a', 'mp4', 'avi']" url='/auxiliary/speechRecognition/upload' :data="{ meta: meta }"
                    del-confirm-text="将清除上传记录且彻底删除该文件" :upload-success="handleSuccess">
                    <div v-if="fileLoading"></div>
                    <template v-else-if="!uploadFileList.length" class="w-full">
                        <div class="w-full flex flex-col justify-center items-center py-[24px]"
                            :style="`height: ${uploadFileList.length ? '120px' : '100%'};`">
                            <img src="@/assets/images/file-upload.png" class="w-[30px]">
                            <span class="text-[14px] leading-[18px] mt-[8px] mb-[2px]">批量上传</span>
                            <div class="text-[#C9CDD4] px-[32px] text-[12px] leading-[18px]">
                                可上传mp3、m4a、mp4、avi文件,每个文件不超过100MB,每次上传数量不超过20个</div>
                        </div>
                    </template>
                    <div v-else>
                        <span
                            class="h-[0px] text-[#3662FF] text-[14px] leading-[22px] absolute right-[16px] top-[12px]">继续添加</span>
                    </div>
                </FileUpload>

            </div>
        </div>

        <div v-if="!fileLoading" slot="footer" class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]">
            <div class="w-[74px] h-[32px]">
                <SecondaryButton text="取消" @click="onCancel" />
            </div>
            <div class="w-[74px] h-[32px]">
                <PrimaryButton text="确定" @click="onOkClick" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import FileUpload from "@/components/FileUpload/index.vue"

export default {
    name: "UploadFileDialog",
    components: { PrimaryButton, SecondaryButton, FileUpload },
    props: {
        show: { type: Boolean, default: false },
        onCancel: { type: Function, default: null },
    },
    data() {
        return {
            uploadFileList: [],
            loading: false,
            meta: new Blob([JSON.stringify({ languageOption: 'AUTO_DETECT' })], { type: 'application/json' }),
            fileLoading: false,
            dialogLess: false,
        }
    },
    watch: {
        show: {
            handler: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.clearInput();
                }
            }
        }
    },
    computed: {
        uploadedFileCount() {
            return this.uploadFileList.filter(file => file.status === 'success').length;
        },
        uploadComplete() {
            if(!this.uploadFileList.length) return false;
            // 先检查是否全部上传成功，如果没有全部成功，再检查是否全部上传完成
            let isSuccess = this.uploadFileList.every(file => file.status === 'success')
            if(isSuccess) {
                this.dialogLess = true
                this.$emit('success')
                this.$emit('complete')
                return true
            }
            let isComplete = this.uploadFileList.every(file => {
                return (file.status === 'success' || file.status === 'fail' )
            });
            if(isComplete) {
                this.$emit('complete')
            }
            return isComplete;
        },
    },
    methods: {
        onOkClick() {
            if (this.uploadFileList.length === 0) {
                this.onCancel();
                return;
            }
            this.fileLoading = true;
            this.$refs.fileUpload.clearFileList();
            this.$refs.fileUpload.submit();
        },
        clearInput() {
            this.uploadFileList = [];
            this.fileLoading = false;
            this.dialogLess = false;
        },
        handleSuccess(res) {
            this.uploadFileList = [...res]
            // console.log('this.uploadFileList', JSON.stringify(this.uploadFileList));
        }
    },
}
</script>

<style scoped lang="scss">
.upload-file-dialog {
    padding: 0;

    .rotate {
        animation: rotate 2s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    ::v-deep .el-dialog {
        border-radius: 8px;
        max-height: 600px;
        transition: all .3s ease-in-out;
        overflow: hidden;
    }

    &.dialog-less {
        ::v-deep .el-dialog {
        max-height: 48px;
        width: 240px !important;
    }
    }

    ::v-deep .el-dialog__header {
        padding: 0 !important;
    }

    ::v-deep .el-dialog__body {
        padding: 0 !important;
    }

    ::v-deep .el-dialog__footer {
        padding: 0 !important;
    }

    ::v-deep {
        .el-upload {
            width: 100%;
        }

        .isUpload .upload-file-uploader {
            height: 0 !important;
        }
    }
}

.right-bottom {
    position: static !important;
    ::v-deep .el-dialog {
        position: fixed;
        top: auto !important;
        left: auto !important;
        right: 20px;
        /* 距离右边20px */
        bottom: 20px;
        /* 距离底部20px */
        margin: 0 !important;
        /* 清除默认margin */
    }
}
.upload-success {
    height: 48px;
    background: linear-gradient(134.12deg, rgba(243, 255, 217, 1),rgba(226, 249, 225, 1) 49%,rgba(208, 244, 212, 1) 100%);
}
.uploading {
    height: 48px;
    background: linear-gradient(134.12deg, rgba(237, 217, 254, 1),rgba(188, 201, 255, 1) 49%,rgba(189, 196, 255, 1) 100%);
}
</style>
