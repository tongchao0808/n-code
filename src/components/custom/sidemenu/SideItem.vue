<script>
import {isExternal} from "@/utils/validate";
import path from "path";
import AppLink from "@/layout/components/Sidebar/Link.vue";
import Item from "@/layout/components/Sidebar/Item.vue";

export default {
  name: "SideItem",
  components: {Item, AppLink},
  props: {
    routeItem: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    doClick: {type: Function, required: false},
  },
  data() {
     this.onlyOneChild = null;
    return {
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        }
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
        return true
      }

      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return {path: path.resolve(this.basePath, routePath), query: query}
      }
      return path.resolve(this.basePath, routePath);
    }
  }
}
</script>

<template>
  <div v-if="!routeItem.hidden">
    <template v-if="hasOneShowingChild(routeItem.children, routeItem)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item v-if="hasOneShowingChild" :index="resolvePath(onlyOneChild.path)"
                      class="custom-item" @click="() => {doClick !== undefined ? doClick() : null}">
          <svg-icon :icon-class="onlyOneChild.meta.icon" class-name="!w-[22px] !h-[22px]"/>
          <span class="text-[14px]" v-if="$store.getters.sidebar.opened || isNest">{{ onlyOneChild.meta.title }}</span>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(routeItem.path)" popper-append-to-body>
      <div slot="title" v-if="routeItem.meta" class="sub-menu-title">
        <svg-icon :icon-class="routeItem.meta.icon" class-name="!w-[22px] !h-[22px]"/>
        <span class="text-[14px]" v-if="$store.getters.sidebar.opened || isNest">{{ routeItem.meta.title }}</span>
      </div>
      <SideItem v-for="(child, index) in routeItem.children" :key="child.path + index"
                :is-nest="true" :route-item="child" :base-path="resolvePath(child.path)" :do-click="doClick"
                class="custom-nest-menu"/>
    </el-submenu>
  </div>
</template>

<style scoped lang="scss">
.custom-item {
  height: 42px !important;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  color: #1D2129;

  &:hover {
    background-color: #F2F3F5 !important;
  }
}

::v-deep .custom-item.is-active {
  color: #3662FF !important;
  font-weight: bold;
  background: #E8EFFF !important;
}

.custom-nest-menu {

}

.sub-menu-title {
  height: 42px !important;
  line-height: 42px !important;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  color: #1D2129;
}

.el-submenu {
  ::v-deep .el-submenu__title {
    height: 42px !important;
    line-height: 42px !important;
    border-radius: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    color: #1D2129;

    &:hover {
      background-color: #F2F3F5 !important;
    }
  }

  ::v-deep .el-submenu__icon-arrow {
    display: none !important;
  }
}
</style>
