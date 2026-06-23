<script>
import ResponseSuggestion from "@/views/mainPage/components/ResponseSuggestion.vue";

export default {
  name: "BubbleSuggestions",
  components: {ResponseSuggestion},
  props: {
    suggestions: {type: Array, required: true},
    doSuggestion: {type: Function, required: false},
  }
}
</script>

<template>
  <div class="w-full" v-if="suggestions.length > 0">
    <div class="w-full h-[1px] bg-[#E5E6EB]"/>
    <div class="mt-2 w-full">
      <div class="text-[14px] leading-[18px] font-ms-yahei text-[#1D2129]">猜你想问</div>
      <div v-for="(suggestionItem, index) in suggestions" :key="index" class="flex">
        <ResponseSuggestion :text="suggestionItem" :do-suggestion="() => doSuggestion(suggestionItem)"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
