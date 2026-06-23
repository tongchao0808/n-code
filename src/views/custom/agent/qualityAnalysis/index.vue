<template>
    <div class="w-full h-full flex flex-col justify-center">
        <div class="h-[55px] flex items-center pl-[24px]">
        <el-breadcrumb>
            <el-breadcrumb-item><a @click="$router.push('/agent/qualityAnalysisList')">质量分析</a></el-breadcrumb-item>
            <el-breadcrumb-item>当前页面</el-breadcrumb-item>
        </el-breadcrumb>
        </div>
        <div v-loading="analysisLoading" class="w-full flex-1 flex gap-[16px]">
            <div class="linear-bg flex-1 h-full p-[24px] flex flex-col gap-[16px]">
                <div class="text-[18px] leading-[32px]">上传质控文件</div>
                <div class="upload flex-1 overflow-hidden" :class="{'disabled':fileList.length >= 1}">
                    <FileUpload v-model="fileList" :is-show-tip="false"
                        :class="['w-full','h-full','flex','flex-col',{isUpload:fileList.length}]"
                        :is-del-confirm="true" :limit="20" :file-size="100" :file-type="['xlsx','xls','csv']"
                        url='/sop/qc/upload' del-confirm-text="将清除上传记录且彻底删除该文件"
                        @change="filesChange" @success="fileSuccess">
                        <div class="w-full h-full rounded-[8px] bg-white flex flex-col gap-[8px] justify-center items-center relative">
                            <img src="@/assets/images/file-upload.png" class="w-[56px]">
                            <span>点击添加</span>
                            <div class="text-[#999] px-[12px] text-[14px]">
                                支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式
                                最大文件大小：10MB</div>
                        </div>
                    </FileUpload>
                </div>
            </div>
            <div v-if="fileList.length" class="linear-bg rounded-[16px] h-full w-[640px] flex flex-col gap-[24px] p-[24px]">
                <div class="rounded-[8px] bg-white px-[32px] py-[24px] flex flex-col gap-[16px]">
                    <span>推荐质控SOP</span>
                    <span class="w-full h-[72px] flex items-center gap-[16px] px-[24px] border border-[#E5E6EB] rounded-[8px]">
                        <svg-icon icon-class="recentlyVisited" class="!w-[48px] !h-[48px] flex-shrink-0"></svg-icon>
                        <span>{{ selectSopFile ? sopList.find(sop => sop.sopFileId == selectSopFile)?.sopFileName : '请选择SOP' }}</span>
                    </span>
                </div>
                <div class="rounded-[8px] bg-white flex-1 p-[32px] flex flex-col gap-[24px]">
                    <el-radio v-for="sop in sopList" :key="sop.sopFileId" v-model="selectSopFile" :label="sop.sopFileId">{{sop.sopFileName}}</el-radio>
                    <el-autocomplete class="inline-input" v-model="keyword" :fetch-suggestions="querySearch"
                        placeholder="如果无目标SOP文档，请在此搜索" :trigger-on-focus="false" @select="handleSelect">
                        <i class="el-icon-search el-input__icon" slot="suffix">
                        </i>
                    </el-autocomplete>
                    <div class="text-center"><el-button type="primary" class="w-[109px] rounded-[8px]" @click="handleAnalysisNext">开始分析</el-button></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { sopQcSuggestion, sopQcCreate } from '@/api/custom/sopQc.js'

export default {
    name: 'QualityAnalysis',
    data() {
        return {
            selectSopFile: '1',
            keyword: '',
            fileList: [],
            sopList: [],
            analysisLoading: false,
        }
    },
    methods: {
        filesChange(fileList) {
            this.fileList = fileList;
        },
        querySearch(queryString, cb) {
            if (!this.fileList.length) return cb([]);
            sopQcSuggestion({
                fileId: this.fileList[0].fileId,
                keyword: this.keyword
            }).then(res => {
                if(res.code == 200 || res.code == 0) {
                    cb(res.data.items.map(item => ({
                        ...item,
                        value: item.sopFileName,
                    })));
                }
            })
        },
        handleSelect(item) {
            let idx = this.sopList.findIndex(sop => sop.sopFileId == item.sopFileId)
            if(idx == -1) {
                this.sopList.push(item);
            }
            this.selectSopFile = item.sopFileId;
        },
        fileSuccess(fileList) {
            this.getSuggestion();
        },
        getSuggestion() {
            sopQcSuggestion({
                keyword: this.keyword
            }).then(res => {
                if(res.code == 200 || res.code == 0) {
                    this.sopList = res.data.items;
                    if(this.sopList.length > 0) {
                        this.selectSopFile = res.data.items[0].sopFileId;
                    }
                }
            })
        },
        handleAnalysisNext() {
            if (!this.fileList.length || !this.selectSopFile) {
                this.$message.warning("请上传文件并选择SOP");
                return;
            }
            this.analysisLoading = true;
            sopQcCreate({
                "excelName": this.fileList[0].response.data.name,
                "excelUrl": this.fileList[0].response.data.url,
                "sopFileName": this.sopList.find(sop => sop.sopFileId == this.selectSopFile)?.sopFileName,
                "sopFileUrl": this.sopList.find(sop => sop.sopFileId == this.selectSopFile)?.url,
                "modelProvider": "openai"
            }).then(res => {
                this.analysisLoading = false;
                if(res.code == 200 || res.code == 0) {
                    const taskId = res.data;
                    // 跳转至详情路由，并传递 taskId
                    this.$router.push({
                        path: "/agent/qualityAnalysisDetail", // 替换为你实际配置的路由路径
                        query: { taskId }
                    });
                }
            }).catch(() => {
                this.analysisLoading = false;
            })
        }
    }
}
</script>

<style scoped lang="scss">
.linear-bg {
    background: linear-gradient(180deg, #C1D4FF55, #F4EAFF55);
}
.upload {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
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
                height: 80%;
                .el-upload {
                    width: 100%;
                    height: 100%;
                }
            }
            .upload-file-list {
                flex: 1;
                overflow-y: auto;
                border-radius: 8px;
                .el-upload-list__item {
                    padding: 8px;
                    display: flex;
                    background: #fff;
                    width: 50%;
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
.disabled {
    ::v-deep .el-upload {
        cursor: not-allowed !important;
        pointer-events: none;
        opacity: 0.6;
    }
}
.inline-input {
    ::v-deep {
        .el-input__inner {
            height: 50px;
        }
    }
}
</style>
