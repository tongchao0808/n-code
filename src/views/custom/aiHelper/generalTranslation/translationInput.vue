<template>
    <div class="w-full h-full flex flex-col items-center justify-between py-2 px-4 border-[#3662FF] border rounded-2xl bg-white"
        :class="className">
        <!-- 选择知识库 -->
        <div class="flex justify-between w-full gap-[12px] h-[32px]">
            <UserInputOptions class="flex-none" v-model="useKnowledge" />
            <tree-select v-if="useKnowledge && $store.state.history.scene === 'common-translation'" class="flex-1"
                @selectComplete="selectComplete" :tree-data="treeData" />
        </div>

        <div class="w-full h-[1px] bg-[#E5E6EB] mt-[8px] mb-[8px]" ></div>

        <!-- 翻译输入框 -->
        <div class="w-full my-[8px] flex gap-[8px]" style="height: auto">
            <span class="flex-shrink-0 text-[14px] leading-[24px] font-bold text-[#3662FF]">翻译</span>
            <el-input type="textarea" placeholder="输入要翻译的文本" resize="none" class="h-full" :rows="rows"
                :style="{ textarea: { border: 'none' } }" v-model="question" @keydown.native="handleKeydown" />
        </div>

        <!-- 底部 -->
        <div class="flex flex-row items-center justify-between w-full h-[32px]">
            <translationTab @change="handleTranslationChange" />
            
            <div class="flex w-[56px] h-[32px] py-1 px-4 rounded-[34px] bg-[#3662FF] hover:bg-[#2041FF] items-center justify-center ml-4 cursor-pointer"
                @click.stop="doSend">
                <svg-icon icon-class="llm-send" class-name="w-[19px] h-[19px]" />
            </div>

        </div>
    </div>
</template>

<script>
import { getCustomKnowledgeBaseTree } from '@/api/custom/customKnowledgeBase'
import UserInputOptions from "@/views/mainPage/components/UserInputOptions.vue";
import TreeSelect from "@/views/mainPage/components/TreeSelect.vue";
import translationTab from '@/components/translationTab';

export default {
    name: "LLMInput",
    components: {
        UserInputOptions,
        TreeSelect,
        translationTab,
    },
    props: {
        className: { type: String, required: false, default: null },
        rows: { type: Number, required: false, default: 4 },
        loading: { type: Boolean, required: false, default: false },
    },
    data() {
        return {
            // 是否使用知识库
            useKnowledge: false,
            // 用户输入的问题
            question: "",
            // 文件
            attachments: [],
            // 图片
            pictures: [],
            translationFrom: '',
            translationTo: '',
            treeData: [],
            selectedLeafIds: [],
        };
    },
    created() {
    },
    mounted() {
        getCustomKnowledgeBaseTree().then((data) => {
            this.treeData = data
        })
    },
    methods: {
        setQuestion(value) {
            this.question = value;
        },
        reset() {
            this.setQuestion("");
            this.attachments = [];
            this.pictures = [];
        },
        handleKeydown(e) {
            if (e.key === "Enter") {
                if (e.shiftKey) {
                    return;
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    this.doSend();
                }
            }
        },
        doSend() {
            this.$emit('send', { question: this.question, 
                sourceLanguage: this.translationFrom, 
                targetLanguage: this.translationTo,
                useKnowledge: this.useKnowledge,
                knowledgeDatabases: this.selectedLeafIds,
                attachments: this.attachments,
            });
            // this.$tab.openPage('通用翻译详情', '/aiHelper/generalTranslationDetail',
            //     { question: this.question, translationFrom: this.translationFrom, translationTo: this.translationTo });
        },
        selectComplete(data) {
            this.selectedLeafIds = data.map((item) => { return { knowledgeDatabaseId: item.id, ...item } })
            if (data.length === 0) {
                this.useKnowledge = false
            }
        },
        handleTranslationChange(value) {
            this.translationFrom = value.translationFrom;
            this.translationTo = value.translationTo;
        }
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-textarea__inner {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
}

::v-deep .el-textarea__inner:focus {
    outline: none !important;
    padding: 0 !important;
}
</style>
