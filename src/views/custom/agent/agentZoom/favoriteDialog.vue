<template>
    <div class="w-full h-full p-[1px] overflow-y-auto text-[14px] leading-[24px] flex flex-col gap-[16px]" :class="{'pr-[12px]':favoriteList.length > 6}">

        <div v-for="item in favoriteList" :key="item.id" @click="getDetail(item)"
            class="w-full flex flex-col gap-[12px] hover-border-style hover:bg-[#F5F8FF] bg-white px-[24px] py-[12px] rounded-[8px] cursor-pointer">
            <div class="flex justify-between text-[16px] leading-[21px]">
                <span>#{{ item.title }}</span>
                <svg-icon :icon-class="item.favorite?'star':'star-line'" class="!w-[16px] !h-[16px] hover:scale-110" :class="{'text-[#FAAD14]':item.favorite}" @click.stop="handleFavorite(item)"></svg-icon> 
            </div>
            <div class="text-[#5F646C] overflow-box">{{ item.content }}
            </div>
            <div class="text-[#5F646C] flex items-center justify-end">
                <svg-icon icon-class="file-line" class="!w-[16px] !h-[16px] mr-[8px]"></svg-icon>
                <span class="max-w-[204px] overflow-box">{{ item.documentName }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getZoomFavorite, setFavorite } from '@/api/custom/agentZoom'

export default {
    name: 'FavoriteDialog',

    data() {
        return {
            favoriteList: [],
        }
    },
    created() {
        this.getFavoriteList()
    },
    methods: {
        getFavoriteList() {
            getZoomFavorite().then(res => {
                this.favoriteList = res.data
            })
        },
        handleFavorite(item) {
            setFavorite(item.id, !item.favorite).then(res => {
                if (res.code === 200) {
                    item.favorite = !item.favorite
                    if (item.favorite) {
                        this.$message.success('收藏成功')
                    } else {
                        this.$message.info('取消收藏')
                    }
                }
            })
        },
        getDetail(item) {
            this.$emit('getDetail', item)
        }
    }

}
</script>

