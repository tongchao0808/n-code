<template>
    <WriteMode ref="writeMode" scene="popular-science-article" title="科普文章" @answer-end="onAnswerEnd" :historySideBar="true" :isPanelSlotOpen="showWebSearch" @newChat="newChatEvent">
        <template #breadcrumb v-if="$store.state.mainPageChat.mode === 'chat'">
            <span></span>
        </template>
        <template #chatPanel>
            <div v-if="showWebSearch" class="w-[368px] h-full">
            <WebSearchPanel :list="webSearchList" @close="closeWebSearch" @selectResult="handleWebSearchResult"/>
            </div>
        </template>
    </WriteMode>
</template>

<script>
import WriteMode from '../writeMode/index.vue'
import WebSearchPanel from './components/WebSearchPanel.vue';
import { getWebSearchResult } from '@/api/custom/scienceArticle';

export default {
    name: "scienceArticleHelper",
    components: {
        WriteMode,
        WebSearchPanel
    },
    data() {
        return {
            showWebSearch: false,
            webSearchList: []
        }
    },
    methods: {
        closeWebSearch() {
            this.showWebSearch = false;
        },
        handleWebSearchResult(result) {
            console.log(result);
        },
        onAnswerEnd(message) {
            if(message.messageUniqueId) {
                getWebSearchResult(message.messageUniqueId).then(res => {
                    if(res.code === 200) {
                        this.webSearchList = res.data.results;
                        if(this.webSearchList.length > 0) {
                            this.showWebSearch = true;
                        }
                    }
                })
            }
        },
        newChatEvent() {
            this.showWebSearch = false;
            this.webSearchList = [];
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep {
    .main-chat-box {
        padding: 0;

        .message-container {
            border-radius: 0;
        }
    }
}
</style>
