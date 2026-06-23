<script>
export default {
  name: "FuncButton",
  props: {
    icon: {type: String, required: true},
    label: {type: String, required: true},
    color: {type: String, required: false, default: ""},
    className: {type: String, required: false, default: ""},
    doClick: {type: Function, default: true},
  }
}
</script>

<template>
<div class="w-max h-[26px] flex flex-row items-center justify-between cursor-pointer py-[5.5px] px-[12px] rounded-[38px] border-[1px] border-[#E8EFFF] hover:border-[#F2F3F5] hover:bg-[#F2F3F5]"
     :class="className" @click="doClick">
  <svg-icon :icon-class="icon" />
  <div class="flex items-center text-center justify-center text-[12px] leading-[12px] text-[#4E5969] ml-1"
       :style="{color: color ? color : ''}">{{ label }}</div>
</div>
</template>

<style scoped lang="scss">

</style>
