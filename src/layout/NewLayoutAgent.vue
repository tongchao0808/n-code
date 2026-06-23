<template>
  <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
    <div class="w-screen h-screen flex flex-col p-0 m-0">
      <NavbarAgent class-names="flex-shrink-0"/>
      <div class="flex-1 flex items-center px-[32px] gap-[16px]">
        <SidebarAgent/>
        <app-main class="flex-1 h-[calc(100vh-55.5px)] flex items-center justify-center"/>

      </div>
    </div>
    <img src="@/assets/images/agent-bg.png" alt="Background Image" class="fullscreen-img" />
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import {AppMain, Navbar, Settings, Sidebar, TagsView} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import {mapState} from 'vuex'
import variables from '@/assets/styles/variables.scss'
import SideMenu from "@/components/custom/sidemenu/SideMenu.vue";
import SideBar from "@/components/custom/sidemenu/SideBar.vue";
import NavbarAgent from "@/layout/components/NavbarAgent.vue";
import SidebarAgent from "@/layout/components/Sidebar/SidebarAgent.vue";

export default {
  name: 'NewLayoutAgent',
  components: {
    SideBar,
    SideMenu,
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    NavbarAgent,
    SidebarAgent
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    }
  }
}
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
  background-color: #B8CDFF !important;
  border-radius: 3px;
  position: relative !important;
  left: 10px !important;
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
.fullscreen-img {
  // 固定定位，确保图片覆盖整个视口
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  // 关键属性：让图片填充整个区域并裁剪多余部分
  object-fit: cover;
  object-position: center; // 图片内容居中显示

  // 将图片放置在最底层，使其作为背景
  z-index: -10;
}
</style>
