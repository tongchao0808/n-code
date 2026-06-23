<script>
import CommonButton from "@/components/custom/button/CommonButton.vue";
import FilledButton from "@/components/custom/button/FilledButton.vue";

export default {
  name: "EmptyPlaceholder",
  components: {FilledButton, CommonButton},
  props: {
    title: {type: String, required: false, default: undefined},
    onClick: {type: Function, required: false, default: undefined},
  },
  methods: {
    createArchive() {
      if (this.onClick) {
        this.onClick();
      } else {
        this.$tab.openPage("新建档案", "createArchive", null);
      }
    }
  },
  computed: {
    displayTitle() {
      return this.title ? this.title : "新建档案";
    }
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center py-9">
    <img alt="" src="../../../assets/images/custom/empty-table.png" class="w-[268px] h-[119px]"/>
    <div class="w-[138px] h-[36px]">
      <FilledButton :text="displayTitle" :on-click="createArchive"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
