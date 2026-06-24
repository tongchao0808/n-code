<script>
import { marked } from "marked";
import "github-markdown-css/github-markdown-light.css";
import TextSelectionToolbar from "./TextSelectionToolbar.vue";
import { isWriteMode } from "@/plugins/aiAnserConfig";

export default {
  name: "Markdown",
  components: {
    TextSelectionToolbar,
  },
  props: {
    content: { type: String, required: false, default: "" },
    selectedBubble: { type: Boolean, required: false, default: false },
  },
  computed: {
    isWriteMode() {
      return isWriteMode();
    },
  },
  data() {
    return {
      time: null,
      resizeTimer: null,
      internalContent: this.content,
      textSelection: {
        showToolbar: false,
        toolbarPosition: { x: 0, y: 0 },
        selectedText: "",
        selectionTimeout: null,
        selectionRange: null,
      },
    };
  },
  mounted() {
    this.registerResizeEvent();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  },
  watch: {
    content: {
      handler(newContent) {
        // 控制引用气泡显示位置
        this.internalContent = newContent;
        if (this.time) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          this.checkAllBubbleElements();

          this.registerEvent();
        }, 3000);
      },
    },
  },
  methods: {
    // 处理resize事件的回调函数
    handleResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.checkAllBubbleElements(), 100);
    },

    // 检查所有引用气泡位置
    checkAllBubbleElements() {
      const elements = document.getElementsByClassName("reference");
      Array.from(elements).forEach((item) => {
        if (this.calculateDistance(item).right < 440) {
          item.classList.remove("bubble-right");
          item.classList.add("bubble-left");
        } else {
          item.classList.remove("bubble-left");
          item.classList.add("bubble-right");
        }
      });
    },
    registerEvent() {
      if (!this.$refs.markdownBody) {
        return;
      }
      // 注册文件展示框的点击事件，点击后触发doSlideClick事件，传递文件id
      const slideBoxes = this.$refs.markdownBody.querySelectorAll(".slide-box");
      if (slideBoxes.length === 0) {
        return;
      }
      slideBoxes.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          this.$bus.$emit("doSlideClick", item.getAttribute("name"));
        });
      });
    },
    renderMarkdown(content) {
      if (content === undefined || content === null) {
        return "";
      }
      // 写作模式的Markdown内容不展示<Content>标签，会影响格式解析
      if (this.isWriteMode) {
        content = content
          .replaceAll("<Content>", "")
          .replaceAll("</Content>", "");
      }
      // 配置marked渲染器，为a标签添加target="_blank"
      const renderer = new marked.Renderer();
      renderer.link = function (href, title, text) {
        const link = marked.Renderer.prototype.link.call(
          this,
          href,
          title,
          text
        );
        // 为a标签添加target="_blank"
        return link.replace("<a ", '<a target="_blank" ');
      };
      return marked(content, { renderer: renderer });
    },
    // 处理内容更新
    handleContentUpdated() {
      this.textSelection.showToolbar = false;
      this.$emit("content-updated");
    },
    // 处理AI改写
    handleAIRewrite(data) {
      this.textSelection.showToolbar = false;
      this.$emit("ai-rewrite", data);
    },

    // 处理文本复制
    handleTextCopied(text) {
      this.textSelection.showToolbar = false;
      this.$emit("text-copied", text);
    },
    calculateDistance(targetEl) {
      if (!targetEl) return null;
      const rect = targetEl.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
      };
    },
    // 注册窗口resize事件
    registerResizeEvent() {
      window.addEventListener("resize", this.handleResize);
    },
  },
};
</script>

<template>
  <div class="markdown-container">
    <div
      ref="markdownBody"
      v-html="renderMarkdown(internalContent)"
      class="markdown-body"
    ></div>

    <!-- 文本选择工具栏 -->
    <TextSelectionToolbar
      :visible="textSelection.showToolbar"
      :position="textSelection.toolbarPosition"
      :selected-text="textSelection.selectedText"
      @content-updated="handleContentUpdated"
      @ai-rewrite="handleAIRewrite"
      @text-copied="handleTextCopied"
      @content-changed="handleContentUpdated"
    />
  </div>
</template>

<style scoped lang="scss">
.markdown-container {
  position: relative;
}

.markdown-body {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.markdown-body::v-deep {
  background-color: transparent !important;
  .think {
    color: #666;
    font-size: 14px;
  }
  position: relative;
  ol {
    list-style: decimal;
  }
  ul {
    list-style: disc;
  }
  .reference {
    position: relative;
  }
  .reference .reference-order {
    position: relative;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    color: #3662ff;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 500;
    background-color: #f5f8ff;
  }
  .reference .bubble-content {
    opacity: 0;
    transform: scale(0);
    transform-origin: left top;
    width: 400px;
    max-height: 200px;
    font-size: 12px;
    background-color: #fff;
    box-shadow: 0 5px 7px rgba(65, 114, 209, 0.08),
      0 9px 28px 8px rgba(108, 118, 155, 0.05);
    padding: 8px 12px;
    position: absolute;
    left: 0;
    top: 100%;
    border-radius: 8px;
    transition: all 0.3s;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 100;
    display: flex;
    flex-direction: column;

    .header {
      color: #959ba1;
      float: left;
      height: 21px;
      display: flex;
    }
    .main {
      color: #1d2129;
      flex: 1;
      overflow: auto;
      margin: 6px 0;
    }
    .footer {
      color: #5f646c;
      height: 28px;
      padding: 4px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      background-color: #f5f8ff;

      .document-name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
      }
    }
  }
  .bubble-left .bubble-content {
    left: auto;
    right: 0;
    transform-origin: right top;
  }
  .reference:hover {
    .reference-order {
      background-color: #e8efff;
    }
    .bubble-content {
      opacity: 1;
      transform: scale(1);
    }
  }

  .slide-box {
    max-width: 270px;
    padding: 18px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid #e5e6eb;
    cursor: pointer;
    position: relative;

    &:hover {
      background-color: #f9fafb;
    }

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background-image: url(~@/assets/images/custom/right-arrow.svg);
      background-size: cover;
    }
  }
}
.katex-content::v-deep .katex {
  font-size: 1.05em !important;
  line-height: 1.2;
}

.katex-content::v-deep .katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
