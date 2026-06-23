<template>
    <div class="w-[75%] min-w-[1000px] h-full rounded-[12px] bg-white flex flex-col overflow-hidden">
        <div class="flex-1 flex gap-[32px] p-[36px] overflow-hidden">
            <div class="flex-1 display-hidden">
                <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                    <el-form-item label="申报类型" prop="applicationType">
                        <el-select v-model="form.applicationType" placeholder="请选择申报类型">
                            <el-option label="项目" value="PROJECT"></el-option>
                            <el-option label="软件" value="SOFTWARE"></el-option>
                            <el-option label="硬件" value="HARDWARE"></el-option>
                            <el-option label="服务" value="SERVICE"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申报方向" prop="direction">
                        <el-input v-model="form.direction"></el-input>
                    </el-form-item>
                    <el-form-item label="自动图表（多选）">
                        <el-checkbox-group v-model="form.autoChart">
                            <div class="flex gap-[12px]">
                                <div class="flex-1 h-[120px] flex flex-col border border-[#E5E6EB]">
                                    <div class="w-full flex-1 flex items-center justify-center">
                                        <svg-icon icon-class="table-grey" class-name="!w-[60px] !h-[60px]"></svg-icon>
                                    </div>
                                    <div class="w-full h-[35px] flex items-center border-t border-[#E5E6EB] pl-[8px]">
                                        <el-checkbox label="TABLE" name="TABLE">表格</el-checkbox>
                                    </div>
                                </div>
                                <div class="flex-1 h-[120px] flex flex-col border border-[#E5E6EB]">
                                    <div class="w-full flex-1 flex items-center justify-center">
                                        <svg-icon icon-class="image-grey" class-name="!w-[60px] !h-[60px]"></svg-icon>
                                    </div>
                                    <div class="w-full h-[35px] flex items-center border-t border-[#E5E6EB] pl-[8px]">
                                        <el-checkbox label="IMAGE" name="IMAGE">图片</el-checkbox>
                                    </div>
                                </div>
                                <div class="flex-1 h-[120px] flex flex-col border border-[#E5E6EB]">
                                    <div class="w-full flex-1 flex items-center justify-center">
                                        <svg-icon icon-class="chart-grey" class-name="!w-[60px] !h-[60px]"></svg-icon>
                                    </div>
                                    <div class="w-full h-[35px] flex items-center border-t border-[#E5E6EB] pl-[8px]">
                                        <el-checkbox label="CHART" name="CHART">图表</el-checkbox>
                                    </div>
                                </div>
                                <div class="flex-1 h-[120px] flex flex-col border border-[#E5E6EB]">
                                    <div class="w-full flex-1 flex items-center justify-center">
                                        <svg-icon icon-class="math-grey" class-name="!w-[60px] !h-[60px]"></svg-icon>
                                    </div>
                                    <div class="w-full h-[35px] flex items-center border-t border-[#E5E6EB] pl-[8px]">
                                        <el-checkbox label="PUBLIC_NOTICE" name="PUBLIC_NOTICE">公式</el-checkbox>
                                    </div>
                                </div>
                            </div>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="写作要求" prop="writingRequirements">
                        <el-input type="textarea" v-model="form.writingRequirements" rows="10"
                            aria-placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="text-[#959BA1] text-[12px]">本平台生成的内容仅供学习参考，不得用于其他用途，用户需对使用行为承担全部责任。</div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="upload shrink-0 w-[32%]">
                <div class="text-center text-white font-bold">本地上传</div>
                <div class="flex-1 overflow-hidden mt-[16px] mb-[8px]">
                    <FileUpload ref="fileUpload" v-model="fileList" :is-show-tip="false" :need-desc="true"
                        :class="['w-full', 'h-full', 'flex', 'flex-col', 'gap-[16px]', { isUpload: fileList.length }]"
                        :is-del-confirm="true" :limit="20" :file-size="100" :file-type="['xlsx', 'png', 'jpg']"
                        url='/attachment/chat/upload' del-confirm-text="将清除上传记录且彻底删除该文件" @success="handleSuccess">
                        <div class="w-full rounded-[8px] bg-white flex flex-col justify-center items-center"
                            :style="`height: ${fileList.length ? '100px' : '100%'}`">
                            <img src="@/assets/images/file-upload.png" class="w-[30px]">
                            <span class="text-[14px] leading-[18px] mt-[8px] mb-[2px]">点击添加</span>
                            <div v-if="!fileList.length" class="text-[#C9CDD4] px-[32px] text-[12px] leading-[18px]">
                                此处上传参考资料,允许xlsx、png、jpg格式,文件大小不超过100MB,数量不超过20个</div>
                        </div>
                    </FileUpload>
                </div>
            </div>
        </div>
        <div class="h-[60px] w-full flex items-center justify-end px-[24px] shrink-0">
            <el-button type="primary" size="mini" @click="onSubmit(fileList)" class="rounded-[8px]">下一步</el-button>
        </div>
    </div>
</template>

<script>
import { createNewChatSession } from "@/api/custom";
import { nanoid } from "nanoid";
export default {
    name: 'EmptyForm',
    data() {
        return {
            fileList: [],
            form: {
                applicationType: '',
                direction: '',
                autoChart: [],
                writingRequirements: '',
            },
            rules: {
                applicationType: [{ required: true, message: '请选择申报类型', trigger: 'blur' }],
                direction: [{ required: true, message: '请输入申报方向', trigger: 'blur' }],
                writingRequirements: [{ required: true, message: '请输入写作要求', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.$store.state.history.scene = 'project-application';
        this.$store.state.mainPageChat.mode = 'newChat';
        this.$store.state.history.sidebarOpen = false;
    },
    methods: {
        async onSubmit() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    const conn = await createNewChatSession();
                    const autoChartResources = this.fileList.map(item => {
                        return {
                            autoChartType: this.parseAutoChartType(item.name),
                            content: item.taskId,
                            description: item.desc || item.name,
                        }
                    });
                    const chatParam = {
                        requestUniqueId: nanoid(32),
                        sessionUniqueId: conn.sessionUniqueId,
                        question: this.form.writingRequirements,
                        knowledgeDatabases: [],
                        attachments: [],
                        applicationType: this.form.applicationType,
                        direction: this.form.direction,
                        writingRequirements: this.form.writingRequirements,
                        autoChartResources: autoChartResources
                    };
                    this.$emit('submit', chatParam);
                    this.$message.success('提交成功');
                } else {
                    this.$message.error('请填写完整信息');
                }
            });
        },
        parseAutoChartType(name) {
            const EXT = name.split('.').pop();
            let autoChartType = 'IMAGE';
            switch (EXT) {
                case 'xlsx':
                    autoChartType = 'TABLE';
                    break;
                case 'png':
                case 'jpg':
                    if (name.includes('图表')) {
                        autoChartType = 'CHART';
                    } else if (name.includes('公式')) {
                        autoChartType = 'PUBLIC_NOTICE';
                    }
                    break;
            }
            return autoChartType;
        },
        handleSuccess(fileList) {
            let typeSet = new Set(this.form.autoChart);
            fileList.forEach(item => {
                typeSet.add(this.parseAutoChartType(item.name));
            })
            this.form.autoChart = [...typeSet];
        }
    }
}
</script>

<style scoped lang="scss">
.upload {
    // 背景颜色从上向下渐变
    background: linear-gradient(180deg, #90b0fb 0%, #e9edfe 100%);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
        0px 5px 7px 0px rgba(65, 114, 209, 0.08);

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
                padding: 0 8px;

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
}
</style>