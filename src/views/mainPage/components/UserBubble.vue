<script>
import { openFilePreview } from '@/utils/file';
export default {
  name: "UserBubble",
  props: {
    content: {type: String, required: true},
    attachments: {type: Array, required: false, default: () => []},
    pictures: {type: Array, required: false, default: () => []},
  },
  data() {
    return {
      hoverIndex: -1, // 当前hover的文件索引
    }
  },
  methods: {
    // 生成文件图标路径
    handleSrc(nameExt) {
      return require(`@/assets/images/${nameExt}.svg`);
    },

    // 鼠标进入文件项
    handleMouseEnter(index) {
      this.hoverIndex = index;
    },

    // 鼠标离开文件项
    handleMouseLeave() {
      this.hoverIndex = -1;
    },
    // 点击文件项
    handleClick(url) {
      openFilePreview(url);
    },
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-end gap-[10px]">
    <div class="file-List w-full flex justify-end gap-[10px] flex-wrap">
        <div v-for="(file, index) in attachments" :key="file.taskId+'_'+index" @click="handleClick(file.url)" class="file-item" @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave" :class="{ 'hover': hoverIndex === index }">
          <img style="width:32px;height:32px;margin-right:10px;" :src="handleSrc(file.nameExt)">
          <div class="flex flex-col items-start justify-start w-[146px] h-[39px]">
            <span class="text-[#1D2129] text-[14px] line-height-[18px] overflow-ellipsis" :title="file.name">{{ file.name }}</span>
            <span class="text-[#959BA1] text-[12px] line-height-[15px]">{{ file.nameExt }}</span>
          </div>
        </div>
    </div>
    <div class="max-w-[80%] py-[14px] px-[16px] rounded-tl-[8px] rounded-bl-[8px] rounded-br-[8px] bg-[#E8EFFF]">
    <div class="break-words text-[14px] leading-[18px] font-ms-yahei">
      {{ content }}
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.file-item {
  width: 220px;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background-color: #F5F8FF;
  border-radius: 8px;
  transition: all 0.2s;
}

.file-item.hover {
  background-color: #f5f7fa;
}

.overflow-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}
</style>
