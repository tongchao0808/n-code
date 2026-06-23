<template>
  <div class="knowledge-container">
    <div v-if="isSearchList" class="flex w-full flex-col items-center">
      <div class="pl-[32px] py-[16px] w-full" style="border-bottom: 1px solid rgb(242, 243, 245);">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            临床知识库
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a @click="routerClick('list')">检索</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span class="font-bold">检索结果</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="main">
      <h1 v-show="!isSearchList" class="my-0 mx-auto font-bold text-center text-[36px]">临床知识库</h1>
      <div v-show="!isSearchList" class="switch-box">
        <div class="slider" :style="{ transform: `translateX(${active === '0' ? '0' : '108px'})` }"></div>
        <div :class="['switch-item', { active: active === '0' }]" @click="changeSwitch('0')">检索</div>
        <div :class="['switch-item', { active: active === '1' }]" @click="changeSwitch('1')">浏览</div>
      </div>
      <Search ref="search" v-show="active === '0'" @goDetails="goDetails" @setSearchListFlag="handleSearchClick"
        @changeParams="changeParams" />
      <Table v-show="active === '1' && !isSearchList" @goDetails="goDetails" />

      <!-- <div v-if="isSearchList" class="flex w-full flex-col items-center h-full"> -->
        <div v-if="isSearchList" class="flex-1 overflow-hidden w-full">
          <SearchList ref="searchList" :params="searchParams" @clickItem="goDetails" />
        </div>
      <!-- </div> -->

    </div>
    <div v-if="isDetail" class="detail-box flex w-full flex-col bg-white items-center h-full">
      <div class="pl-[32px] py-[16px] w-full" style="border-bottom: 1px solid rgb(242, 243, 245);">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            临床知识库
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a @click="routerClick('detail')">{{ isSearchList ? '检索结果' : (active === '0' ? '检索' : '浏览') }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span class="font-bold">详情</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex-1 overflow-hidden w-full overflow-y-auto flex justify-center">
        <Details :detail-id="detailId" />
      </div>
    </div>
  </div>
</template>

<script>
import Search from './search.vue'
import Table from './table.vue'
import Details from './details.vue'
import SearchList from './searchList.vue'
import goPageHome from '@/components/mixins/goPageHome.js'

export default {
  components: { Search, Table, Details, SearchList },
  mixins: [goPageHome],
  data() {
    return {
      active: '0',
      isDetail: false,
      detailId: '',
      isSearchList: false,
      searchParams: {}
    }
  },
  methods: {
    changeSwitch(index) {
      this.active = index
    },
    goDetails(id) {
      this.isDetail = true
      this.detailId = id
    },
    handleSearchClick(val) {
      if (this.isSearchList == val) {
        this.$refs.searchList.getList()
        return
      }
      this.isSearchList = val
    },
    routerClick(type) {
      this.isDetail = false
      type == 'list' && this.$refs.search.setSearchListFlag(false)
    },
    changeParams(val) {
      this.searchParams = val
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #EEF6FD, #fff);
  position: relative;

  .main {
    width: 72%;
    min-width: 600px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    box-sizing: border-box;

    .switch-box {
      display: flex;
      flex-shrink: 0;
      margin: 0 auto;
      width: 218px;
      height: 48px;
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      padding: 4px 5px 4px 5px;
      border-radius: 50px;
      background: url('./assets/tabBg.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      overflow: hidden;

      .slider {
        position: absolute;
        width: calc(50% - 9px);
        height: calc(100% - 8px);
        border-radius: 50px;
        background: linear-gradient(143.75deg,
            rgb(91, 142, 255) 0%,
            rgb(184, 143, 255) 95.049%);
        transition: transform 0.3s ease-in-out;
        z-index: 1;
      }

      .switch-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex: 1;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        position: relative;
        z-index: 2;
      }

      .active {
        color: #fff;
      }
    }
  }
}

.detail-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
