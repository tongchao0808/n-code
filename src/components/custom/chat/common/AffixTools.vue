<script>

export default {
  name: "AffixTools",
  props: {
    fullScreen: {type: Function, required: true},
    toggleLanguage: {type: Function, required: true},
    aiHistory: {type: Function, required: true},
    scrollToTop: {type: Function, required: true},
  }
}
</script>

<template>
  <div class="fixed 2xl:bottom-[320px] bottom-[120px] 2xl:right-8 right-4 w-10 flex flex-col shadow-lg rounded-lg overflow-hidden">
    <div class="w-10 h-10 cursor-pointer" @click="fullScreen">
      <svg-icon icon-class="full-screen" class-name="!w-10 !h-10 text-[#5F646C]"/>
    </div>
    <div class="w-10 h-10 cursor-pointer" @click="toggleLanguage">
      <svg-icon icon-class="translate" class-name="!w-10 !h-10 text-[#5F646C]"/>
    </div>
    <div class="w-10 h-10 cursor-pointer" @click="aiHistory">
      <svg-icon icon-class="rollback" class-name="!w-10 !h-10 text-[#5F646C]"/>
    </div>
    <div class="w-10 h-10 cursor-pointer" @click="scrollToTop">
      <svg-icon icon-class="to-top" class-name="!w-10 !h-10 text-[#5F646C]"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
