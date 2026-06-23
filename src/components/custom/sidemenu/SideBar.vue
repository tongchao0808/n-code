<script>
import SideMenu from "@/components/custom/sidemenu/SideMenu.vue";

export default {
  name: "SideBar",
  components: {SideMenu}
}
</script>

<template>
  <div class="h-full w-[296px] max-w-[296px] p-4 border-r border-r-[#3662FF1A]" v-if="$store.getters.sidebar.opened">
    <SideMenu/>
  </div>
  <div v-else class="h-full w-[64px] max-w-[64px] py-4 border-r border-r-[#3662FF1A]">
    <SideMenu/>
  </div>
</template>

<style scoped lang="scss">

</style>
