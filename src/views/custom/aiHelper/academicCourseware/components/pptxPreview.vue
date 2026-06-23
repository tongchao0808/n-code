<template>
  <div class="pptx-list-preview">
    <!-- 列表容器（用于展示所有幻灯片） -->
    <div ref="listContainer" class="slides-list"></div>
  </div>
</template>

<script>
export default {
  name: 'PptxListPreview',
  props: {
    pptxUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pptxInstance: null
    };
  },
  mounted() {
    this.initPptxList();
  },
  beforeDestroy() {
    if (this.pptxInstance) {
      this.pptxInstance.destroy();
    }
  },
  methods: {
    initPptxList() {
      this.pptxInstance = new window.PPTXJS();

      // 初始化配置（关闭默认分页逻辑）
      this.pptxInstance.init({
        container: document.createElement('div'), // 临时容器（避免默认分页渲染）
        url: this.pptxUrl,
        width: '80%', // 单张幻灯片宽度（可自定义）
        height: 'auto',
        autoPlay: false,
        showNavigation: false // 隐藏默认导航栏
      });

      // 加载完成后手动处理幻灯片 DOM
      this.pptxInstance.on('loaded', (slidesCount) => {
        console.log('共', slidesCount, '页，开始列表展示');
        this.renderAsList();
      });

      this.pptxInstance.load().catch(err => {
        console.error('加载失败：', err);
      });
    },

    // 将所有幻灯片转为列表布局
    renderAsList() {
      const listContainer = this.$refs.listContainer;
      listContainer.innerHTML = ''; // 清空容器

      // 获取所有幻灯片的 DOM 元素（pptxjs 内部存储在 instance.slides 中）
      const allSlides = this.pptxInstance.slides || [];

      // 遍历幻灯片，添加到列表容器
      allSlides.forEach((slide, index) => {
        // 为每张幻灯片添加列表项样式
        const slideItem = document.createElement('div');
        slideItem.className = 'slide-item';
        slideItem.style.marginBottom = '20px'; // 幻灯片间距
        slideItem.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; // 阴影效果
        slideItem.style.padding = '10px';

        // 将幻灯片 DOM 放入列表项
        slideItem.appendChild(slide);
        listContainer.appendChild(slideItem);
      });
    }
  }
};
</script>

<style scoped>
.slides-list {
  width: 100%;
  max-width: 800px; /* 限制列表最大宽度 */
  margin: 0 auto;
  padding: 20px;
}

/* 确保幻灯片图片自适应容器 */
.slide-item img {
  max-width: 100%;
  height: auto;
}
</style>