<template>
  <div class="ai-rewrite-container" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
    <!-- 主按钮 -->
    <div class="ai-rewrite-button" :class="{ 'active': showDropdown }">
      <svg-icon icon-class="sparkles" class-name="!w-[16px] !h-[16px]"/>
      <span class="button-text">AI改写</span>
    </div>

    <!-- 下拉菜单 -->
    <transition name="dropdown">
      <div v-if="showDropdown" class="dropdown-menu">
        <div class="dropdown-item" @click="handleRewrite('全文润色')">
          <span class="item-text">润色</span>
        </div>
        <div class="dropdown-item" @click="handleRewrite('全文简写')">
          <span class="item-text">简写</span>
        </div>
        <div class="dropdown-item" @click="handleRewrite('全文扩写')">
          <span class="item-text">扩写</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "AIRewriteButton",
  props: {
    onRewrite: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showDropdown: false
    }
  },
  methods: {
    handleRewrite(question) {
      this.showDropdown = false;
      this.onRewrite(question);
    }
  }
}
</script>

<style scoped lang="scss">
.ai-rewrite-container {
  position: relative;
  display: inline-block;
}

.ai-rewrite-button {
  display: flex;
  align-items: center;
  width: auto;
  height: 32px;
  gap:10px;
  /* 自动布局 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 8px 5px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  border-radius: 8px;


  border: 1px solid transparent;

      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(to right, #fff, #fff), linear-gradient(180.00deg, rgba(192, 170, 253, 1),rgba(104, 137, 255, 1) 100%);
  // &:hover,
  // &.active {
  //   background: #EEF2FF;
  //   border-color: #C7D2FE;
  //   box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
  // }

  .button-text {
    font-size: 14px;
    font-weight: 500;
    background:linear-gradient(180.00deg, rgba(192, 170, 253, 1),rgba(104, 137, 255, 1) 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    text-fill-color:transparent;
    line-height: 1;
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E7EB;
  overflow: hidden;
  z-index: 1000;
  min-width: 120px;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #F3F4F6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #F9FAFB;
  }

  .item-text {
    font-size: 14px;
    color: #374151;
    font-weight: 400;
  }
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
