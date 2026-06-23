<template>
  <div class="upload-container" @mouseenter="showDropdown = false" @mouseleave="showDropdown = false">
    <!-- 主按钮 -->
    <div class="upload-button" :class="{ 'active': showDropdown }" @click="handleAction('upload')">
      <svg-icon icon-class="file" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
    </div>

    <!-- 下拉菜单 -->
    <transition name="dropdown">
      <div v-if="showDropdown" class="dropdown-menu">
        <!-- <div class="dropdown-header">上传文件</div> -->

        <!-- 从云盘添加组 -->
        <div class="dropdown-group">
          <div class="group-header">从云盘添加</div>
          <div class="dropdown-item" @click="handleAction('selectCloudFile')">
            <svg-icon icon-class="note-more" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            <span class="item-text">选择云盘文件</span>
          </div>
        </div>

        <!-- 从本地添加组 -->
        <div class="dropdown-group">
          <div class="group-header">从本地添加</div>
          <div class="dropdown-item" @click="handleAction('localUpload')">
            <svg-icon icon-class="note-upload" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            <span class="item-text">本地上传</span>
          </div>
          <div class="dropdown-item" @click="handleAction('pasteText')">
            <svg-icon icon-class="paste" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
            <span class="item-text">粘贴文本</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "UploadButton",
  props: {
    onAction: {
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
    handleAction(type) {
      this.showDropdown = false;
      this.onAction(type);
    }
  }
}
</script>

<style scoped lang="scss">
.upload-container {
  position: relative;
  display: inline-block;
}

.upload-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E9ECEF;

  &:hover,
  &.active {
    background: #F9FAFB;
    border-color: #E5E7EB;
  }
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E7EB;
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
}

.dropdown-header {
  padding: 12px 16px 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

.dropdown-group {
  &:not(:last-child) {
    // border-bottom: 1px solid #F3F4F6;
  }
}

.group-header {
  padding: 8px 16px 4px;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  // background: #F9FAFB;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

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
  transform: translateY(8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
