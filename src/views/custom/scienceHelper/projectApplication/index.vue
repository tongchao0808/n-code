<template>
    <div class="project-application flex justify-center">
        <div class="h-full w-full overflow-hidden">
            <WriteMode ref="writeMode" scene="project-application" :homePath="{ path: '/medicalResearch/scienceHelper', title: '科研辅助' }" title="项目申报辅助编写">
                <template #emptyChat>
                    <div class="w-full h-full pt-[16px] pb-[32px] flex justify-center">
                        <EmptyForm @submit="onSubmit"></EmptyForm>
                    </div>
                </template>
            </WriteMode>
        </div>
    </div>
</template>

<script>
import WriteMode from '@/views/custom/aiHelper/writeMode/index.vue'
import EmptyForm from './emptyForm.vue'
export default {
    name: 'ProjectApplication',
    components: {
        EmptyForm,
        WriteMode,
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        onSubmit(chatParam) {
            this.$refs.writeMode.doNewMessageSend(chatParam);
        }
    }
}
</script>

<style scoped lang="scss">
</style>