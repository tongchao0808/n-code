<template>
  <div class="page-box flex flex-col gap-[12px] overflow-hidden m-[-20px] p-[20px]" :class="isMore?'w-[90%] xl:w-[75%]':'w-[70%]'" >
    <div class="search-box px-[24px] py-[8px] rounded-[8px] flex justify-between items-center"
      :style="`${isMore ? 'background:#fff;box-shadow:none' : ''}`">
      <template v-if="!isOperate">
        <div class="search-input flex items-center h-[40px]">
        <el-input v-model="keyword" class="w-[245px] border-0 h-full" placeholder="结果中搜索" @keyup.enter.native="getList" @clear="getList" clearable >
        </el-input>
        <div class="h-full w-[54px] flex items-center justify-center bg-[#fff] hover:bg-[#ebefff] cursor-pointer hover:text-[#3662FF]" @click="getList">
          <i class="el-icon-search text-[20px] text-[#808080]"></i>
        </div>
        </div>

        <el-button type="text" :disabled="!medicalList.length" @click="clickOperate">操作</el-button>
      </template>

      <template v-else>
        <el-button size="mini" @click="clickOperate">返回</el-button>

        <div>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
            @change="handleCheckAllChange">全选</el-checkbox>
          <el-button type="text" style="margin-left:10px" @click="cancelCheckAll(false)">取消选择</el-button>
          <el-button type="text" style="color:red" :disabled="medicalList.every(item => !item.checked)"
            @click="handleDel">删除</el-button>
        </div>
      </template>
    </div>
    <div class="book-box flex-1" :style="`${isMore?'background:#fff;box-shadow:none':''}`">
      <div v-if="!medicalList.length && loading" v-loading="loading"
        class="w-full h-full flex items-center justify-center">
      </div>
      <div v-else-if="!medicalList.length && !loading"
        class="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
        <img src="@/assets/images/file-empty.png" class="w-[40%]" alt>
        <span class="text-[18px]">还没有任何文件，请上传</span>
      </div>
      <div v-else
        class="w-full flex-1 flex flex-wrap items-start xl:px-[24px] xl:py-[12px] overflow-y-auto scrollbar-small"
        v-infinite-scroll="scrollBottom" :infinite-scroll-disabled="disabled">
        <div v-for="(item, index) in medicalList" :key="item.id"
          class="p-[8px] w-[25%] cursor-pointer flex flex-col items-center text-[14px] xl:text-[18px] leading-[1.3em] overflow-hidden" :class="isMore?'h-[12em]':'h-[50%]'">
          <div class="book-item p-[6px] rounded-[4px] text-white font-bold overflow-hidden"
            :style="`background:${item.bgColor || colorList[index % colorList.length]}`" @click="getDetail(item)">
            <div class="book-text overflow-box-multi xl:overflow-box-multi-5">{{
            item.name.split('.')[0] }}</div></div>

          <div class="w-full overflow-box text-center mt-[10px]">
            <el-checkbox v-if="isOperate" v-model="item.checked" style="margin-right:4px" @change="handleChecked" />
            <span class="text-[#5F646C]">{{ item.name.split('.')[0] }}</span>
          </div>
        </div>
        <div v-if="loading && medicalList.length && isMore" class="bottom-text">加载中...</div>
        <div v-if="noMore && medicalList.length && isMore" class="bottom-text">没有更多了</div>
      </div>

      <div v-if="!isMore && medicalList.length" class="w-full py-[8px] xl:h-[60px] flex justify-center items-center">
        <span class="text-[14px] text-[#3662FF] cursor-pointer" @click="checkMore"
          style="font-family: Microsoft YaHei UI;">查看更多</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUploadKnowledgeId
} from '@/api/custom/medicalLiteratureKnowledgeBase.js'
import {deleteDocsBatch, getKgDocs} from "@/api/custom/customKnowledgeBase";

export default {
  props: {
    isMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      keyword: '',
      medicalList: [],
      loading: false,
      isOperate: false,
      checkAll: false,
      isIndeterminate: false,
      colorList: [
        '#de97a0',
        '#91a9de',
        '#eccf83',
        '#9592d4',
        '#bcd19c',
        '#edc8b6'
      ],
      page: {
        pageNum: 1,
        pageSize: 8,
      },
      total: 0
    }
  },
  watch: {
    isMore(val) {
        this.medicalList = []
      this.getList()
    }
  },
  computed: {
    noMore () {
      return this.medicalList.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.getId()
  },
  methods: {
    //  获取自建文献库id
    getId() {
      this.loading = true
      getUploadKnowledgeId('自建文献馆').then(id => {
        if(id) {
          this.id = id
          this.getList()
        }
      })
    },
    async getList(type) {
      this.loading = true
      if(type == 'append') {
        this.page.pageNum += 1
      }else {
        this.page.pageNum = 1
        this.medicalList = []
      }
      const res = await getKgDocs(this.id, '', this.keyword, this.page.pageNum, this.isMore ? 40 : 8)
      this.medicalList = [...this.medicalList, ...res.rows]
      this.total = res.total
      this.medicalList.forEach(item => {
        this.$set(item, 'checked', false)
      })
      this.loading = false
    },
    scrollBottom() {
      if(!this.isMore || this.disabled) return
      this.getList('append')
    },
    checkMore() {
      this.$emit('checkMore')
    },
    clickOperate() {
      if(!this.isMore) {
        this.checkMore()
      }
      this.isOperate = !this.isOperate
      this.medicalList.forEach((item, index) => {
        this.$set(this.medicalList[index], 'checked', false)
        this.isIndeterminate = false
        this.checkAll = false
      })
    },
    returnHome() {
      if(this.isOperate) {
        this.clickOperate()
      }
    },
    cancelCheckAll(val) {
      this.checkAll = val
      this.handleCheckAllChange(val)
    },
    handleCheckAllChange(val) {
      this.medicalList.forEach((item, index) => {
        this.$set(this.medicalList[index], 'checked', val)
      })
      this.isIndeterminate = false
    },
    handleChecked(val) {
      this.checkAll = this.medicalList.every(item => item.checked)
      this.isIndeterminate =
        this.medicalList.some(item => item.checked) &&
        !this.medicalList.every(item => item.checked)
    },
    handleDel() {
      this.$confirm('将删除选中文件且无法恢复', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.medicalList
          .filter(item => item.checked)
          .map(item => item.id)
        deleteDocsBatch(ids).then(res => {
          this.$modal.msgSuccess('删除成功')
          this.getList()
        })
      })
    },
    getDetail(item) {
      this.$router.push({
        path: '/knowledgeBase/bookDetail',
        query: {
          id: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box, .book-box {
    box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
    0px 5px 7px 0px rgba(65, 114, 209, 0.08);
  }
.book-box {
  flex: 1;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgb(223, 238, 255),
    rgb(253, 254, 255) 59.408%
  );
  // margin: 0 20px 20px 20px;

  .book-item {
      aspect-ratio: 1/1.414;
      max-width: 100%;
      max-height: calc(100% - 35px);
      height: calc(100% - 35px);
    }
}
.search-box {
  background-color: #e3edfe;
  // margin: 20px 20px 0 20px;
}
.bottom-text {
    width: 100%;
    font-size: 14px;
    color: #5e6d82;
    display: flex;
    justify-content: center;
  }

  .book-text {
    width: 100%;
    word-break: break-all;
  }

  ::v-deep .search-input {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      border: 1px solid #C0C4CC;
    }

    .el-input__inner {
      border: none;
      border-radius: 0;
      height: 100%;
    }
  }
</style>
