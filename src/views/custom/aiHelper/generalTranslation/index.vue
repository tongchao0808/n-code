<template>
    <!-- 通用翻译-common-translation -->
    <div class="w-full h-full">
        <div v-if="!isDetail" class="page-box w-full h-full flex flex-col items-center relative">
            <el-breadcrumb class="w-full h-[44px] pl-[32px] flex items-center">
                <el-breadcrumb-item><a @click="onCancel">AI智办助手</a></el-breadcrumb-item>
                <el-breadcrumb-item class="font-bold">帮我翻译</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="mt-[160px] text-[36px] leading-[48px] font-bold">帮我翻译</div>
            <div class="mt-[8px] mb-[40px] text-[16px] leading-[32px]">短句长文精准翻译</div>
            <div class="w-[65%]">
                <TranslationInput class-name="w-full h-auto" @send="doSend" :rows="4" />
            </div>
            <img src="@/assets/images/aihelper-bg.png" alt="Background Image" class="fullscreen-img" />
        </div>
        <Detail v-else :params="translationParams" @cancel="onDetailCancel" @change="handleTranslationChange" />
    </div>
</template>

<script>
import TranslationInput from './translationInput.vue';
import Detail from './detail.vue';
import goPageHome from '@/components/mixins/goPageHome.js'

export default {
    name: 'GeneralTranslation',
    components: {
        TranslationInput,
        Detail,
    },
    mixins: [goPageHome],
    data() {
        return {
            title: '帮我翻译',
            isDetail: false,
            translationParams: {},
        }
    },
    created() {
        this.$store.state.history.scene = 'common-translation';
    },
    methods: {
        onCancel() {
            this.$tab.openPage('AI智办助手', '/aiHelper/entry');
        },
        doSend(params) {
            this.translationParams = params
            this.isDetail = true
        },
        onDetailCancel() {
            this.isDetail = false
        },
        handleTranslationChange(value) {
            this.translationParams.sourceLanguage = value.translationFrom;
            this.translationParams.targetLanguage = value.translationTo;
        }

    }
}
</script>

<style scoped lang="scss">
</style>
