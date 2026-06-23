<template>
  <div class="w-full min-w-[750px] flex justify-between mx-auto  p-6 relative h-[calc(100vh-55px)] overflow-auto">
    <!-- 头部面包屑和按钮 - 已隐藏 -->
    <!-- <div class="flex items-center justify-between mb-6">
      <el-breadcrumb separator="/" class="text-gray-500">
        <el-breadcrumb-item>质量管理解读</el-breadcrumb-item>
        <el-breadcrumb-item>企业质量解读</el-breadcrumb-item>
        <el-breadcrumb-item>深度解读</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->

    <!-- 左侧主要内容区域 -->
    <div class="w-[80%] h-[calc(100vh-140px)]">
      <!-- 输入框区域 -->
      <div class="relative !w-[80%] mx-auto mb-8">
        <el-autocomplete
          v-model="localInputQuery"
          :fetch-suggestions="querySearchAsync"
          placeholder="产品质量控制"
          size="large"
          class="w-full custom-input"
          @keyup.enter.native="handleStartReading"
          @select="handleSelect"
          :debounce="300"
        />
        <el-button
          type="primary"
          size="small"
          class="absolute h-[48px] top-[8px] right-[8px]"
          @click="handleStartReading"
        >
          开始解读
        </el-button>
      </div>
      <!-- 分析结果区域 -->
      <div class="analysis-background rounded-2xl p-6 h-[calc(100vh-200px)]">
        <div class="flex items-center justify-between mb-6 ">

        <h2 class="text-lg font-bold text-gray-800">分析结果</h2>
        <div>解析应用： <span class="text-[#3662FF] font-bold cursor-pointer" @click="openUrl">{{analysisData.analysis.name}}</span></div>
        </div>

        <div class="content-grid">
          <!-- 处理流程 -->
          <div class="process-section">
            <div class="overflow-auto content-section">
              <h3 class="section-title">处理流程</h3>
              <div class="">
                <div  v-for="(process, index) in processList"
                  :key="index">
                <div
                  class="process-item"

                >
                  <div class="mb-2 text-gray-800">
                    <div
                      v-for="(desc, descIndex) in process.descriptions"
                      :key="descIndex"
                      class="mb-1"
                    >
                      {{ desc }}
                    </div>
                  </div>
                  <div class="flex items-center justify-end text-sm text-gray-600">
                    <i class="mr-2 text-gray-600 el-icon-user"></i>
                    <span class="font-medium ">{{
                      process.roleName
                    }}</span>
                  </div>

                </div>
                  <div class="flex items-center justify-center my-[8px]" v-if="index < processList.length - 1">
                    <svg-icon icon-class="process-icon" style="width: 17px; height: 12px;"/>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- 角色配置 -->
          <div class="role-section">
            <div
              class="overflow-auto content-section clickable-section"
              @click="showRoleDetails"
            >
              <h3 class="section-title">角色配置</h3>
              <div class="space-y-3">
                <div
                  class="role-card"
                  v-for="(role, index) in roleResponsibilities"
                  :key="index"
                >
                  <div class="mb-2 font-medium text-gray-800">
                    {{ role.roleName }}
                  </div>
                  <div class="space-y-1">
                    <div
                      class="flex items-baseline text-sm text-gray-600"
                      v-for="(todo, todoIndex) in role.todoLists"
                      :key="todoIndex"
                    >
                      <i class="mr-2 text-green-500 el-icon-circle-check"></i>
                      {{ todo }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 规则要求 -->
          <div class="rules-section">
            <div
              class="overflow-auto content-section"

            >
              <div class="flex items-center justify-between mb-[16px]">

              <h3 class="!mb-0 section-title">规则要求</h3>
              <el-button type="primary"  size="mini" @click="showRulesDetails">规则解读</el-button>

              </div>
              <div class="space-y-3">
                <!-- 参考文件 -->
                <div
                  class="rule-card"
                  v-if="
                    ruleRequirement.references &&
                    ruleRequirement.references.length > 0
                  "
                >
                  <div class="flex items-center mb-2">
                    <i class="mr-2 text-gray-600 el-icon-document"></i>
                    <span class="text-sm text-gray-700">参考文件</span>
                  </div>
                  <div class="ml-6">
                    <div
                      class="mb-2 text-xs text-gray-500"
                      v-for="(ref, index) in ruleRequirement.references"
                      :key="index"
                    >
                      {{ ref.fileName }}
                    </div>
                  </div>
                </div>

                <!-- 时间要求 -->
                <div
                  class="rule-card"
                  v-if="
                    ruleRequirement.deadlines &&
                    ruleRequirement.deadlines.length > 0
                  "
                >
                  <div class="flex items-center mb-2">
                    <i class="mr-2 text-gray-600 el-icon-time"></i>
                    <span class="text-sm text-gray-700">时间要求</span>
                  </div>
                  <div class="ml-6">
                    <div
                      class="mb-2 text-xs text-gray-500"
                      v-for="(deadline, index) in ruleRequirement.deadlines"
                      :key="index"
                    >
                      {{ deadline }}
                    </div>
                  </div>
                </div>

                <!-- 注意事项 -->
                <div
                  class="rule-card"
                  v-if="
                    ruleRequirement.notes && ruleRequirement.notes.length > 0
                  "
                >
                  <div class="flex items-center mb-2">
                    <i class="mr-2 el-icon-warning"></i>
                    <span class="text-sm text-gray-700">注意事项</span>
                  </div>
                  <div class="ml-6">
                    <div
                      class="mb-2 text-xs leading-relaxed text-gray-500"
                      v-for="(note, index) in ruleRequirement.notes"
                      :key="index"
                    >
                      {{ note }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧相关推荐 -->

    <div
      class="recommendation-panel  rounded-2xl  p-[16px] w-[18%]"
    >
      <!-- <div class="space-y-6"> -->
        <!-- 相关推荐 -->
        <div style="height:50%">
          <h3 class="mb-4 text-lg font-medium text-gray-800">相关推荐</h3>
          <div class="recommendation-scroll-container">
            <div class="space-y-2">
              <div
                class="text-[14px] text-[#1D2129] rounded-[8px] border-[1px] border-[#E5E6EB] p-[12px] cursor-pointer hover:bg-gray-50 transition-colors"
                v-for="(question, index) in similarQuestions"
                :key="index"
                @click="handleRecommendationClick(question)"
              >
                {{ question }}
              </div>
            </div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div style="height:50%">
          <h3 class="mb-4 text-lg font-medium text-gray-800">常见问题</h3>
          <div class="frequently-scroll-container">
            <div class="space-y-2">
              <div
                class="flex items-center text-[14px] text-[#1D2129] rounded-[8px] border-[1px] border-[#E5E6EB] p-[12px] cursor-pointer hover:bg-gray-50 transition-colors"
                v-for="(question, index) in frequentlyQuestions"
                :key="index"
                @click="handleRecommendationClick(question)"
              >
                <i class="mr-2 el-icon-question"></i>
                {{ question }}
              </div>
            </div>
          </div>
        </div>
      <!-- </div> -->
    </div>

    <!-- 详情弹窗 -->
    <DetailDialog
      v-model="showDetailDialog"
      :role-data="roleResponsibilities"
    />
  </div>
</template>

<script>
import DetailDialog from "./DetailDialog.vue";
import { suggestionInterpret } from "@/api/custom/agentFileRead";

export default {
  name: "StepAnalysis",
  components: {
    DetailDialog,
  },
  data() {
    return {
      showDetailDialog: false,
      localInputQuery: this.inputQuery,
    };
  },
  props: {
    inputQuery: {
      type: String,
      default: "产品质量控制",
    },
    analysisData: {
      type: Object,
      default: () => ({
        analysis: {
          flows: [],
          roleResponsibilities: [],
          ruleRequirement: {
            references: [],
            deadlines: [],
            notes: [],
          },
        },
        similarQuestion: {
          questions: [],
        },
        frequentlyQuestion: {
          questions: [],
        },
      }),
    },
  },
  computed: {
    processList() {
      return (
        (this.analysisData &&
          this.analysisData.analysis &&
          this.analysisData.analysis.flows) ||
        []
      );
    },
    roleResponsibilities() {
      return (
        (this.analysisData &&
          this.analysisData.analysis &&
          this.analysisData.analysis.roleResponsibilities) ||
        []
      );
    },
    ruleRequirement() {
      return (
        (this.analysisData &&
          this.analysisData.analysis &&
          this.analysisData.analysis.ruleRequirement) || {
          references: [],
          deadlines: [],
          notes: [],
        }
      );
    },
    similarQuestions() {
      return (
        (this.analysisData &&
          this.analysisData.similarQuestion &&
          this.analysisData.similarQuestion.questions) ||
        []
      );
    },
    frequentlyQuestions() {
      return (
        (this.analysisData &&
          this.analysisData.frequentlyQuestion &&
          this.analysisData.frequentlyQuestion.questions) ||
        []
      );
    },
  },
  watch: {
    inputQuery(newVal) {
      this.localInputQuery = newVal;
    },
  },
  methods: {
    openUrl(){
       const url = this.analysisData.analysis.publicUrl;
      if (url) {
        window.open(url, "_blank");
      }
    },
    showRoleDetails() {
      this.showDetailDialog = true;
    },
    showRulesDetails() {
      this.$emit("analysis-next");
    },
    handleStartReading() {
      if (!this.localInputQuery.trim()) {
        this.$message.warning("请输入质量管理事项");
        return;
      }
      this.$emit("start-reading", {keyword:this.localInputQuery});
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString || queryString.trim().length < 2) {
        cb([]);
        return;
      }

      try {
        const { data } = await suggestionInterpret({
          keyword: queryString.trim(),
        });
        const suggestions = (data.questions || []).map((item) => ({
          value: item.name,
          id: item.id,
        }));
        cb(suggestions);
      } catch (error) {
        console.error("获取搜索建议失败:", error);
        cb([]);
      }
    },
    handleSelect(item) {
      this.localInputQuery = item.value;
       this.$emit("start-reading", {keyword:this.localInputQuery,id:item.id});
    },
    handleRecommendationClick(question) {
      this.localInputQuery = question;
      this.handleStartReading();
    },
  },
};
</script>

<style scoped>
.custom-input ::v-deep .el-input__inner {
  padding-right: 100px;
  border-radius: 8px;
  height: 64px;
  border: 1px solid #d1d5db;
}

.custom-input ::v-deep .el-input__inner:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.custom-input ::v-deep .el-autocomplete {
  width: 100%;
}

.analysis-background {
  background: linear-gradient(
    113.86deg,
    rgba(193, 212, 255, 0.3) 11.85%,
    rgba(244, 234, 255, 0.3) 112.95%
  );
}

.content-section {
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-section > .space-y-4,
.content-section > .space-y-3 {
  flex: 1;
  overflow-y: auto;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
}

.process-item {
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid rgba(229, 230, 235, 1);
}

.role-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
}

.clickable-section {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rule-card {
  padding: 12px 24px;
  background: rgba(247, 248, 250, 1);
  border: 1px solid rgba(229, 230, 235, 1);
  border-radius: 8px;
  &:nth-child(1) {
    border: none;

    background: linear-gradient(rgba(247, 248, 250, 1), rgba(247, 248, 250, 1))
        padding-box,
      linear-gradient(180deg, #c0aafd 0%, #6889ff 100%);
    border: 1px solid transparent;
  }
}

.recommendation-panel {
  /* 背景色已在内联样式中定义 */
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  background: rgba(255, 255, 255, 0.8);
}

.recommendation-scroll-container {
  max-height: calc((100% - 62px));
  padding-bottom: 10px;
  overflow-y: auto;
}

.frequently-scroll-container {
  max-height: calc((100% - 62px));
  padding-bottom: 10px;
  overflow-y: auto;
}

.recommendation-scroll-container::-webkit-scrollbar,
.frequently-scroll-container::-webkit-scrollbar {
  width: 4px;
}

.recommendation-scroll-container::-webkit-scrollbar-track,
.frequently-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.recommendation-scroll-container::-webkit-scrollbar-thumb,
.frequently-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.recommendation-scroll-container::-webkit-scrollbar-thumb:hover,
.frequently-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "process role rules";
  gap: 16px;
  height: calc(100% - 52px);
}

.process-section {
  grid-area: process;
  height: 100%;
  min-height: 0;
}

.role-section {
  grid-area: role;
  height: 100%;
  min-height: 0;
}

.rules-section {
  grid-area: rules;
  height: 100%;
  min-height: 0;
}

/* 响应式调整 */
/* @media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "process"
      "role"
      "rules";
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .content-grid {
    gap: 16px;
  }
} */
</style>
