<script>
export default {
  name: "AIBubbleThinkingStatus",
  props: {
    thinking: {type: Boolean, required: true},
    showCompleteStatus: {type: Boolean, default: true}
  }
}
</script>

<template>
  <div class="flex">
    <span v-if="thinking"
         class="h-[32px] flex flex-row p-[8px] bg-[#F5F8FF] text-[12px] leading-[15px] text-[#3662FF] font-ms-yahei justify-start items-center rounded">
      <svg-icon icon-class="llm-thinking" class-name="w-[14px] h-[14px] mr-[4px]" style="animation: rotating 2s linear infinite;"/>
      思考中
      <i class="el-icon-arrow-down ml-[12px] mr-[2px] text-[16px] text-[#3662FF]"></i>
    </span>
    <div v-else-if="showCompleteStatus"
         class="w-[100px] h-[24px] flex flex-row py-1 px-2 bg-[rgba(237,242,247,0.5)] text-[12px] leading-[15px] text-[#4E5969] font-ms-yahei justify-start gap-2 items-center rounded">
      <svg-icon icon-class="llm-thought" class-name="w-[14px] h-[14px]"/>
      已完成思考
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
