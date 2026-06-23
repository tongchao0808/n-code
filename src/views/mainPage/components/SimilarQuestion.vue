<script>
export default {
  name: "SimilarQuestion",
  props: {
    similarQuestions: {type: Array, required: true},
    doSuggestion: {type: Function, required: true},
    doClose: {type: Function, required: true},
  },
}
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 gap-2 ">
    <div class="w-full flex items-center justify-between text-base text-[#1D2129] leading-[20px] font-bold">
      <span>相似问题</span>
      <div class="cursor-pointer" @click="doClose">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]" />
      </div>
    </div>
    <!-- <ul class="list-none w-full flex flex-col gap-2 overflow-y-auto">
      <li v-for="(item, index) in similarQuestions" :key="index"
        class="w-full flex items-center justify-start px-4 py-2 rounded hover:bg-[#F5F8FF] cursor-pointer"
        @click="() => doSuggestion(item)">
        <el-tooltip class="item" effect="dark" :content="item" placement="top" popper-class="similar-question-tooltip">
        <div class="w-full flex items-center text-[14px] leading-[18px] text-[#5F646C] line-clamp-2 overflow-hidden"
             style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          {{item}}
        </div>
      </el-tooltip>
      </li>
    </ul> -->
    <div v-for="(item, index) in similarQuestions" :key="index" class="flex">
      <div
          class="max-w-[100%] min-w-0 py-2 px-4 rounded-lg border-[1px] border-[#E5E6EB] flex flex-row items-center my-[6px] item cursor-pointer"
          @click="doSuggestion">
          <span
            class="text-[14px] text-[#4E5969] leading-[18px] text-left line-clamp-2 clamp overflow-hidden text-ellipsis flex-0">{{
            item }}</span>
        </div>
    </div>
  </div>
</template>

<style lang="scss">
.similar-question-tooltip {
  max-width: 400px;
  word-break: break-word;
  white-space: normal;
}
</style>
