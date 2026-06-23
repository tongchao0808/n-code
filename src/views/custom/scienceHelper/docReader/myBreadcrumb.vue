<template>
    <el-breadcrumb class="w-full px-[32px] py-[16px]">
        <el-breadcrumb-item v-for="(item, index) in items" :key="item.name">
            <span v-if="index == items.length - 1">{{ item.name }}</span>
            <a v-else @click="item.handle">
                {{ item.name }}
            </a>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'MyBreadcrumb',
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
}
</script>
