<script>
import GovernanceTypeSelect from "@/views/custom/medicalResearch/governance/GovernanceTypeSelect.vue";

export default {
  name: "ChatHeader",
  components: {GovernanceTypeSelect}
}
</script>

<template>
  <div class="w-full px-6 text-[18px] text-[#1d1d29] font-bold flex justify-between items-center">
    <div class="flex gap-2 items-center">
      <span>医疗数据治理</span>
      <div class="w-[120px] h-[30px]">
        <GovernanceTypeSelect/>
      </div>
    </div>
    <div class="w-[180px] h-[38px]">
      <div class="cursor-pointer w-full h-full flex justify-center items-center gap-2 bg-[#E8EFFF] hover:bg-[#E8EFFF2d] rounded text-[#3662FF] text-[14px] font-bold" v-on="$listeners">
        <svg-icon icon-class="plus" class-name="!w-4 !h-4"/>
        <span>新的病案</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
