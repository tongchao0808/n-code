<template>
    <div class="sidebar-box">
        <app-link v-for="(router, index) in routers" :key="index" :to="router.path" class="sidebar-link text-[#5F646C] hover:bg-[#F5F8FF]" :class="{'is-active': queryPath(router)}" :blank="router.blank">
            <div class="flex flex-col items-center justify-center w-full h-full">
            <svg-icon :icon-class="queryPath(router)?router.meta.activeIcon:router.meta.icon" class-name="w-[18px] h-[18px] text-red" />
            <span class="text-[14px] leading-[24px]">{{ router.meta.title }}</span>
            </div>
        </app-link>
    </div>
</template>

<script>
import AppLink from './Link'
export default {
    name: 'SidebarAgent',
    components: {
        AppLink
    },
    data() {
        const routers = [
            {
                path: '/agent/agentMain',
                name: 'agentMain',
                meta: {
                    title: '质量管理知识库',
                    icon: 'agent-main-icon',
                    activeIcon: 'agent-main-icon-active'
                }
            },
            {
                path: 'agentMapping',
                name: 'agentMapping',
                meta: {
                    title: '知识图谱',
                    icon: 'kg-map-icon',
                    activeIcon: 'kg-map-icon-active'
                }
            },
            {
                path: 'agentFileManage',
                name: 'agentFileManage',
                meta: {
                    title: '文件管理',
                    icon: 'file-manage-icon',
                    activeIcon: 'file-manage-icon-active'
                }
            },
            {
                path: 'agentFileRead',
                name: 'agentFileRead',
                meta: {
                    title: '解析应用',
                    icon: 'Standard-icon',
                    activeIcon: 'Standard-icon-active'
                }
            },
            // {
            //     path: 'agentZoom',
            //     name: 'agentZoom',
            //     meta: {
            //         title: '条款速查',
            //         icon: 'query-term-icon',
            //         activeIcon: 'query-term-icon-active'
            //     }
            // },
            {
                path: 'qualityAnalysis',
                name: 'qualityAnalysis',
                meta: {
                    title: '质量分析',
                    icon: 'query-term-icon',
                    activeIcon: 'query-term-icon-active'
                }
            },
        ]
        return {
            routers
        }
    },
    methods: {
        queryPath(router) {
            const path = this.$route.path
            return path == router.path
        }
    }
}
</script>

<style scoped lang="scss">
.sidebar-box {
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    padding: 16px 8px;
    background: #fff;
}
.sidebar-link {
    width: 114px;
    height: 52px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
}
.is-active {
    color: #3662FF !important;
}
a, a:focus, a:hover {
    color: #5F646C;
}
</style>