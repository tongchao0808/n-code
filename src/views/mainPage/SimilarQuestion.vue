<script>
import QuestionItem from "@/views/mainPage/QuestionItem.vue";

export default {
  name: "SimilarQuestion",
  components: {
    QuestionItem,
  },
  props: {
    className: {type: String, required: false, default: ""},
  },
  data() {
    return {
    }
  },
  async mounted() {
  }
}
</script>

<template>
  <div class="w-[300px] h-full flex flex-col border-l-[1px] border-l-[#F2F3F5] px-4">
    <div class="w-full flex flex-row items-center justify-start mt-[64px] mb-2">
      <span class="text-[16px] leading-[21px] font-ms-yahei font-bold text-[#1D2129]">相似问题</span>
    </div>
    <div class="w-full flex flex-col items-start justify-start">
      <QuestionItem v-for="question in $store.state.mainPageChat.similarQuestions"
                    :text="question.text"
                    class-name="my-1"
                    @click.stop="$emit('click-question', question.text)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
