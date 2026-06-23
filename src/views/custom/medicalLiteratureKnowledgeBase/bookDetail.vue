<template>
  <div class="bookDetail-container">
    <div class="w-full px-[24px] py-[16px]">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a @click="$router.push('/knowledgeBase/medicalLiteratureKnowledgeBase')">医学文献知识库</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="font-bold">详情</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex-1 w-full flex justify-center bg-white overflow-y-auto">
      <div class="w-[72%] px-[88px] py-[24px] rounded-[4px] box-border">
        <div class="text-[24px] font-bold text-center py-[32px]">
        {{ doc.title }}
      </div>
      <Markdown :content="doc.content" />
      </div>
    </div>
  </div>
</template>

<script>
import { getDocDetail } from '@/api/custom/customKnowledgeBase'
import Markdown from '@/components/custom/md/Markdown.vue'

export default {
  name: 'BookDetail',
  components: { Markdown },
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
      getDocDetail(this.$route.query.id).then(res => {
        this.doc.content = res.content
        this.doc.title = res.name.split('.')[0]
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
