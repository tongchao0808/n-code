<script>
export default {
  name: "OperateButtonGroup",
  props: {
    copy: {type: Function, required: false},
    download: {type: Function, required: false},
    remove: {type: Function, required: false},
    addToKg: {type: Function, required: false},
    refresh: {type: Function, required: false},
    alreadyAddToKg: {type: Boolean, required: false},
  }
}
</script>

<template>
  <div class="w-full flex justify-center items-center gap-4">
    <el-tooltip class="item" effect="dark" content="复制" placement="top" v-if="copy">
      <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]" @click="copy">
        <svg-icon icon-class="copy" class-name="!w-[20px] !h-[20px] text-[#5F646C]" />
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="刷新" placement="top" v-if="refresh">
      <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
        @click="refresh">
        <svg-icon icon-class="refresh" class-name="!w-[32px] !h-[32px] text-[#5F646C]" />
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="下载" placement="top" v-if="download">
      <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
        @click="download">
        <svg-icon icon-class="download1" class-name="!w-[32px] !h-[32px] text-[#5F646C]" />
      </div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="remove">
      <div class="w-8 h-8 cursor-pointer rounded-lg flex justify-center items-center hover:bg-[#F2F3F5]"
        @click="remove">
        <svg-icon icon-class="delete1" class-name="!w-[20px] !h-[20px] text-[#FF5656]" />
      </div>
    </el-tooltip>
    <div class="w-[118px] h-8" v-if="addToKg">
      <div v-if="!alreadyAddToKg"
        class="cursor-pointer w-full h-full flex justify-center items-center gap-1 bg-[#3662FF] hover:bg-[#2041FF] rounded text-white text-[14px] font-bold px-2 py-[7px]"
        @click="addToKg">
        <svg-icon icon-class="rect-add" class-name="!w-[18px] !h-[18px]" />
        <span>加入知识库</span>
      </div>
      <div v-else
        class="w-full h-full flex justify-center items-center bg-[#3662FF] rounded text-white text-[14px] font-bold px-2 py-[7px]">
        <span>已加入知识库</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
