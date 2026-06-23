<script>
export default {
  name: "QuestionItem",
  props: {
    text: {type: String, required: true},
    className: {type: String, required: false, default: null},
  }
}
</script>

<template>
  <div class="max-w-full w-max h-[34px] py-2 px-4 rounded-lg border-[1px] border-[#E5E6EB] flex flex-row items-center my-[6px] item cursor-pointer bg-[#F2F3F5]" :class="className" v-on="$listeners">
    <span class="w-full text-[14px] text-[#4E5969] leading-[14px] text-center overflow-box">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.item:hover {
  background-color: #E8EFFF;
}
</style>
