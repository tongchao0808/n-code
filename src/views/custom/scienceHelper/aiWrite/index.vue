<template>
    <WriteMode ref="writeMode" scene="ai-assisted-writing" title="AI辅助写作" :historySideBar="true" :homePath="{ path: '/medicalResearch/scienceHelper', title: '科研辅助' }" />
</template>

<script>
import WriteMode from '@/views/custom/aiHelper/writeMode/index.vue'

export default {
  name: "aiWrite",
  components: {
    WriteMode
  },
}
</script>