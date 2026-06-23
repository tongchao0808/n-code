<script>
import AppLink from "@/layout/components/Sidebar/Link.vue";
import SideItem from "@/components/custom/sidemenu/SideItem.vue";

export default {
  name: "SideMenu",
  components: {SideItem, AppLink},
  props: {
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headerMenus: [],
      bodyMenus: [
        'index',"/knowledgeBase", "/aiHelper", "/medicalResearch",'/agent','/knowledgeLibrary','/agentMapping','/sysManagement'
      ],
      footerMenus: ["/system"],

      openMenus: [
        '/medicalResearch/medicalResearch',
        '/medicalTechUse/medicalTechUse',
        '/clinicalUse/clinicalUse'
      ],
    }
  },
  created() {
    // 测试环境菜单在正式环境中不显示
    // if(process.env.NODE_ENV === 'production') {
    //   this.bodyMenus = this.bodyMenus.filter(item => !['/medicalResearch', '/system'].includes(item))
    // }
  },
  computed: {
    headerMenuItems() {
      return this.$store.getters.sidebarRouters.filter(item => {
        return (item.redirect && this.headerMenus.includes(item.redirect))
          || (item.path && this.headerMenus.includes(item.path));
      });
    },
    bodyMenuItems() {
      console.log("*** sidebar routers: ", this.$store.getters.sidebarRouters);
      const res=  this.$store.getters.sidebarRouters.filter(item => {
        return (item.redirect && this.bodyMenus.includes(item.redirect))
          || (item.path && this.bodyMenus.includes(item.path));
      });

      console.log("*** sidebar routers: ", res);
      return res
    },
    footerMenuItems() {
      return this.$store.getters.sidebarRouters.filter(item => {
        return (item.redirect && this.footerMenus.includes(item.redirect))
          || (item.path && this.footerMenus.includes(item.path));
      });
    },
    isCollapse() {
      return !this.$store.getters.sidebar.opened;
    },
    activeMenu() {
      const route = this.$route;
      const {meta, path} = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  methods: {
    handleOpen(index) {
    },
    handleClose(key, keyPath) {
      // this.$refs.bodyMenus.open(keyPath);
    },
    toggleMenu() {
      this.$store.dispatch("app/toggleSideBar");
    },
    doPageRefresh() {
      this.$bus.$emit('goPageHome')
      this.$store.state.history.sidebarOpen = false;
      this.$store.state.mainPageChat.mode = 'newChat';
    },
    findMenuByPath(menuList, targetPath, basePath = '') {
      for (let item of menuList) {
        // 拼接完整的 path (处理子路由 path 不带 '/' 的情况)
        const itemPath = item.path.startsWith('/')
          ? item.path
          : `${basePath}/${item.path}`.replace(/\/\//g, '/');

        // 如果路径匹配成功，直接返回该菜单对象
        if (itemPath === targetPath) {
          return item;
        }

        // 如果有子节点，继续往下递归找
        if (item.children && item.children.length > 0) {
          const found = this.findMenuByPath(item.children, targetPath, itemPath);
          if (found) return found;
        }
      }
      return null;
    },
    handleOpenMenu(key, keyPath) {
      const menuItem = this.findMenuByPath(this.bodyMenuItems, key);

      if (menuItem && menuItem.redirect) {
        // 【新增逻辑】：智能判断，如果是相对路径，则帮它拼上父级 path 变成绝对路径
        let targetPath = menuItem.redirect;
        if (!targetPath.startsWith('/')) {
          targetPath = `${menuItem.path}/${targetPath}`.replace(/\/\//g, '/');
        }

        if (this.$route.path !== targetPath) {
          this.$router.push(targetPath).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              console.error(err);
            }
          });
        }
      }
    }
  },
}
</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden ">
    <div class="w-full flex justify-between items-center mb-8" v-if="isCollapse">
      <div class="w-full flex gap-2 items-center justify-center cursor-pointer" @click="toggleMenu">
        <el-tooltip popper-class="atooltip" effect="light" content="展开" placement="right" :visible-arrow="false">
          <svg-icon icon-class="logo" class="!w-[33px] !h-[36px]"/>
        </el-tooltip>
      </div>
    </div>
    <div v-else class="w-full flex justify-between items-center mb-8">
      <div class="flex gap-2 items-center">
        <svg-icon icon-class="logo" class="!w-[33px] !h-[36px]"/>
        <!-- <svg-icon icon-class="logo-text" class="!w-[64px] !h-[22px]"/> -->
        <b class="text-[#4A535D] text-[16px]">样本库质量管理平台</b>
      </div>
      <div @click="toggleMenu" class="cursor-pointer text-[#5F646C] hover:text-[#3662FF]">
        <svg-icon icon-class="sidebar" class="!w-[24px] !h-[24px]"/>
      </div>
    </div>
    <div class="w-full flex-1 flex flex-col items-stretch">
      <!-- <div class="w-full mb-3 2xl:mb-5">
        <el-menu ref="headerMenus" mode="vertical" class="custom-menu" :collapse-transition="false"
                 :default-active="activeMenu"
                 :collapse="isCollapse" :unique-opened="false">
            <SideItem v-for="(routeItem, index) in headerMenuItems" :key="routeItem.path + index"
                      :route-item="routeItem" :base-path="routeItem.path"
                      :do-click="doPageRefresh"/>
        </el-menu>
      </div> -->

      <div class="flex-1 overflow-x-hidden overflow-y-scroll hide-scroll-bar">
        <el-menu ref="bodyMenus" mode="vertical" class="custom-menu" :collapse-transition="false"
                 :openeds.sync="openMenus"
                 @open="handleOpenMenu"
                 :default-active="activeMenu"
                 :collapse="isCollapse" :unique-opened="false">
          <SideItem v-for="(routeItem, index) in bodyMenuItems" :key="routeItem.path + index"
            :route-item="routeItem" :base-path="routeItem.path" :do-click="doPageRefresh"/>
        </el-menu>
      </div>
      <div>
        <el-menu ref="footerMenus" mode="vertical" class="custom-menu" :collapse-transition="false"
                 :default-active="activeMenu"
                 :collapse="isCollapse" :unique-opened="false">
          <SideItem v-for="(routeItem, index) in footerMenuItems" :key="routeItem.path + index"
                    :route-item="routeItem" :base-path="routeItem.path" :do-click="doPageRefresh"/>
        </el-menu>
      </div>
      <div class="w-full flex justify-center items-center" v-if="isCollapse">
        <div @click="toggleMenu" class="cursor-pointer text-[#5F646C] hover:text-[#3662FF]">
          <svg-icon icon-class="sidebar1" class="!w-[24px] !h-[24px]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-menu {
  border-right: none !important;
}

.side-menu-dropdown {
  border-radius: 8px;
  margin: 0;
  margin-left: 4px;
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus {
    background-color: #f2f3f5;
    color: #1d2129;
  }
  ::v-deep .el-dropdown-menu__item {
    padding: 8px 16px;
    border-radius: 8px;
    color: #4e5969;
  }
  ::v-deep .popper__arrow {
    display: none;
  }
}
.side-menu-dropdown.el-dropdown-menu--medium {
  padding: 4px;
}

</style>

<style>

.atooltip {
  background: #fff !important;
  color: #5F646C !important;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #fff !important;
}
</style>
