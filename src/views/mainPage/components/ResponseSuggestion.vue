<script>
export default {
  name: "ResponseSuggestion",
  props: {
    text: {type: String, required: true},
    doSuggestion: {type: Function, default: false},
  }
}
</script>

<template>
  <div
    class="max-w-[80%] min-w-0 py-2 px-4 rounded-lg border-[1px] border-[#E5E6EB] flex flex-row items-center my-[6px] item cursor-pointer"
    @click="doSuggestion">
    <span class="text-[14px] text-[#4E5969] leading-[18px] text-center line-clamp-2 clamp overflow-hidden text-ellipsis flex-0">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.item:hover {
  background-color: #B9C2CF1A;
}

.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
