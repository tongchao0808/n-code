<template>
    <WriteMode ref="writeMode" scene="assistant-note" title="笔记助手" :historySideBar="true" />
</template>

<script>
import WriteMode from '../writeMode/index.vue'

export default {
  name: "noteHelper",
  components: {
    WriteMode
  },
}
</script>