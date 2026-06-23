<template>
    <div class="info-box">
        <div class="info-item">
            <span class="info-title">摘要：</span>
            <span class="content">{{ detail.abstractOriginal }}</span>
        </div>
        <div class="info-item">
            <span class="info-title">摘要翻译：</span>
            <span class="content">{{ detail.abstractTranslation }}</span>
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
    gap: 24px;
    .info-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .info-title {
            font-size: 14px;
            font-weight: bold;
            color: #1D2129;
        }
        .content {
            font-size: 14px;
            color: #5F646C;
            flex: 1;
        }
    }
}
</style>