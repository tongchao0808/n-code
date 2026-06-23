<script>
export default {
  name: "WebSearch",
  props: {
    references: {type: Array, required: true},
    doClose: {type: Function, required: true},
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 gap-4 ">
    <div class="w-full flex items-center justify-between text-base text-[#1D2129] leading-[20px] font-bold">
      <span>网页搜索</span>
      <div class="cursor-pointer" @click="doClose">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <ul class="list-none w-full flex flex-col gap-2 overflow-y-auto">
      <li v-for="(item, index) in references" :key="index"
          class="w-full flex items-center justify-start px-4 py-2 rounded hover:bg-[#F5F8FF] cursor-pointer" @click="() => doSuggestion(item)">
        <div class="w-full flex flex-col gap-1">
          <div class="text-[#1D2129] text-[14px] leading-[21px]">{{item.title}}</div>
          <div class="w-full flex items-center text-[12px] leading-[21px] text-[#959BA1] line-clamp-2 overflow-hidden"
               style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            {{item.desc}}
          </div>
          <div class="w-full flex justify-start">
            <div class="rounded-lg text-[12px] leading-[15px] text-[#5F646C] flex items-center gap-1 px-2 py-1 border border-[#E8EFFF]">
              <img v-if="item.image !== undefined && item.image.length > 0" :src="item.image" alt=""/>
              <div v-else class="w-[20px] h-[20px] rounded-full bg-[#C4C4C4]"/>
              <span>{{item.websiteName}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>
