<template>
  <div class="w-full upload-list-container" :style="{height: fileList.length > 0 ? '64px' : '0px'}">
    <!-- 左滚动箭头 -->
    <button class="scroll-arrow left-arrow" @click="scrollLeft" :class="{ 'hidden': !canScrollLeft }">
      <i class="arrow el-icon-arrow-left"></i>
    </button>

    <!-- 文件列表容器 -->
    <div class="scroll-container" ref="scrollContainer">
      <div class="fade-edge left-fade" :class="{ 'show': canScrollLeft }"></div>
      <div class="flex items-center justify-start" name="el-fade-in-linear">
        <div v-for="(file, index) in fileList" :key="file.taskId + '_' + index" @click="handleFileClick(file.url)"
          class="file-item" @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave"
          :class="{ 'hover': hoverIndex === index }">
          <img style="width:32px;height:32px;margin-right:10px;" :src="handleSrc(file.nameExt)">
          <div class="flex flex-col items-start justify-start w-[146px] h-[39px]">
            <span class="w-full text-[#1D2129] text-[14px] line-height-[18px] overflow-box">{{
              file.name }}</span>
            <span class="text-[#959BA1] text-[12px] line-height-[15px]">{{ file.nameExt }}</span>
          </div>
          <div class="delete-btn" v-show="hoverIndex === index" @click.stop.prevent="handleDelete(index)">
            <i class="el-icon-error"></i>
          </div>
        </div>
      </div>
      <div class="fade-edge right-fade" :class="{ 'show': canScrollRight }"></div>
    </div>

    <!-- 右滚动箭头 -->
    <button class="scroll-arrow right-arrow" @click="scrollRight" :class="{ 'hidden': !canScrollRight }">
      <i class="arrow el-icon-arrow-right"></i>
    </button>
  </div>
</template>

<script>
import { openFilePreview } from '@/utils/file';

export default {
  name: 'FileList',
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoverIndex: -1,
      canScrollLeft: false,
      canScrollRight: false,
    }
  },
  watch: {
    fileList() {
      this.$nextTick(() => {
        this.checkScrollStatus();
      });
    }
  },
  methods: {
    handleSrc(nameExt) {
      return require(`@/assets/images/${nameExt ? nameExt : 'txt'}.svg`);
    },
    // 删除文件
    handleDelete(index) {
      this.$emit('delete', this.fileList[index]);
      this.hoverIndex = -1;
      this.checkScrollStatus();
    },

    // 向左滚动
    scrollLeft() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: -150, behavior: 'smooth' });
    },

    // 向右滚动
    scrollRight() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: 150, behavior: 'smooth' });
    },

    // 检查滚动状态
    checkScrollStatus() {
      const container = this.$refs.scrollContainer;
      if (!container) return;

      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
      
    },

    // 处理鼠标进入
    handleMouseEnter(index) {
      this.hoverIndex = index;
    },

    // 处理鼠标离开
    handleMouseLeave() {
      this.hoverIndex = -1;
    },

    // 处理文件点击
    handleFileClick(url) {
      openFilePreview(url);
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.checkScrollStatus();
      const container = this.$refs.scrollContainer;
      if (container) {
        container.addEventListener('scroll', this.checkScrollStatus);
      }
    });
  },

  beforeUnmount() {
    const container = this.$refs.scrollContainer;
    if (container) {
      container.removeEventListener('scroll', this.checkScrollStatus);
    }
  }
}
</script>

<style scoped lang="scss">
.upload-list-container {
  position: relative;
  overflow: hidden;
}

.scroll-container {
  // position: relative;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  // scrollbar-width: none; /* 隐藏滚动条 */
  // -ms-overflow-style: none; /* IE和Edge */
  scrollbar-width: 2px;

  .fade-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 44px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 5;
}

.fade-edge.show {
  opacity: 1;
}

.left-fade {
  left: 0;
  background: linear-gradient(to right, #FFFFFFFF, #FFFFFF00);
}

.right-fade {
  right: 0;
  background: linear-gradient(to left, #FFFFFFFF, #FFFFFF00);
}
}
.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari和Opera */
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #C9CDD4;
  border: 1px solid #C9CDD4;
  border-radius: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.arrow {
  color: #fff;
  font-weight: bold;
}

.left-arrow {
  left: 0;
}

.right-arrow {
  right: 0;
}

.hidden {
  display: none;
}

.file-item {
  width: 220px;
  height: 64px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 12px 16px;
  margin-right: 10px;
  background-color: #F5F8FF;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.file-item.hover {
  background-color: #E8EFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #C9CDD4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: all 0.2s;
}

.delete-btn:hover {
  color: #959BA1;
}
</style>