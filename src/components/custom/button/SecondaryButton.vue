<script>
export default {
  name: "SecondaryButton",
  props: {
    text: {type: String},
  }
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center cursor-pointer border border-[#c9cdd4] bg-white rounded text-[#4E5969] text-[14px] font-bold" v-on="$listeners">
    {{ text }}
  </div>
</template>

<style scoped lang="scss">

</style>
