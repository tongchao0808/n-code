<template>
  <div
    v-if="showImage"
    ref="dragWrapper"
    class="draggable-wrapper"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
  >
    <img
      src="@/assets/images/yxy-s.png"
      alt="研小样"
      class="draggable-img"
      draggable="false"
    />
  </div>
</template>

<script>
export default {
  name: "DraggableImage",
  data() {
    return {
      isDragging: false,
      position: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
      // 记录鼠标按下时的初始坐标，用于判断是点击还是拖拽
      startX: 0,
      startY: 0,
      // 【配置项1】：在这里配置你不希望显示悬浮图的页面路径（精确匹配）
      hiddenRoutes: ["/agent/agentMain"],
    };
  },
  computed: {
    // 根据当前路由判断是否显示
    showImage() {
      // 如果当前路由路径在黑名单里，则不显示 (返回 false)
      return !this.hiddenRoutes.includes(this.$route.path);
    },
  },
  mounted() {
    // 默认定位到右上角
    this.position.x = window.innerWidth - 80 - 20;
    this.position.y = 20;
  },
  methods: {
    startDrag(e) {
      this.isDragging = true;
      this.dragOffset.x = e.clientX - this.position.x;
      this.dragOffset.y = e.clientY - this.position.y;

      // 记录点击时的初始位置
      this.startX = e.clientX;
      this.startY = e.clientY;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(e) {
      if (!this.isDragging) return;

      let newX = e.clientX - this.dragOffset.x;
      let newY = e.clientY - this.dragOffset.y;

      const wrapper = this.$refs.dragWrapper;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        // 防止拖出屏幕外
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;
      }

      this.position.x = newX;
      this.position.y = newY;
    },
    stopDrag(e) {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);

      // 计算鼠标松开时与按下时的移动距离
      const moveX = Math.abs(e.clientX - this.startX);
      const moveY = Math.abs(e.clientY - this.startY);

      // 如果 X 和 Y 方向的移动距离都小于 5 像素，说明用户没有拖拽，只是“点击”了一下
      if (moveX < 5 && moveY < 5) {
        this.handleClick();
      }
    },
    handleClick() {
      // 【配置项2】：填写你要跳转的目标页面路径
      const targetPath = "/agent/agentMain";

      // 判断一下如果当前已经在该页面，就不再重复跳转，防止控制台报 NavigationDuplicated 错误
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).catch((err) => {
          // 捕获路由跳转可能产生的静默错误
          console.log(err);
        });
      }
    },
  },
};
</script>

<style scoped>
.draggable-wrapper {
  position: fixed;
  z-index: 9999;
  cursor: pointer; /* 默认显示手指图标，表示可点击 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s; /* 点击时稍微加个动画效果，提升体验 */
}

.draggable-wrapper:active {
  transform: scale(0.95); /* 点击时微微缩小 */
  cursor: grabbing; /* 拖拽时变为抓取图标 */
}

.draggable-img {
  width: 80px;
  height: auto;
  display: block;
  pointer-events: none;
}
</style>
