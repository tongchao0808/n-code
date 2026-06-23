<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
  >
    <div
      class="flex justify-between items-center p-[16px] -mx-4 -mt-4 border-b border-[#E5E6EB]"
    >
      <span class="text-[24px] text-[#333333] font-bold">知识图谱</span>
    </div>
    <div
      class="flex-1 w-full mt-4 bg-[#122344] rounded-lg overflow-hidden relative"
      v-loading="kgLoading"
      @click="goToRelationGraph"
    >
      <RelationGraph ref="seeksRelationGraph" :options="graphOptions" />
    </div>
  </div>
</template>

<script>
import RelationGraph from "relation-graph";
import { getGraph } from "@/api/custom/agentMapping";

export default {
  name: "KnowledgeGraph",
  components: { RelationGraph },
  data() {
    return {
      kgLoading: false,
      graphOptions: {
        moveToCenterWhenRefresh: true,
        zoomToFitWhenRefresh: true,
        useAnimationWhenRefresh: false,
        defaultFocusRootNode: true,
        disableNodeClickEffect: true,
        disableLineClickEffect: true,
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
        defaultLineShape: 5,
        defaultNodeShape: 0,
        defaultShowLineLabel: true,
        hideNodeContentByZoom: false,
        defaultJunctionPoint: "border",
        disableDragCanvas: false,
        lineUseTextPath: false,
        layout: {
          layoutName: "force",
          layoutClassName: "seeks-layout-force",
          layoutTimes: 1,
          stopWhenNoEnergy: true,
        },
        isNeedShowAutoLayoutButton: false,
        showSingleNode: true,
        showNodeLabel: true,
        showNodeShortLabel: true,
        allowShowDownloadButton: false,
        backgroundColor: "transparent",
      },
    };
  },
  created() {
    this.fetchGraphData();
  },
  methods: {
    goToRelationGraph() {
      this.$router.push({
        path: "/agentMapping/index",
      });
    },
    async fetchGraphData() {
      this.kgLoading = true;
      try {
        const colors = [
          "#F9D098",
          "#A6D2F7",
          "#EDA1B4",
          "#CA9BD7",
          "#A8DBE9",
          "#9FCAC5",
          "#B4A0D9",
          "#A6ABD9",
          "#B1D6AD",
          "#F8B69C",
        ];
        const res = await getGraph("", "MAIN", 50);
        if (res.code === 200) {
          let count = 0;
          let colorMap = new Map();
          const nodes = (res.data.nodes || []).map((item) => {
            if (!colorMap.has(item.nodeTypeEnName)) {
              colorMap.set(item.nodeTypeEnName, colors[count] || "#eee");
              count++;
            }
            return {
              id: item.nodeId,
              text: this.formatDisplayName(item.displayName),
              color: colorMap.get(item.nodeTypeEnName),
              ...item,
            };
          });
          const lines = (res.data.lines || []).map((item) => {
            return { id: item.edgeId, text: item.displayName, ...item };
          });

          if (nodes.length > 0) {
            const graph_json_data = {
              rootId: nodes[0].id,
              nodes: nodes,
              lines: lines,
            };
            this.$refs.seeksRelationGraph.setJsonData(
              graph_json_data,
              () => {}
            );
          }
        }
      } catch (e) {
        console.error("加载知识图谱失败", e);
      } finally {
        this.kgLoading = false;
      }
    },
    formatDisplayName(name) {
      if (!name) return "";
      const chineseChars = name.match(/[\u4e00-\u9fa5]/g) || [];
      let resName = chineseChars.join("");
      if (resName.length > 16) {
        return resName.substring(0, 16) + "...";
      }
      return resName || name;
    },
  },
};
</script>

<style scoped>
/* 知识图谱组件样式 */
</style>
