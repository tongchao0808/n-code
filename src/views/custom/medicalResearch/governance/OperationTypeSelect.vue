<script>


export default {
  name: "OperationTypeSelect",
  props: {

  },
  computed: {
    bindValue: {
      get() {
        return this.$store.state.governance.operateType;
      },
      set(nValue) {
        this.$store.state.governance.operateType = nValue;
      }
    }
  },
  data() {
    return {
      options: []
    }
  },
  async mounted() {
    this.options = [{label: '手动录入', value: 'byHand'}, {label: '上传', value: 'upload'}];
  }
}
</script>

<template>
  <div class="w-full">
    <el-select v-model="bindValue" class="custom-select">
      <el-option v-for="(item, index) in options" :label="item.label" :value="item.value" :key="index"/>
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.custom-select {
  ::v-deep .el-input__inner {
    //background: #F2F3F5;
    border-radius: 4px;
    border: 1px solid #F2F3F5;
    color: #5F646C;
  }
}
</style>
