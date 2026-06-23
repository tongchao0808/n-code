<template>
  <div v-loading="loading" class="w-[72%] flex py-[24px] box-border">
    <Markdown :content="detail"/>
  </div>
</template>

<script>
import Markdown from "@/components/custom/md/Markdown.vue";
import { getClinicalDetail } from '@/api/custom/clinicalKnowledge.js'
export default {
  components: { Markdown },
  props: {
    detailId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultActive: '',
      loading: false,
      detail: ''
    }
  },
  created() {
    this.loading = true
    getClinicalDetail({ termId: this.detailId }).then(res => {
      if(res.code == 200) {
        this.detail = res.data.content
      }
      this.loading = false
    })
  }
}
</script>

<style>

</style>
