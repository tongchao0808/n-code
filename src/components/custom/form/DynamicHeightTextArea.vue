<script>
export default {
  name: "DynamicHeightTextArea",
  props: {
    value: {type: String, required: true},
    rows: {type: Number, required: false},
  },
  data() {
    return {
      maxContentSize: 30000,
    }
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(nValue) {
        this.$emit("input", nValue);
      }
    },
    textAreaRows() {
      if (this.rows !== undefined) {
        return this.rows;
      }
      if (!window) {
        return 5;
      }
      const height = window.innerHeight;
      if (!height) {
        return 5;
      }
      const scopes = [
        { min: 0, max: 800, value: 5 },
        { min: 800, max: 1200, value: 10 },
        { min: 1200, max: 999999, value: 15 },
      ];
      return scopes.find(scope => height >= scope.min && height < scope.max)?.value || 5;
    }
  }
}
</script>

<template>
  <div class="w-full flex flex-col">
    <el-input v-model="bindValue" type="textarea" placeholder="请输入内容" resize="none"
              :maxlength="maxContentSize" :rows="textAreaRows"
              class="custom-textarea" :style="{ textarea: { border: 'none' }}"/>
    <div class="w-full flex justify-end text-[12px] leading-6 text-[#86909c]">
      {{ bindValue.length }}/{{ maxContentSize }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-textarea {
  ::v-deep .el-textarea__inner {
    border-radius: 8px;
    border-color: #c9cdd4;
    border-width: 2px;
    padding: 12px;
    font-size: 14px;
    line-height: 28px;
    color: #1D2129;
    font-weight: 400;
  }

  ::v-deep .el-textarea__inner:focus {
    border-color: #3662FF;
  }
}
</style>
