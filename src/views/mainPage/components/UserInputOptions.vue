<script>
export default {
  name: "UserInputOptions",
  props: {
    value: {type: Boolean, default: false},
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
  <div class="flex flex-row items-center justify-start">
    <div class="flex flex-row items-center justify-start gap-1">
    <!-- <div class="w-[120px] h-[32px] p-2 flex flex-row items-center justify-between border-[#E5E6EB] border-[1px] rounded-lg"> -->
      <!-- <svg-icon icon-class="llm-knowledge" style="width: 16px; height: 16px;"/> -->
       <el-switch size="small" v-model="bindValue" />
      <div class="text-[12px] leading-[15px] font-ms-yahei">{{ $store.state.history.scene === 'sop-agent' ? '生物样本库知识库' : '知识库' }}</div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
