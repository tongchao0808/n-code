<script>
import FunctionTitle from "@/components/custom/FunctionTitle.vue";
import FunctionCategory from "@/components/custom/FunctionCategory.vue";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import GovernanceTypeSelect from "@/views/custom/medicalResearch/governance/GovernanceTypeSelect.vue";

export default {
  name: "governance",
  components: {GovernanceTypeSelect, PrimaryButton, FunctionCategory, FunctionTitle},
  data() {
    return {

    }
  },
  methods: {
    onCategoryClick(category) {
      this.$store.state.governance.activeMedicalRecordCategory = category;
    },
    goToByHand() {
      this.$tab.openPage('医疗数据治理', '/governance/chat');
    }
  },
  async mounted() {
    await this.$store.dispatch("governance/initMedicalRecordCategories");
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full h-full gap-8 overflow-hidden">
    <div class="flex flex-col items-center justify-center w-full gap-2">
      <FunctionTitle title="医疗数据治理" class-name="mt-[88px]"/>
      <div class="flex items-center justify-center w-full">
        <div class="w-[120px] h-[30px]">
          <GovernanceTypeSelect />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center w-full">
      <FunctionCategory
        v-for="item in $store.state.governance.medicalRecordCategories"
        :label="item.label"
        :active="$store.state.governance.activeMedicalRecordCategory === item.label"
        class-name="mr-8"
        :key="item.label"
        @click="() => onCategoryClick(item.label)"
      />
    </div>
    <div class="flex items-center justify-center w-full gap-10">
      <div
        class="w-[381px] rounded-2xl bg-gradient-to-b from-[#E8F0FFFF] to-[#ffffff] flex flex-col items-center gap-6 px-10 py-9">
        <div class="w-[152px] h-[152px]">
          <img src="@/assets/images/custom/governance1.svg" alt=""/>
        </div>
        <div class="w-full h-[43px]">
          <PrimaryButton text="上传病历"/>
        </div>
      </div>
      <div
        class="w-[381px] rounded-2xl bg-gradient-to-b from-[#E8F0FFFF] to-[#ffffff] flex flex-col items-center gap-6 px-10 py-9">
        <div class="w-[152px] h-[152px]">
          <img src="@/assets/images/custom/governance2.svg" alt=""/>
        </div>
        <div class="w-full h-[43px]">
          <PrimaryButton text="手动录入" @click="goToByHand"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
