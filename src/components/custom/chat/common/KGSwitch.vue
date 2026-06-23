<script>
export default {
  name: "KGSwitch",
  props: {
    value: {type: Boolean, default: false}
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(nValue) {
        this.$emit('input', nValue);
      }
    }
  }
}
</script>

<template>
  <div
    class="w-[120px] h-[32px] p-2 flex flex-row items-center justify-between border-[#E5E6EB] border-[1px] rounded-lg">
    <svg-icon icon-class="llm-knowledge" class-name="!w-4 !h-4"/>
    <div class="text-[12px] leading-[15px] font-ms-yahei">知识库</div>
    <el-switch size="small" v-model="bindValue" active-color="#346CFF"/>
  </div>
</template>

<style scoped lang="scss">

</style>
