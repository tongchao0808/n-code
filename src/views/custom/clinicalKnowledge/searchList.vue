<template>
  <div v-loading="loading" class="flex-1 h-full flex flex-col box-border overflow-hidden">
    <div class="px-[24px] mt-[8px] mb-[16px] text-[14px] leading-[18px] text-[#959BA1]">已为您找到{{ total
      }}条相关搜索结果</div>
    <div class="flex flex-1 flex-col gap-[12px] px-[12px] py-[10px] rounded-[12px] bg-[#fff] overflow-y-auto">
      <div v-for="item in searchList" :key="item.id" class="flex flex-col items-start gap-[8px] px-[12px] py-[8px] rounded-[4px] cursor-pointer hover:bg-[#F5F8FF]" @click="$emit('clickItem',item.id)">
        <div class="flex gap-[8px]">
          <span class="text-[16px] leading-[20px] text-[#3662FF]" v-html="wordReplace(item.name)"></span>
          <span v-if="item.type" class="text-[10px] text-[#3662FF] px-[6px] py-[2px] bg-[#3662FF1A] rounded-[50%]">{{
            item.type }}</span>
        </div>
        <!-- todo 此处最多显示2行 -->
        <div
          class="content-text w-full text-[14px] leading-[22px] text-[#5F646C]">
          {{ item.abstractText?item.abstractText:'暂无摘要' }}</div>
      </div>
    </div>
    <div class="float-right mb-[24px]">
      <pagination v-show="total > 0" :total="total" :page.sync="currentParams.pageNum" :limit.sync="currentParams.pageSize"
        @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { searchClinical } from '@/api/custom/clinicalKnowledge.js'
import { keyWordReplace } from '@/utils/generator/parseString.js'
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      searchList: [],
      total: 0,
      currentParams: ''
    }
  },
  watch: {
    params: {
      handler(val) {
        this.currentParams = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
    searchClinical(this.currentParams || this.params).then(res => {
      if(res.code == 200) {
        this.searchList = res.data.records
        this.total = res.data.total
      }
      this.loading = false
    })
    },
    wordReplace(str) {
      return keyWordReplace(str, this.params.keyword)
    },
  }
}
</script>

<style scoped lang="scss">
.content-text {
    max-height: 440px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>
