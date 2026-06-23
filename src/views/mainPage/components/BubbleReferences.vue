<script>
import ReferenceInfoDialog from "@/components/custom/dialog/ReferenceInfoDialog.vue";

export default {
  name: "BubbleReferences",
  components: {
    ReferenceInfoDialog
  },
  props: {
    messageId: { type: String, required: false },
    message: { type: Object, default: "" },
    references: { type: Array, required: true },
    doViewReferences: { type: Function, required: true },
  },
  data() {
    return {
      file: {},
      show: false
    }
  },
  computed: {
    usedRrferences() {
      if (this.message.documentAndReferenceMap) {
        const usedRefs = [...this.message.documentAndReferenceMap.keys()]
        return this.references.filter(ref => usedRefs.includes(ref.id))
      }else{
        return []
      }
      
      
    }
  },
  methods: {
    handleSrc(nameExt) {
      try {
        return require(`@/assets/images/${nameExt}.svg`);
      } catch (error) {
          return require(`@/assets/images/file-blue.svg`);
      }
    },
    onCancel() {
      this.show = false;
    },
    handleDocBtn(file) {
      this.file = file
      this.show = true;
    }
  },
}
</script>

<template>
  <div v-if="usedRrferences.length > 0">
    <div class="flex items-center py-[4px] mb-[4px]">
      <span class="text-[14px] font-bold">引用</span><span class="text-[14px] text-[#3662FF]">（{{ usedRrferences.length
      }}篇）</span>
      <div class="h-[1px] flex-1 border-[1px] border-[#B8CDFF]"></div>
    </div>
    <ul class="flex flex-wrap gap-y-[8px] gap-x-[4px] list-none mb-[4px]">
      <li v-for="(file, refIndex) in usedRrferences" :key="refIndex"
        class="flex gap-[8px] items-center border border-[#C9CDD4] rounded-[4px] overflow-hidden cursor-pointer hover:bg-[#F5F8FF]"
        @click="handleDocBtn(file)">
        <span class="flex items-center justify-center w-[20px] h-[28px] bg-[#F2F3F5]">{{ refIndex + 1 }}</span>
        <img class="w-[20px] h-[20px] m-[4px]" :src="handleSrc(file.extension)">
        <span class="text-[12px] leading-[16px] text-[#5F646C] mr-[8px] overflow-box" style="flex: 1;color: #5F646C;">{{
          file.name.split('.')[0] }}</span>
      </li>
    </ul>
    <ReferenceInfoDialog :show="show" :file="file" :message="message" @onCancel="onCancel" />
  </div>
</template>

<style scoped lang="scss">

</style>
