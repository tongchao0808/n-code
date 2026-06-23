<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl m-auto">
    <!-- 主标题 -->
    <h1 class="mb-12 text-2xl font-medium text-center text-gray-800">
      输入您需要了解的质量管理事项
    </h1>

    <!-- 输入框区域 -->
    <div class="relative w-full mb-[80px]">
      <!-- 自动完成输入框 -->
      <el-autocomplete
        v-model="inputText"
        :fetch-suggestions="querySearchAsync"
        placeholder="例如：产品质量控制、文件质量要求等"
        size="large"
        class="w-full custom-input"
        @keyup.enter.native="handleAnalysis"
        @select="handleSelect"
        :debounce="300"
      />
      <!-- 悬浮的开始分析按钮 -->
      <el-button
        type="primary"
        size="small"
        class="absolute h-[48px] top-[8px] right-[8px]"
        @click="handleAnalysis"
      >
        开始分析
      </el-button>
    </div>

    <!-- 常见问题区域 -->
    <div v-if="showQuestions" class="w-full max-w-4xl p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl" style="background: linear-gradient(135deg, rgba(192, 170, 253, 0.1) 0%, rgba(104, 137, 255, 0.1) 100%);">
      <!-- 常见问题标题和关闭按钮 -->
      <div class="flex items-center justify-between mb-6" >
        <h3 class="text-lg font-medium text-gray-800">常见问题</h3>
        <el-button
          type="text"
          icon="el-icon-close"
          class="text-gray-400 hover:text-gray-600"
          @click="toggleQuestions"
          v-if="showQuestions"
        />
        <!-- <el-button
          type="text"
          icon="el-icon-question"
          class="text-gray-400 hover:text-gray-600"
          @click="toggleQuestions"
          v-else
        /> -->
      </div>

      <!-- 问题列表 -->
      <div v-if="showQuestions" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 " style="max-height: 300px; overflow-y: auto;">
        <div
          v-for="question in questions"
          :key="question"
          shadow="hover"
          class="cursor-pointer question-card"
          @click="selectQuestion(question)"
        >
          <div class="flex items-baseline">
            <i class="mr-3 text-lg text-blue-500 el-icon-info"></i>
            <span class="text-sm leading-relaxed text-gray-700">{{ question }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestionInterpret } from '@/api/custom/agentFileRead'

export default {
  name: 'StepInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    questions:{
      type:Array,
      default:()=>[]
    }
  },
  data() {
    return {
      inputText: this.value,
      showQuestions: true,
      commonQuestions: [

      ]
    }
  },
  watch: {
    value(newVal) {
      this.inputText = newVal
    },
    inputText(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    selectQuestion(question) {
      this.inputText = question
      this.$emit('input', question)
    },
    handleAnalysis() {
      if (!this.inputText.trim()) {
        this.$message.warning('请输入质量管理事项')
        return
      }
      this.$emit('next-step', {keyword:this.inputText})
    },
    toggleQuestions() {
      this.showQuestions = !this.showQuestions
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString || queryString.trim().length < 2) {
        cb([])
        return
      }

      try {
        const { data } = await suggestionInterpret({ keyword: queryString.trim(),count:10 })
        const suggestions = (data.questions || []).map(item => ({
          value: item.name,
          id: item.id
        }))
        cb(suggestions)
      } catch (error) {
        console.error('获取搜索建议失败:', error)
        cb([])
      }
    },
    handleSelect(item) {
      this.inputText = item.value
      this.$emit('input', item.value)
      this.$emit('next-step', {keyword:this.inputText,id:item.id})
    }
  }
}
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

.question-card {
  background: transparent;
  border: none;
  transition: all 0.3s;
}

.question-card:hover {
  /* background: rgba(255, 255, 255, 0.5); */
  /* transform: translateY(-2px); */
}

.question-card ::v-deep .el-card__body {
  padding: 16px;
}
</style>
