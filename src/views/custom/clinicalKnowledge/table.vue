<template>
  <div class="flex flex-1 overflow-hidden" style="margin: 16px -28px -28px -28px;">
    <div class="left-menu w-[120px] xl:w-[200px] rounded-[12px] p-[12px] flex flex-col gap-[12px]"
      style="box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),0px 5px 7px 0px rgba(65, 114, 209, 0.08);">
      <div v-for="item in typeLst" :key="item.value" @click="clickType(item)"
        :class="params.termType.includes(item.value) ? 'text-[#3662FF] font-bold' : ''"
        class="w-full p-[8px] rounded-[4px] text-[16px] text-[#1D2129] leading-[22px] hover:bg-[#F5F8FF] flex items-center cursor-pointer">
        {{ item.name }}</div>
    </div>
    <div class="table-box">
      <div class="bg-white rounded-[12px] flex justify-between px-[24px] py-[12px] items-center">
        <div>
          <el-tag type="primary" class="cursor-pointer" :effect="params.pinyinCapitalRange == ''?'dark':'light'"
            @click="clickTag('')">全部</el-tag>
        </div>
        <div class="flex gap-[16px]">
          <el-tag v-for="item in tagList" :key="item" class="cursor-pointer"
            :effect="params.pinyinCapitalRange == item?'dark':'light'" @click="clickTag(item)">{{ item }}</el-tag>
        </div>
      </div>
      <div
        class="table-main flex-1 rounded-[12px] bg-white grid grid-cols-[repeat(auto-fill,160px)] grid-rows-[repeat(auto-fill,32px)] gap-x-[20px] gap-y-[24px] p-[24px]"
        v-infinite-scroll="scrollBottom" :infinite-scroll-disabled="disabled">
        <div v-for="item in listData" :key="item.id" :title="item.name"
          class="word-item min-h-[32px] min-w-[160px] rounded-[8px] cursor-pointer px-[8px] py-[7px] overflow-box hover:bg-[#F5F8FF] "
          @click="goDetails(item)">{{ item.name }}
        </div>
        <div v-if="loading" class="bottom-text">加载中...</div>
        <div v-if="noMore" class="bottom-text">没有更多了</div>
      </div>

    </div>
  </div>
</template>

<script>
import { searchClinical, getClinicalTypes } from '@/api/custom/clinicalKnowledge.js'

export default {
  data() {
    return {
      active: '',
      listData: [],
      tagList: ['#', 'A-G', 'H-N', 'O-T', 'U-Z'],
      params: {
        termType: [],
        searchMode: 'SEARCH',
        keyword: '',
        pinyinCapitalRange: '',
        pageNum: 1,
        pageSize: 240
      },
      total: 0,
      loading: false,
      typeLst: []
    }
  },
  computed: {
    noMore () {
      return this.listData.length >= this.total
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created() {
    this.getList()
    getClinicalTypes().then(res=> {
      if(res.code == 200) {
        this.typeLst = res.data
      }
    })
  },
  methods: {
    getList() {
      this.loading = true
      searchClinical(this.params).then(res => {
        if(res.code == 200) {
          this.listData = [...this.listData, ...res.data.records]
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    clickType(item) {
      if(this.params.termType.includes(item.value)) {
        this.params.termType = this.params.termType.filter(i => i != item.value)
      } else {
        this.params.termType = [...this.params.termType, item.value]
      }
      this.listData = []
      this.params.pinyinCapitalRange = ''
      this.getList()
    },
    scrollBottom() {
      if(this.disabled) return
      this.params.pageNum += 1
      this.getList()
    },
    clickTag(item) {
      this.params.pinyinCapitalRange = item
      this.listData = []
      this.getList()
    },
    goDetails(item) {
      this.$emit('goDetails', item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.left-menu {
  margin: 28px;
  margin-right: 0;
  background: #fff;
}
.table-box {
  background: linear-gradient(
    180deg,
    rgb(223, 238, 255),
    rgb(253, 254, 255) 59.408%
  );
  flex: 1;
  overflow: hidden;
  margin: 28px 28px 28px 20px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
    0px 5px 7px 0px rgba(65, 114, 209, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;

  .table-main {
    overflow: auto;
  }
  .word-item {
    font-size: 14px;
    line-height: 18px;
    color: #1D2129;
  }
  .bottom-text {
    width: 100%;
    font-size: 14px;
    color: #5e6d82;
    display: flex;
    justify-content: center;
    grid-column: 1/-1;
  }
}

::v-deep {
  .el-table {
    &::before {
      height: 0;
    }

    .el-table__cell {
      border: none;
    }
  }
  .el-table__header-wrapper {
    display: none;
  }
  .el-menu {
    border: none;
  }
}
</style>
