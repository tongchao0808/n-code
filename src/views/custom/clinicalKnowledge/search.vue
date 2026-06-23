<template>
  <div
    class="flex flex-col items-center" :class="{'overflow-hidden':!isSearchList,'flex-1':!isSearchList}"
  >
    <div class="search-box" :class="isSearchList?'':'search-box_out'">
      <el-select
        v-model="params.termType"
        placeholder="全部"
        style="width: 250px;margin-right: 20px;"
        clearable
        multiple
        collapse-tags
      >
        <el-option
          v-for="dict in typeLst"
          :key="dict.value"
          :label="dict.name"
          :value="dict.value"
        />
      </el-select>
      <el-autocomplete
        v-model="params.keyword"
        style="width: 100%;"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        value-key="name"
        @select="goDetails"
        clearable
      />
      <el-button
        type="primary"
        size="medium"
        class="font-bold w-[200px] bg-[#3662FF]"
        style="border-radius: 0 8px 8px 0;"
        @click="setSearchListFlag(true)"
      >搜索</el-button>
    </div>

    <div v-show="!isSearchList" class="flex-1 w-full flex justify-between gap-[20px] overflow-hidden">
    <div class="wordcloud-box">
      <div ref="wordcloud-box-content" class="wordcloud-box-content">
      <Wordcloud v-if="wordcloudWidth > 0 && wordcloudHeight > 0" ref="word3D" :tag-names="wordcloud" :width="wordcloudWidth" :height="wordcloudHeight" @showOptionsAndResult="clickSeries" />
        </div>
    </div>
    <div class="word-right bg-white px-[12px] xl:px-[24px] py-[32px]">
      <div class="pb-[8px] xl:pb-[16px] text-[18px]" style="border-bottom: 1px solid rgb(209, 216, 255);">最近更新</div>
      <div v-loading="illnessLoading" class="flex-1 overflow-hidden text-[14px] leading-[1.5em]">
        <div v-for="(item,index) in illnessList" :key="index" class="flex pt-[24px]">
          <div class="w-[72px] font-bold">{{ item.category }}</div>
          <div class="flex-1 flex flex-wrap gap-y-[0.8em] h-[3.8em] xl:h-[6.1em] overflow-hidden">
            <div
              v-for="it in item.terms"
              :key="it.id"
              class="text-[#4E5969] px-[6px] rounded-[4px] cursor-pointer break-all overflow-box w-1/3 xl:w-1/4"
              :title="it.name"
              @click="goDetails(it)"
            >{{ it.name }}</div>
          </div>
        </div>
      </div>
    </div>
    </div>

  </div>
</template>

<script>
import Wordcloud from '@/components/Wordcloud/index.vue'
import {
  searchWordCloud,
  getClinicalTypes,
  searchClinical,
  getClinicalRecent
} from '@/api/custom/clinicalKnowledge.js'

export default {
  components: { Wordcloud },
  data() {
    return {
      input: '',
      select: '',
      illnessList: [],
      wordcloud: [],
      wordcloudWidth: 0,
      wordcloudHeight: 0,
      typeLst: [],
      params: {
        termType: [],
        searchMode: 'SEARCH',
        keyword: '',
        pinyinCapitalRange: '',
        pageNum: 1,
        pageSize: 10
      },
      isSearchList: false,
      illnessLoading: false,
    }
  },
  watch: {
    params: {
      handler(val) {
        this.$emit('changeParams', val)
      },
      deep: true,
      immedate: true
    }
  },
  created() {
    // 获取词云图
    searchWordCloud().then(res => {
      this.wordcloud = res.data
      this.$refs.word3D.setTags(res.data.map(item => item.term)) // 数据集
    })
    this.illnessLoading = true
    getClinicalRecent({numTermsPerCategory: 12}).then(res => {
      if(res.code == 200) {
        this.illnessList = res.data
        this.illnessLoading = false
      }
    })
    getClinicalTypes().then(res=> {
      if(res.code == 200) {
        this.typeLst = res.data
      }
    })
  },
  mounted() {
    // 获取wordcloud-box的长宽
    this.wordcloudWidth = this.$refs['wordcloud-box-content'].offsetWidth
    this.wordcloudHeight = this.$refs['wordcloud-box-content'].offsetHeight
  },
  methods: {
    querySearch(queryString, cb) {
      searchClinical({ keyword: queryString, searchMode: 'SUGGESTION' }).then(res => {
        cb(res.data.records)
      })
    },
    clickSeries(params, text) {
      this.goDetails(this.wordcloud.find(item => item.term === text))
    },
    goDetails(item) {
      this.$emit('goDetails', item.id)
    },
    setSearchListFlag(val) {
      this.isSearchList = val
      this.$emit('setSearchListFlag', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  width: 100%;
  display: flex;
  border-radius: 16px;
}
.search-box_out {
  padding: 35px 48px;
  margin-top: 8px;
  margin-bottom: 20px;
  background: linear-gradient(134.43deg,
      rgb(216, 231, 255) 0.459%,
      rgb(191, 217, 254) 61.911%,
      rgb(228, 220, 255) 102.146%);
}

.search-box::v-deep {
  .el-input__inner {
    height: 50px;
  }

  .el-autocomplete {
    .el-input__inner {
    border-radius: 8px 0 0 8px;
  }
  }
}

.wordcloud-box {
  width: 48%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.wordcloud-box-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 30vw;
  height: 30vw;
  background: url('./assets/wordcloudBg.png') no-repeat;
  background-size: 100% 100%;
}

.word-right {
  width: 48%;
  height: 100%;
  border-radius: 16px;
  border: 2px solid #7190f5;
  box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
    0px 5px 7px 0px rgba(65, 114, 209, 0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
