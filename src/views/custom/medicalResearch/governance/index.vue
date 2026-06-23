<script>
import ChatWorkspace from "@/views/custom/medicalResearch/governance/ChatWorkspace.vue";
import ResponseWorkspace from "@/views/custom/medicalResearch/governance/ResponseWorkspace.vue";

export default {
  name: "index",
  components: {ResponseWorkspace, ChatWorkspace},
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center ">
    <div class="w-1/2 h-full border-r border-r-[#E8EFFF]">
      <ChatWorkspace/>
    </div>
    <div class="flex-1 h-full border-l border-l-[#E8EFFF]">
      <ResponseWorkspace/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
