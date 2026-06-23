<template>
  <div class="w-full max-w-[1000px]">
    <!-- 多页PDF循环渲染 -->
    <pdf 
      v-for="page in totalPages" 
      :key="page" 
      :src="pdfSrc" 
      :page="page"
      class="bg-[gray] px-[20px] pb-[20px]"
    ></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import * as pdfJsLib from "pdfjs-dist/build/pdf";  // 导入pdf.js核心库
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry'  // 导入worker

// 配置pdf.js的worker路径（避免报错）
pdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc

export default {
    props: {
        src: {
            type: String,
            default: ''
        }
    },
  components: { pdf },
  data() {
    return {
      pdfSrc: this.src,
      totalPages: 0  // 总页数
    }
  },
  mounted() {
    // 获取PDF总页数
    const loadingTask = pdf.createLoadingTask(this.pdfSrc)
    loadingTask.promise.then(pdf => {
      this.totalPages = pdf.numPages  // 赋值总页数
    }).catch(err => {
      console.error('获取页数失败：', err)
    })
  }
}
</script>
