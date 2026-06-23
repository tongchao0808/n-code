<template>
    <div class="shrink-0 cursor-pointer" :class="{'w-[100px]': !simple}">
        <div class="flex items-center" :class="{ 'hover:underline': item.status === 'PENDING' }"
            @click="handleTranslateClick(item)">
            <svg-icon v-if="!simple"
                :icon-class="item.status === 'PENDING' ? 'play-icon' : item.status === 'ANALYZING' ? 'waitting-icon' : item.status === 'COMPLETED' ? 'success-icon' : 'error-icon'"
                class-name="!w-[20px] !h-[20px] mr-[8px]" />
            <span :class="(simple?'text-[10px] leading-[14px]':'text-[14px] leading-[20px]')+ ' text-['+fontColor+']'">{{ item.status === 'PENDING' ?
                '开始翻译' : item.status === 'ANALYZING' ? '翻译中...' : item.status === 'COMPLETED' ? '翻译完成' : item.status === 'FAILED' ? '翻译失败' : '未知状态' }}</span>
        </div>
    </div>
</template>

<script>
import {createNewChatSession} from "@/api/custom";
import { translateArticle } from '@/api/custom/docReader.js'
export default {
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        simple: {
            type: Boolean,
            default: false
        },
        fontColor: {
            type: String,
            default: '#5F646C'
        }
    },
    methods: {
        async handleTranslateClick(item) {
            if(item.status !== 'PENDING') {
                return
            }
            const conn = await createNewChatSession();
            item.sessionUniqueId = conn.sessionUniqueId
            item.status = 'ANALYZING'
            translateArticle({
                sessionUniqueId: conn.sessionUniqueId,
                literatureId: item.taskId,
                literatureSource: 'CHAT_UPLOAD',
                sourceLanguage: 'AUTO_DETECT',
                targetLanguage: 'CHINESE',
            }).then(res => {
                if(res.code === 200) {
                    item.status = 'COMPLETED'
                    this.$emit('success', item)
                }
            })
        },
    }
}
</script>