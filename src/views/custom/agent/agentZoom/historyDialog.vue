<template>
    <div class="w-full h-full flex flex-col gap-[8px] border border-[#E5E6EB] rounded-[8px] px-[24px] py-[12px]">
        <div v-for="item in historyList" :key="item.id" @click="getDetail(item)" class="content-row flex justify-between items-center cursor-pointer">

            <div class="flex items-center"><svg-icon icon-class="records"
                    class="!w-[16px] !h-[16px] mr-[8px]"></svg-icon><span
                    class="word text-[14px] text-[#5F646C] leading-[24px]">{{ item.title }}</span></div>
            <svg-icon icon-class="close-area " @click.stop="closeHistory(item.id)"
                class="!w-[16px] !h-[16px] cursor-pointer text-[#C9CDD4] hover:text-[#999]"></svg-icon>
        </div>
    </div>
</template>

<script>
import { getZoomHistory } from '@/api/custom/agentZoom'

export default { 
    name: 'HistoryDialog',
    data() {
        return {
            historyList: [],
        }
    },
    created() {
        this.getHistoryList()
    },
    methods: {
        getHistoryList() {
            getZoomHistory().then(res => {
                this.historyList = res.data
            })
        },
        closeHistory(id) {
            this.historyList = this.historyList.filter(item => item.id !== id)
        },
        getDetail(item) {
            this.$emit('getDetail', item)
        }
    }

}
</script>

<style scoped lang="scss">

.content-row:hover {
    color: #3662FF;
    .word {
        color: #3662FF;
    }
}

</style>
