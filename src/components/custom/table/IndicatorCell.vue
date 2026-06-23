<script>
import TableColumnStatusIndicator from "@/components/custom/indicator/TableColumnStatusIndicator.vue";

export default {
  name: "IndicatorCell",
  components: {TableColumnStatusIndicator},
  props: {
    value: {required: true, type: String},
    align: {required: false, type: String},
  },
  computed: {
    indicatorType() {
      if (this.value === "已提交") {
        return "green"
      }
      if (this.value === "已创建") {
        return "blue"
      }
      if (this.value === "未创建") {
        return "red"
      }
      return "red"
    }
  }
}
</script>

<template>
  <div class="w-full">
    <TableColumnStatusIndicator :color="indicatorType" :text="value" :align="align"/>
  </div>
</template>

<style scoped lang="scss">

</style>
