<script>

import SmallButton from "@/views/custom/privateKnowledgeDatabase/SmallButton.vue";

export default {
  components: {SmallButton},
  props: {
    addDoc: {type: Function, required: true},
  }
}
</script>

<template>
<div class="w-full h-full flex flex-col items-center">
  <img src="@/assets/images/custom/no-project-proposal-result.svg" alt="no-result" class="mt-[40px]"/>
  <div class="text-[16px] leading-[20px] text-[#959BA1] font-ms-yahei my-4">暂无内容</div>
  <SmallButton label="添加文档" prefix-icon="knowledge-add" @click.stop="addDoc" />
</div>
</template>

<style scoped lang="scss">

</style>
