<template>
  <div class="bookDetail-container">
    <div class="w-full px-[24px] py-[16px]">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <span>医学文献知识库</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a @click="$emit('close')">搜索结果</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="font-bold">详情</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex-1 w-full flex justify-center bg-white overflow-y-auto">
      <div class="w-[72%] px-[88px] py-[24px] rounded-[4px] box-border">
        <Markdown :content="doc.content" />
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleDetail } from '@/api/custom/medicalLiteratureKnowledgeBase'
import Markdown from '@/components/custom/md/Markdown.vue'

export default {
    name: 'MedicalDetail',
  components: { Markdown },
  props: {
    medicalId: {
        type: String,
        default: ''
    }
  },
  data() {
    return {
      doc: {
        title: '',
        content: ''
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getArticleDetail(this.medicalId).then(res => {
        if(res.code == 200) {
            this.doc.content = res.data.content
            this.doc.title = res.data.title
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bookDetail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgb(247, 250, 254) 0.964%,
    rgb(255, 255, 255) 44.497%
  );
}
</style>
