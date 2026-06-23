<template>
    <div class="w-full h-full">
        <div v-if="mode === 'newChat'" class="w-full h-full flex flex-col gap-[8px] items-center justify-end">
            <EmptyChat :width="90" class-name="w-full justify-end"
            :do-send="doNewMessageSend" :simple-mode="true" :init-config="initConfig" />
            <div class="w-full flex justify-center text-[12px] leading-[24px] text-[#959BA1]">内容由AI生成，仅供参考</div>
        </div>
        
        <MainChat v-else ref="mainChat" source="index" :width="90" class-name="flex-1" :init-config="initConfig" 
            @initConfigChange="(config) => { initConfig = config }" @changeSession="changeSessionEvent" :simple-mode="true" :show-create-button="false">
        </MainChat>
    </div>
</template>
<script>
import MainChat from "@/views/mainPage/MainChat.vue";
import EmptyChat from "@/views/mainPage/EmptyChat.vue";
export default {
    name: 'AiRead',
    props: {
        detail: {
            type: Object,
            default: () => ({})
        },
        listDetail: {
            type: Object,
            default: () => ({})
        },
    },
    components: {
        MainChat,
        EmptyChat
    },
    data() {
        return {
            initConfig: undefined,
        }
    },
    computed: {
        mode() {
            return this.$store.state.mainPageChat.mode;
        },
    },
    mounted() {
        this.useThisSession();
    },
    methods: {
        async doNewMessageSend(params) {
            this.initConfig = params;
            this.$store.state.mainPageChat.mode = "chat";
        },
        useThisSession() {
            this.initConfig = undefined;
            this.$store.state.mainPageChat.mode = "chat";
            const _this = this;
            this.$nextTick(() =>
                _this.$refs.mainChat.changeSession({
                    sessionUniqueId: this.detail.sessionUniqueId,
                    literatureId: this.listDetail.literatureId,
                    literatureSource: this.listDetail.source,
                })
            );
        },
        changeSessionEvent(sessionUniqueId, chatHistory) {
            if (!sessionUniqueId || !chatHistory || chatHistory.length === 0) {
                this.$store.state.mainPageChat.mode = "newChat";
                return;
            }
        },
    }
}

</script>