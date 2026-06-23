<template>
  <div class="h-[calc(100vh-55px)] flex flex-col p-4 bg-[#EEF6FD]">
    <div class="w-[400px] h-[54px] m-auto  flex justify-center items-center rounded-[50px] mix-blend-normal" style="background: linear-gradient(90deg, rgb(155, 204, 255), rgb(209, 166, 255), rgb(151, 153, 255))">
      <div class="w-[396px] h-[50px] rounded-[50px] flex justify-center items-center bg-[#fff]">
        <div :class="`w-[192px] h-[46px] flex  justify-center items-center rounded-[50px] cursor-pointer transition-all ${usedKg === 'MAIN'? 'bg-gradient-to-r from-[#5B8EFF] to-[#B88FFF] text-white font-bold' : 'bg-transparent text-[rgba(95,100,108,1)]'}`" @click="handleKgUsed('MAIN')">
          <span class="text-[18px]">体系文件知识图谱</span>
        </div>
        <div :class="`flex w-[192px] h-[46px] px-6 py-2 justify-center items-center rounded-[50px] cursor-pointer transition-all ${usedKg === 'EXT'? 'bg-gradient-to-r from-[#5B8EFF] to-[#B88FFF] text-white font-bold' : 'bg-transparent text-[rgba(95,100,108,1)]'}`" @click="handleKgUsed('EXT')">
          <span class="text-[18px]">临床知识图谱</span>
        </div>
      </div>
    </div>
    <div class="w-full h-[calc(100%-48px-24px)] mt-[24px] bg-[#122344] flex rounded-[16px] overflow-hidden">
      <div class="flex-1 flex flex-col">
        <div class="header-box flex justify-between px-[24px] py-[12px]">
          <div class="text-[#fff] text-[18px] leading-[32px] font-bold">
            <span>节点数量&nbsp;{{ nodeTotalCount }}</span>
            <span class="ml-[40px]">关系数量&nbsp;{{ lineTotalCount }}</span>
          </div>

          <div class="flex items-center gap-[24px]">
            <div
              class="h-[64px] w-[400px] bg-white rounded-[12px] px-[16px] py-[8px] flex items-center justify-between gap-[24px]">
              <el-input v-model="keyword" @keyup.enter.native="handleSearch" clearable placeholder="输入节点名称"
                        class="flex-1 border-[#00000000]" />
              <el-button @click="handleSearch" type="primary"
                         class="w-[120px] h-[48px] bg-[#3662FF] text-[#fff] text-[14px] leading-[24px] rounded-[8px] flex items-center justify-center cursor-pointer">开始搜索</el-button>
            </div>
            <el-dropdown @command="handleLimit">
              <el-button type="primary">
                关系数({{ limit }})<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="10">10</el-dropdown-item>
                <el-dropdown-item :command="100">100</el-dropdown-item>
                <el-dropdown-item :command="200">200</el-dropdown-item>
                <el-dropdown-item :command="500">500</el-dropdown-item>
                <el-dropdown-item :command="1000">1000</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="flex-1 w-full">
          <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                         :on-line-click="onLineClick" />
        </div>
      </div>
      <transition name="slide">
        <div v-if="isDetail" class="detail-box w-[550px] h-full p-[24px] bg-white">
          <div class="px-[24px] py-[16px] flex justify-between">
            <span class="text-[16px] leading-[24px] font-bold">详情信息</span>
            <svg-icon icon-class="close " @click.stop="isDetail = false"
                      class="!w-[24px] !h-[24px] cursor-pointer text-[#5F646C] hover:text-[#999]"></svg-icon>
          </div>
          <Detail :detail="nodeDetail" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// 如果您没有在main.js文件中使用Vue.use(RelationGraph); 就需要使用下面这一行代码来引入relation-graph
import RelationGraph from "relation-graph";
import {getGraph, getNodeDetail, getLineDetail, getNodeCount, getLineCount} from "@/api/custom/agentMapping";
import Detail from './detail.vue'

export default {
  name: "Demo",
  components: { RelationGraph, Detail },
  data() {
    return {
      isShowCodePanel: false,
      isDetail: false,
      keyword: '',
      nodeTotalCount: 0,
      lineTotalCount: 0,
      limit: 10,
      usedKg: 'MAIN',
      graphOptions: {
        moveToCenterWhenRefresh: false,
        zoomToFitWhenRefresh: false,
        useAnimationWhenRefresh: false,
        defaultFocusRootNode: true,
        disableNodeClickEffect: false,
        disableLineClickEffect: false,
        backgrounImageNoRepeat: false,
        isMoveByParentNode: false,
        defaultExpandHolderPosition: "hide",
        defaultNodeColor: "rgba(238, 178, 94, 1)",
        checkedLineColor: "#FD8B37",
        defaultNodeFontColor: "#ffffff",
        defaultNodeBorderColor: "#90EE90",
        defaultNodeBorderWidth: 0,
        defaultLineColor: "#dddddd",
        defaultLineWidth: 1,
        defaultLineShape:5,
        defaultNodeShape: 0,
        defaultShowLineLabel: true,
        hideNodeContentByZoom: false,
        defaultJunctionPoint: "border",
        disableDragCanvas: false,
        lineUseTextPath: false,
        layout:{
          layoutName: "force",
          layoutClassName: "seeks-layout-force",
          layoutTimes: 1,
          stopWhenNoEnergy: true
          // layoutName: "fixed"
        },
        isNeedShowAutoLayoutButton: true,
        showSingleNode: true,
        showNodeLabel: true,
        showNodeShortLabel: true,
        allowShowDownloadButton: false,
        backgroundColor: 'transparent',
      },
      nodeDetail: {},
      nodes: [],
      lines: [],
    };
  },
  mounted() {
    this.showSeeksGraph();
    this.resetCount();
  },
  methods: {
    showSeeksGraph(keyword) {
      const colors = ['#F9D098','#A6D2F7','#EDA1B4','#CA9BD7','#A8DBE9','#9FCAC5','#B4A0D9','#A6ABD9','#B1D6AD','#F8B69C']
      getGraph(keyword, this.usedKg, this.limit).then(res => {
        let count = 0
        let colorMap = new Map()
        this.nodes = res.data.nodes.map(item => {
          if(!colorMap.has(item.nodeTypeEnName)) {
            colorMap.set(item.nodeTypeEnName, colors[count] || '#eee')
            count++
          }
          return {
            id: item.nodeId,
          text: this.formatDisplayName(item.displayName),
          color: colorMap.get(item.nodeTypeEnName),
          ...item
          }
        })
        this.lines = res.data.lines.map(item => {
          return {
            id: item.edgeId,
          text: item.displayName,
          ...item
          }
        })
        const graph_json_data = {
          rootId: this.nodes[0].id,
          nodes: this.nodes,
          lines: this.lines,
        }
        this.$refs.seeksRelationGraph.setJsonData(
        graph_json_data,
        (graphInstance) => {
          // 这些写上当图谱初始化完成后需要执行的代码
        }
      );
      })
    },
    formatDisplayName(name) {
      // 只显示中文
      const chineseChars = name.match(/[\u4e00-\u9fa5]/g) || [];
      name =  chineseChars.join('');
      if(name.length > 16) {
        return name.substring(0, 16) + '...'
      }
      return name
    },
    onNodeClick(nodeObject, $event) {
      console.log("onNodeClick:", nodeObject);
      getNodeDetail(nodeObject.id, this.usedKg).then(res => {
        if(res.code === 200) {
          this.isDetail = true
          this.nodeDetail = res.data.detail
        }
      })
    },
    onLineClick(lineObject, $event) {
      console.log("onLineClick:", lineObject);
      getLineDetail(lineObject.id, this.usedKg).then(res => {
        if(res.code === 200) {
          // this.isDetail = true
          this.nodeDetail = res.data.detail
        }
      })
    },
    handleSearch() {
      this.showSeeksGraph(this.keyword)
    },
    handleLimit(command) {
      this.limit = command
    },
    handleKgUsed(command) {
      this.usedKg = command;
      this.resetCount();
      this.showSeeksGraph();
    },
    resetCount() {
      getNodeCount(this.usedKg).then(res => {
        this.nodeTotalCount = res.data
      });
      getLineCount(this.usedKg).then(res => {
        this.lineTotalCount = res.data
      });
    }
  },
};
</script>

<style scoped lang="scss">
/* 过渡动画样式 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

.detail-box {
  border-left: 2px solid transparent;
  border-image: linear-gradient(180deg, #9BCCFF 0%, #D1A6FF 45%, #9799FF 100%) 1;
  transition: all 0.3s ease;
}
.header-box {
    ::v-deep {
        .el-input__inner {
            border: none;
        }
        .el-button--medium {
          padding: 10px 24px;
          border-radius: 8px;
        }
        .el-button {
          line-height: 24px;
        }
    }
}
</style>
