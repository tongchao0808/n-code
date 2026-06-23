<template>
    <WriteMode ref="writeMode" scene="generate-slide" title="学术课件" @answer-end="onAnswerEnd" :historySideBar="true" :isPanelSlotOpen="showSideBar" @newChat="newChatEvent">
        <template #breadcrumb v-if="$store.state.mainPageChat.mode === 'chat'">
            <span></span>
        </template>
        <template #chatPanel>
            <div v-if="showSideBar" class="w-[50%] h-full">
            <CoursewareOutlinePanel :data="sideBarData" @close="closeOutlinePanel"/>
            </div>
        </template>
    </WriteMode>
</template>

<script>
import WriteMode from '../writeMode/index.vue'
import CoursewareOutlinePanel from './components/CoursewareOutlinePanel.vue';

export default {
    name: "scienceArticleHelper",
    components: {
        WriteMode,
        CoursewareOutlinePanel
    },
    data() {
        return {
            showSideBar: false,
            sideBarData: {}
        }
    },
    mounted() {
        this.$bus.$on('doSlideClick', (taskId) => {
            const slideObj = this.$store.state.mainPageChat.filesCache[taskId]
            if (slideObj) {
                this.sideBarData = slideObj;
                this.showSideBar = true;
            }
        });
    },
    destroyed() {
        this.$bus.$off('doSlideClick');
    },
    methods: {
        closeOutlinePanel() {
            this.showSideBar = false;
        },
        onAnswerEnd(message) {
        },
        newChatEvent() {
            this.showSideBar = false;
            this.sideBarData = {};
        },
    }
}
</script>

