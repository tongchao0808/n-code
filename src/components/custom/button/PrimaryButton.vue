<script>
export default {
  name: "PrimaryButton",
  props: {
    text: {type: String},
  }
}
</script>

<template>
  <div class="cursor-pointer w-full h-full flex justify-center items-center bg-[#3662FF] hover:bg-[#2041FF] rounded text-white text-[14px] font-bold" v-on="$listeners">
    {{ text }}
  </div>
</template>

<style scoped lang="scss">

</style>
