<template>
  <div class="h-[calc(100vh-55px)] flex flex-col p-4 bg-[#EEF6FD]">
    <div
      class="grid flex-1 h-full min-h-0 grid-cols-2 grid-rows-2 gap-4 overflow-hidden"
    >
      <!-- 智能问答组件 -->
      <IntelligentQA />
      
      <!-- 任务管理组件 -->
      <TaskManagement />
      
      <!-- 工作日历组件 -->
      <WorkCalendar />
      
      <!-- 知识图谱组件 -->
      <KnowledgeGraph />
    </div>
  </div>
</template>

<script>
import IntelligentQA from "./components/IntelligentQA.vue";
import TaskManagement from "./components/TaskManagement.vue";
import WorkCalendar from "./components/WorkCalendar.vue";
import KnowledgeGraph from "./components/KnowledgeGraph.vue";

export default {
  name: "DashboardGrid",
  components: {
    IntelligentQA,
    TaskManagement,
    WorkCalendar,
    KnowledgeGraph,
  },
};
</script>

<style scoped>
/* 主容器样式 */
</style>