<template>
    <div class="w-full h-full flex flex-col gap-[16px] px-[32px] pb-[32px]">
        <div class="h-[58px] flex items-center gap-[12px]">
            <svg-icon icon-class="right-arrow" class-name="!w-[24px] !h-[24px] rotate-180 text-[#5F646C] cursor-pointer hover:text-[#3662FF] hover:scale-110" @click="cancel" />
            <svg-icon icon-class="file-icon-read" class-name="!w-[48px] !h-[48px]" />
            <span class="text-[16px] font-bold w-[75%] overflow-box" :title="detail.literatureName || detail.documentName">{{ detail.literatureName || detail.documentName }}</span>
        </div>

        <div v-loading="loading" class="flex-1 w-full flex flex-col bg-white rounded-[12px] overflow-hidden">
                <header class="h-[55px] w-full flex items-center border-b-[1px] border-[#E5E6EB] px-[24px]">
                    <TranslationTab v-if="translationFrom && translationTo" @change="handleTranslationChange" :from="translationFrom" :to="translationTo" />
                </header>
                <content class="translate-content flex-1 w-full overflow-hidden flex">
                    <div class="w-[50%] h-full py-[32px] px-[64px] overflow-y-auto border-r-[1px] border-[#E5E6EB]">
                        <div :id="'from-'+index" v-for="(item, index) in originalSentences" :key="index" class="p-[4px] rounded-[4px] hover:bg-[#F5F8FF]" @click="handleClick(index)">
                            <Markdown :content="item" />
                        </div>
                    </div>
                    <div class="w-[50%] h-full py-[32px] px-[64px] overflow-y-auto">
                        <div :id="'to-'+index" v-for="(item, index) in translatedSentences" :key="index" class="p-[4px] rounded-[4px]">
                            <Markdown :content="item" />
                        </div>
                        <div v-if="!loading && translatedSentences.length === 0" class="w-full h-full flex items-center justify-center text-[#959BA1] text-[16px]">翻译结果为空，请尝试重新翻译</div>
                    </div>
                </content>
        </div>
    </div>
</template>

<script>
import TranslationTab from '@/components/translationTab/index.vue';
import { translateArticle, getTranslateLanguage, reTranslateArticle } from "@/api/custom/docReader";
import Markdown from "@/components/custom/md/Markdown.vue";
import {createNewChatSession} from "@/api/custom";

export default {
    name: 'FileTranslation',
    props: {
        detail: {
            type: Object,
            default: () => {},
        }
    },
    components: {
        TranslationTab,
        Markdown,
    },
    data() {
        return {
            translationFrom: '',
            translationTo: '',
            originalSentences: [],
            translatedSentences: [],
            loading: false,
            sessionUniqueId: '',
        }
    },
    created() {
        this.initData();
    },
    methods: {
        async initData() {
            this.loading = true;
            this.sessionUniqueId = this.detail.sessionUniqueId || this.detail.sessionId;
            if (!this.sessionUniqueId) {
                const conn = await createNewChatSession();
                this.sessionUniqueId = conn.sessionUniqueId;
                this.translationFrom = 'AUTO_DETECT';
                this.translationTo = 'CHINESE';
            }else if(!this.detail.sourceLanguage || !this.detail.targetLanguage){
                const res = await getTranslateLanguage(this.sessionUniqueId);
                    this.translationFrom = res?.data?.sourceLanguage || 'AUTO_DETECT';
                    this.translationTo = res?.data?.targetLanguage || 'CHINESE';
            }
            translateArticle({
                sessionUniqueId: this.sessionUniqueId,
                literatureId: this.detail.literatureId || this.detail.taskId,
                literatureSource: this.detail.source,
                sourceLanguage: this.translationFrom,
                targetLanguage: this.translationTo,
            }).then(res => {
                if (res.code === 200) {
                    this.originalSentences = res.data.originalSentences || [];
                    this.translatedSentences = res.data.translatedSentences || [];
                    this.loading = false;
                }
            })
        },
        handleTranslationChange(value) {
            this.translationFrom = value.translationFrom || 'AUTO_DETECT';
            if (value.translationTo != this.translationTo) {
                this.loading = true;
                this.translationTo = value.translationTo;
                reTranslateArticle({
                    sessionUniqueId: this.sessionUniqueId,
                    sourceLanguage: this.translationFrom,
                    targetLanguage: this.translationTo,
                }).then(res => {
                    if (res.code === 200) {
                        this.originalSentences = res.data.originalSentences || [];
                        this.translatedSentences = res.data.translatedSentences || [];
                        this.loading = false;
                    }
                })
            }
        },
        cancel() {
            this.$emit('close');
        },
        handleClick(index) {
            const fromElement = document.getElementById('from-'+index);
            const toElement = document.getElementById('to-'+index);
            if(fromElement && toElement) {
                // 滚动到视图中
                fromElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                toElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                
                // 设置背景色
                fromElement.style.backgroundColor = '#F5F8FF';
                toElement.style.backgroundColor = '#F5F8FF';
                
                // 5秒后恢复背景色
                setTimeout(() => {
                    fromElement.style.backgroundColor = '';
                    toElement.style.backgroundColor = '';
                }, 5000);
            }
        },
        reTranslate(value) {
            this.translationFrom = value.fromLabel;
            if (value.toLabel != this.translationTo) {
                this.loading = true;
                this.translationTo = value.toLabel;
                reTranslateArticle({
                    sessionUniqueId: this.sessionUniqueId,
                    sourceLanguage: this.translationFrom,
                    targetLanguage: this.translationTo,
                }).then(res => {
                    if (res.code === 200) {
                        this.originalSentences = res.data.originalSentences || [];
                        this.translatedSentences = res.data.translatedSentences || [];
                        this.loading = false;
                    }
                })
            }
        },
    }
}
</script>

<style scoped lang="scss">
.translate-content {
    ::v-deep .markdown-body {
       background-color: transparent;
    }
}
</style>