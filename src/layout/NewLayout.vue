<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }"
  >
    <div
      v-if="$route.meta.wrap !== false"
      class="w-screen h-screen flex p-0 m-0"
    >
      <SideBar />
      <div class="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <Navbar class-names="flex-shrink-0" />
        <app-main />
      </div>
    </div>
    <div v-else class="w-screen h-screen flex p-0 m-0">
      <app-main />
    </div>
    <draggable-image />
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import variables from "@/assets/styles/variables.scss";
import SideMenu from "@/components/custom/sidemenu/SideMenu.vue";
import SideBar from "@/components/custom/sidemenu/SideBar.vue";
import DraggableImage from "@/components/DraggableImage";
export default {
  name: "NewLayout",
  components: {
    SideBar,
    SideMenu,
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    DraggableImage,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    variables() {
      return variables;
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

::v-deep ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::v-deep ::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::v-deep ::-webkit-scrollbar-thumb {
  background-color: #b8cdff !important;
  border-radius: 3px;
  position: relative !important;
  left: 10px !important;
}

::v-deep .scrollbar-small {
  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1px;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
