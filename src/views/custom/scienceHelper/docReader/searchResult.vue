<template>
    <div class="flex-1 w-full flex flex-col gap-[24px] pb-[32px] overflow-hidden">
        <div class="h-[42px] flex items-center px-[24px] text-[14px] text-[#959BA1]">
            已为您找到{{ searchList.length }}条相关搜索结果
        </div>
        <div class="flex-1 w-full flex flex-col gap-[8px] bg-white rounded-[12px] px-[16px] py-[10px] overflow-y-auto"
            v-infinite-scroll="getList" :infinite-scroll-disabled="disabled">
            <div v-if="!searchList.length && !loading"
                class="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
                <img src="@/assets/images/file-empty.png" class="w-[40%]" alt>
                <span class="text-[16px] text-[#5F646C]">未搜索到相关文献</span>
            </div>
            <div v-for="item in searchList" @click="handleRowClick(item)"
                class="min-h-[56px] w-full flex items-center justify-between gap-[24px] px-[16px] rounded-[8px] hover:bg-[#F5F8FF] cursor-pointer">
                <span class="h-full flex-1 flex items-center gap-[8px] text-[#1D2129] overflow-hidden"><svg-icon
                        :icon-class="getIcon(item.documentName)"
                        class-name="!w-[32px] !h-[32px] shrink-0"></svg-icon><span
                        class="w-[80%] text-[16px] overflow-box"
                        v-html="replaceKeywork(item.documentName)"></span></span>
                <div>
                    <el-tag type="success" size="mini">{{ parseSource(item.source) }}</el-tag>
                </div>
            </div>
            <div v-if="loading && searchList.length" class="bottom-text">加载中...</div>
            <div v-if="!hasMore && searchList.length" class="bottom-text">没有更多了</div>
        </div>
    </div>
</template>

<script>
import { searchArticle, isExistSessionId } from "@/api/custom/docReader";
import { getIconName } from "@/utils/file";
import { keyWordReplace } from '@/utils/generator/parseString.js'
export default {
    name: 'searchResult',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            searchList: [],
            hasMore: true,
            params: {
                pageSize: 50,
                keyword: '',
                cursorId: ''
            }
        }
    },
    computed: {
        disabled() {
            return this.loading || !this.hasMore
        },
        scene() {
            return this.$store.state.history.scene
        }
    },
    created() {
        this.params.keyword = this.value;
        this.getList();
    },
    beforeDestroy() {
        this.$emit('input', '')
    },
    methods: {
        getList() {
            this.loading = true;
            searchArticle(this.params).then(res => {
                if(res.code === 200) {
                    this.searchList = [...this.searchList, ...(res.data.data || [])];
                    this.hasMore = res.data.hasMore || false;
                    this.params.cursorId = res.data.cursorId || '';
                    this.loading = false;
                }
            })
        },
        getIcon(url) {
            return getIconName(url);
        },
        parseSource(source) {
            switch(source) {
                case 'CUSTOM_ARTICLE':
                    return '文献知识库';
                case 'PUBMED':
                    return 'Pubmed';
                default:
                    return '未知来源';
            }
        },
        changeKeyword() {
            const keyword = this.value.trim();
            if(!keyword || keyword === this.params.keyword) {
                return;
            }
            this.params.keyword = keyword;
            this.searchList = [];
            this.hasMore = true;
            this.params.cursorId = '';
            this.getList();
        },
        replaceKeywork(str) {
            return keyWordReplace(str, this.params.keyword)
        },
        async handleRowClick(item) {
            isExistSessionId(item.id).then(async res => {
                if (res.code === 200) {
                    const sessionUniqueId = res.data
                    this.$emit('clickSearchRow', { ...item, sessionUniqueId, literatureId: item.id, literatureSource: item.source })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.bottom-text {
    width: 100%;
    font-size: 14px;
    color: #5e6d82;
    display: flex;
    justify-content: center;
  }
</style>