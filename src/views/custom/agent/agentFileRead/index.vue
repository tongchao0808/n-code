<template>
  <div
    class="w-full"
    v-loading="loading"
    element-loading-text="正在处理中...">
    <!-- 第一步：输入页面-->
    <StepInput
      v-if="currentStep === 1"
      v-model="inputText"
      @next-step="handleInputNext"
      :questions="questions"
    />

    <!-- 第二步：分析结果页面 -->
    <StepAnalysis
      v-if="currentStep === 2"
      :input-query="inputText"

      @analysis-next="handleAnalysisNext"
      @start-reading="handleStartReadingFromAnalysis"
      :analysis-data="analysisData"
    />

    <!-- 第三步：文件列表页面 -->
    <StepFileList
      v-if="currentStep === 3"
      :rules-data="rulesData"
      :meta-info="metaInfo"
      @prev-step="prevStep"
      @type-change="handleTypeChange"
      @file-action="handleFileAction"
      @start-reading="handleStartReading"
    />
  </div>
</template>

<script>
import StepInput from "./components/StepInput.vue";
import StepAnalysis from "./components/StepAnalysis.vue";
import StepFileList from "./components/StepFileList.vue";
import {
  getFrequentlyQuestion,
  searchInterpret,
  getRules,
} from "@/api/custom/agentFileRead";
export default {
  name: "AgentFileRead",
  components: {
    StepInput,
    StepAnalysis,
    StepFileList,
  },
  data() {
    return {
      currentStep: 1, // 当前步骤：1-输入，2-分析结果，3-文件列表
      inputText: "",
      questions: [],
      rulesData: [],
      metaInfo:{},
      loading: false,
      analysisData: {
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
      },
    };
  },
  created() {
    this.getQuestion();
  },
  methods: {
    async getQuestion() {
      const { data } = await getFrequentlyQuestion();

      const questions = data.questions || [];
      this.questions = questions.slice(0, 10);
    },
    async handleInputNext({keyword,id}) {
      this.inputText = keyword;
      this.loading = true;
      try {
        const { data } = await searchInterpret({ keyword,id });
        this.analysisData = data;
        this.currentStep = 2;
      } finally {
        this.loading = false;
      }
    },
    async handleAnalysisNext() {
      this.loading = true;
      try {
        const { data } = await getRules({ id: this.analysisData.analysis.id });
        console.log(data);
        // "meta": {name: "xxxx", publicUrl: "xxx", code: "GB/xxxx(这个值可能没有)"}
        this.rulesData = data.rules || [];
        this.metaInfo = data.meta||{}
        this.currentStep = 3;
      } finally {
        this.loading = false;
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    handleTypeChange({ file, newType }) {
      console.log("文件类型变更:", file.sequence, "新类型:", newType);
    },
    handleFileAction(file) {
      console.log("文件操作:", file.sequence, file.actionText);
      if (file.actionType === "danger") {
        // 开始解读
        file.actionType = "warning";
        file.actionText = "解读中";
      }
    },
    handleStartReading(pendingFiles) {
      console.log("开始解析应用:", pendingFiles.length, "个文件");
      // 这里可以添加批量解读逻辑
    },
    handleStartReadingFromAnalysis({keyword,id}) {
      // 第二步的开始解读，直接调用handleInputNext重新分析
      this.handleInputNext({keyword,id});
    },
  },
};
</script>

<style scoped></style>
