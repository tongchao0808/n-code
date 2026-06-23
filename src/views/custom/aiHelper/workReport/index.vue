<template>
    <WriteMode ref="writeMode" scene="work-report" title="工作报告" :historySideBar="true" />
</template>

<script>
import WriteMode from '../writeMode/index.vue'

export default {
  name: "workReport",
  components: {
    WriteMode
  },
  watch: {
    $router() {
      console.log(this.$router);
    }
  }
}
</script>