<script>
import {getGovernanceTypes} from "@/api/custom/governance";

export default {
  name: "GovernanceTypeSelect",
  props: {

  },
  computed: {
    bindValue: {
      get() {
        return this.$store.state.governance.governanceType;
      },
      set(nValue) {
        this.$store.state.governance.governanceType = nValue;
      }
    }
  },
  data() {
    return {
      options: []
    }
  },
  async mounted() {
    this.options = await getGovernanceTypes();
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
    background: #F2F3F5;
    border-radius: 4px;
    border: none;
    color: #5F646C;
  }
}
</style>
