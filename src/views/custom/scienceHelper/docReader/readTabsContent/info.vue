<template>
    <div class="info-box">
        <div class="info-item">
            <span class="info-title">标题：</span>
            <span class="content">{{ detail.info-title }}</span>
        </div>
        <div class="info-item">
            <span class="info-title">作者信息：</span>
            <span class="content">{{ detail.authorInfo }}</span>
        </div>
        <div class="info-item">
            <span class="info-title">发布时间：</span>
            <span class="content">{{ detail.releaseTime }}</span>  
        </div>
        <div class="info-item">
            <span class="info-title">收录情况：</span>
            <span class="content">{{ detail.inclusionStatus }}</span>
        </div>
        <div v-if="detail.imageExtraction.length > 0" class="flex flex-col gap-[8px] mt-[24px]">
            <span class="info-title">图标提取：</span>
            <span class="content flex flex-col items-center">
                <div v-for="(item, index) in detail.imageExtraction" :key="index">
                    <img :src="'http://192.168.77.144:3002' + item" alt="图标" style="max-width: 90%;">
                </div>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Info',
    props: {
        detail: {
            type: Object,
            default: () => { },
        }
    },
}
</script>

<style scoped lang="scss">
.info-box {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .info-item {
        display: flex;
        gap: 8px;
    }

    .info-title {
        font-size: 14px;
        font-weight: bold;
        color: #1D2129;
        width: 100px;
    }

    .content {
        font-size: 14px;
        color: #5F646C;
        flex: 1;
    }
}
</style>