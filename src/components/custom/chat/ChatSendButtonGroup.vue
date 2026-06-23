<script>
import ModelChooser from "@/components/custom/chat/common/ModelChooser.vue";

export default {
  name: "ChatSendButtonGroup",
  components: {ModelChooser},
  props: {
    reset: {type: Function, required: true},
    send: {type: Function, required: true},
  }
}
</script>

<template>
  <div class="w-full px-8 flex flex-col gap-3">
    <div class="w-full flex justify-end items-center gap-5">
      <div @click="reset"
           class="w-[120px] h-[40px] border border-[#3662FF] text-[#3662FF] text-[14px] rounded-[20px] cursor-pointer flex justify-center items-center">
        清空
      </div>
      <div @click="send"
           class="w-[120px] h-[40px] bg-[#3662FF] hover:bg-[#2041FF] text-white font-bold text-[14px] rounded-[20px] cursor-pointer flex justify-center items-center">
        提交
      </div>
    </div>
    <div class="w-full flex justify-end items-center mb-2">
      <span class="text-[12px] text-[#959BA1] leading-[22px]">内容由AI生成，注意甄别，仅供参考</span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
