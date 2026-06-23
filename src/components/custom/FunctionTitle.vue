<script>
export default {
  name: "FunctionTitle",
  props: {
    title: {type: String, required: true},
    className: {type: String, required: false, default: ''},
  }
}
</script>

<template>
<div class="w-full flex flex-col items-center justify-center" :class="className">
  <span class="text-[36px] leading-[48px] text-[#1D2129] font-bold font-ms-yahei">{{ title }}</span>
</div>
</template>

<style scoped lang="scss">

</style>
