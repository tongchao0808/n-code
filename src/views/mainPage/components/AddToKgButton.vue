<script>
export default {
  name: "AddToKgButton",
  props: {
    onAdd: {type: Function, required: true},
    color: {type: String, required: true},
    visible: {type: Boolean, default: true},
  },
  computed: {
    bgColor() {
      return this.color === 'primary' ? 'bg-[#3662FF]' : 'bg-[#F5F8FF]';
    },
    hoverBgColor() {
      if(!this.visible) return '';
      return this.color === 'primary' ? 'hover:bg-[#2041FF]' : 'hover:bg-[#E8EFFF]';
    },
    textColor() {
      return this.color === 'primary'? 'text-white' : 'text-[#3662FF]';
    },
    buttonPoint() {
      return this.visible? 'cursor-pointer' : 'cursor-default';
    }
  }
}
</script>

<template>
  <div class="w-[108px] h-[32px] flex justify-center items-center gap-1 rounded-lg text-[14px] font-bold px-2 py-[7px]"
       :class="`${bgColor} ${hoverBgColor} ${textColor} ${buttonPoint}`"
    @click="visible?onAdd():null">
    <span v-if="visible" class="flex items-center justify-center gap-1">
      <svg-icon icon-class="rect-add" class-name="!w-[18px] !h-[18px]"/>
      <span>加入知识库</span>
    </span>
    <span v-else>已加入知识库</span>
  </div>
</template>

<style scoped lang="scss">

</style>
