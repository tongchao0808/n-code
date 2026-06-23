<script>
import SmallButton from "@/views/custom/privateKnowledgeDatabase/SmallButton.vue";

export default {
  name: 'OpHeader',
  components: {SmallButton},
  props: {
    addDoc: {type: Function, required: true},
    changeType: {type: Function, required: true},
    toggleMultiOptions: {type: Function, required: true},
    deleteDoc: {type: Function, required: true},
  },
  data() {
    return {
      isMultiOp: false,
      currType: "全部类型"
    }
  },
  methods: {
    onToggleMultiOptions() {
      this.isMultiOp = !this.isMultiOp;
      this.toggleMultiOptions();
    },
    onTypeChange(typeItem) {
      this.currType = typeItem;
      this.changeType(typeItem);
    }
  }
}
</script>

<template>
<div class="w-full h-[38px] py-6 flex flex-row items-center">
  <SmallButton label="添加文档" prefix-icon="knowledge-add" class-name="mx-[14px]" @click.stop="addDoc" />
  <el-dropdown @command="onTypeChange" class="mx-[14px] w-[130px]">
    <SmallButton :label="currType" suffix-icon="knowledge-down" class-name="w-[130px]"/>
    <el-dropdown-menu slot="dropdown" class="w-[130px]">
      <el-dropdown-item command="全部类型">全部类型</el-dropdown-item>
      <el-dropdown-item command="AI生成">AI生成</el-dropdown-item>
      <el-dropdown-item command="本地上传">本地上传</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <SmallButton v-if="isMultiOp" label="删除" border-color="#FF5656" text-color="#FF5656" class-name="ml-auto mr-[100px]" @click.stop="deleteDoc" />
  <SmallButton v-else label="批量操作" border-color="#346CFF" text-color="#3662FF" class-name="ml-auto mr-[100px]" @click.stop="onToggleMultiOptions" />
</div>
</template>

<style scoped lang="scss">

</style>
