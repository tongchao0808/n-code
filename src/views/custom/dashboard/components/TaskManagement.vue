<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
  >
    <div
      class="flex justify-between items-center p-[16px] -mx-4 -mt-4 border-b border-[#E5E6EB]"
    >
      <span class="text-[24px] text-[#333333] font-bold">任务管理</span>
    </div>

    <div
      class="flex gap-6 mt-4 mb-2 border-b border-[#E5E6EB] relative"
      v-loading="taskLoading"
    >
      <div
        v-for="(tab, index) in taskTabs"
        :key="tab.value"
        @click="switchTaskTab(tab.value)"
        class="pb-2 cursor-pointer relative text-[15px] flex items-center transition-colors"
        :class="
          activeTaskTab === tab.value
            ? 'text-[#3B7BFF] font-bold'
            : 'text-[#666666] hover:text-[#3B7BFF]'
        "
      >
        {{ tab.label }}
        <span
          class="ml-1 text-[12px] px-1.5 rounded-full scale-90"
          :class="
            activeTaskTab === tab.value
              ? 'bg-[#FF4D4F] text-white'
              : 'bg-[#E5E6EB] text-[#86909C]'
          "
        >
          {{ taskCounts[tab.value] > 99 ? "99+" : taskCounts[tab.value] || 0 }}
        </span>
        <div
          v-if="activeTaskTab === tab.value"
          class="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-[#3B7BFF] rounded-t-sm"
        ></div>
      </div>
    </div>

    <div class="flex-1 pr-2 mt-2 overflow-y-auto custom-scrollbar">
      <div
        v-if="taskList.length === 0"
        class="flex items-center justify-center h-full text-sm text-gray-400"
      >
        暂无相关任务
      </div>

      <div
        v-for="(task, idx) in taskList"
        :key="idx"
        class="group py-3 border-b border-gray-50 flex items-center justify-between hover:bg-[#F2F6FF] rounded transition-colors px-2 -mx-2"
      >
        <div class="flex-1 pr-4 overflow-hidden">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="w-[6px] h-[6px] rounded-full bg-[#FF4D4F]"></span>
            <!-- <span
              v-if="task.status === 'NOT_STARTED'"
              class="bg-[#FF4D4F] text-white text-[10px] px-1 rounded-sm"
              >紧急</span
            > -->
            <span class="text-[14px] text-[#333333] truncate font-medium">{{
              task.title
            }}</span>
          </div>
          <div class="text-[12px] text-[#86909C] pl-[13px]">
            {{ parseTime(task.createTime) }}
          </div>
        </div>
        <div
          class="text-[14px] text-[#3B7BFF] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          @click="goToTask(task)"
        >
          查看
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workTaskOptions, workTaskList } from "@/api/custom/work";

export default {
  name: "TaskManagement",
  data() {
    return {
      taskLoading: false,
      taskTabs: [],
      activeTaskTab: "",
      taskList: [],
      taskCounts: {},
    };
  },
  created() {
    this.initTasks();
  },
  methods: {
    async initTasks() {
      this.taskLoading = true;
      try {
        // 获取 Tab 选项
        const resTabs = await workTaskOptions();
        if (resTabs.code === 200 && resTabs.data) {
          this.taskTabs = resTabs.data;
          if (this.taskTabs.length > 0) {
            this.activeTaskTab = this.taskTabs[0].value;
            this.fetchTaskList();
          }
        }
      } catch (error) {
        console.error("加载任务选项失败", error);
      } finally {
        this.taskLoading = false;
      }
    },
    async switchTaskTab(tabValue) {
      if (this.activeTaskTab === tabValue) return;
      this.activeTaskTab = tabValue;
      await this.fetchTaskList();
    },
    async fetchTaskList() {
      this.taskLoading = true;
      try {
        const res = await workTaskList({
          pageNum: 1,
          pageSize: 6, // 首页只展示最近几条
          taskType: this.activeTaskTab,
        });
        if (res.code === 200) {
          this.taskList = res.data.page?.records || [];
          // 处理角标数据
          const countsMap = {};
          (res.data.unfinishedCounts || []).forEach((item) => {
            countsMap[item.taskType] = item.count;
          });
          this.taskCounts = countsMap;
        }
      } catch (error) {
        console.error("加载任务列表失败", error);
      } finally {
        this.taskLoading = false;
      }
    },
    goToTask(task) {
      this.$router.push({
        path: "/sysManagement/sysTask",
        query: { taskId: task.id },
      });
    },
    parseTime(timeStr) {
      if (!timeStr) return "";
      const d = new Date(timeStr);
      return `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped>
/* 缩放修正12px以下的文字（兼容低版本Chrome） */
.scale-90 {
  display: inline-block;
  transform: scale(0.9);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
