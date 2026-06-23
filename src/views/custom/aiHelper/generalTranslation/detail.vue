<template>
    <div class="w-full h-full flex flex-col items-center relative bg-[#EEF6FD]">
        <el-breadcrumb class="w-full h-[44px] pl-[32px] flex items-center">
            <el-breadcrumb-item><a @click="onCancel('AI智办助手', '/aiHelper/entry')">AI智办助手</a></el-breadcrumb-item>
            <el-breadcrumb-item><a @click="$emit('cancel')">帮我翻译</a></el-breadcrumb-item>
            <el-breadcrumb-item class="font-bold">详情页面</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="flex-1 w-full px-[32px] py-[16px] overflow-hidden">
            <div class="w-full h-full flex flex-col bg-white rounded-[12px]">
                <header class="h-[55px] w-full flex items-center justify-center border-b-[1px] border-[#E5E6EB]">
                    <TranslationTab :from="params.sourceLanguage" :to="params.targetLanguage" disabledFrom :allowExchange="false" @change="handleTranslationChange" />
                </header>
                <content class="flex-1 w-full flex overflow-hidden">
                    <div class="w-[50%] h-full py-[32px] border-r-[1px] border-[#E5E6EB]">
                        <div class="w-full h-full pl-[64px] pr-[72px] overflow-y-auto">{{ params.question }}</div>
                    </div>
                    <div class="w-[50%] h-full py-[32px] flex flex-col">
                        <div id="message-container" class="flex-1 w-full pl-[64px] pr-[72px] overflow-y-auto">{{ answer }}</div>
                        <div v-if="answer" class="h-[44px] w-full flex items-end pl-[64px] pr-[72px]">
                            <el-button type="primary" size="small" icon="el-icon-copy-document" @click="handleCopy" class="rounded-[8px]">复制</el-button>
                            <el-button type="primary" size="small" icon="el-icon-download" @click="handleDownload" class="rounded-[8px]">下载</el-button>
                        </div>
                        
                    </div>
                </content>
                
            </div>
        </div>
    </div>
</template>

<script>
import TranslationTab from '@/components/translationTab';
import {createNewChatSession} from "@/api/custom";
import { nanoid } from "nanoid";
import { sseChat } from "@/api/custom/chat";
import { getGenerateUrl } from "@/plugins/aiAnserConfig";

export default {
    name: 'GeneralTranslationDetail',
    components: {
        TranslationTab,
    },
    props: {
        params: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            answer: '',
            ExtendsParams: {
                sessionUniqueId: '',
                requestUniqueId: '',
            }
        }
    },
    mounted() {
    },
    methods: {
        async getTranslation() {
            this.answer = '';
            if(!this.ExtendsParams.sessionUniqueId) {
                await this.createNewChatSession();
            }
            let params = {
                sessionUniqueId: this.ExtendsParams.sessionUniqueId,
                requestUniqueId: this.ExtendsParams.requestUniqueId,
                ...this.params,
            }
            
            const callback = async (chunkType, value) => {
                if(value.requestUniqueId !== this.ExtendsParams.requestUniqueId) {
                    return;
                }
                this.answer += value.content;
                this.scrollToEnd();
            }
            sseChat(params, '', 'generate', callback, getGenerateUrl());
        },
        async createNewChatSession() {
            const { sessionUniqueId } = await createNewChatSession();
            this.ExtendsParams.sessionUniqueId = sessionUniqueId;
            this.ExtendsParams.requestUniqueId = nanoid(32);
        },
        onCancel(title, path) {
            this.$tab.openPage(title, path);
        },
        handleTranslationChange(tab) {
            this.$emit('change', tab);
            this.ExtendsParams.requestUniqueId = nanoid(32);
            this.getTranslation();
        },
        handleCopy() {
            this.$copyText(this.answer);
            this.$message.success('复制成功');
        },
        handleDownload() {
            const blob = new Blob([this.answer], { type: 'text/plain;charset=utf-8' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '翻译结果.txt';

            // 模拟点击下载
            document.body.appendChild(a);
            a.click();

            // 清理资源
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        scrollToEnd() {
            this.$nextTick(() => {
                const element = document.getElementById("message-container");
                setTimeout(() => {
                    element.scrollTo({
                        top: element.scrollHeight,
                        behavior: "smooth"
                    })
                }, 0)
            })
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
