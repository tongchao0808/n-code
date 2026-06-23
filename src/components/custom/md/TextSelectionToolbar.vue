<template>
  <div
    v-if="visible"
    class="text-selection-toolbar"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      transform: 'translateX(-50%)',
    }"
    @click.stop
  >
    <!-- AI改写按钮 -->
    <AIRewriteButton :onRewrite="handleAIOption" />

    <!-- 分隔线 -->
    <div class="separator"></div>

    <!-- 格式化按钮组 -->
    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('bold')"
      title="加粗"
    >
      <strong>B</strong>
    </button>

    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('italic')"
      title="斜体"
    >
      <em>I</em>
    </button>

    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('underline')"
      title="下划线"
    >
      <span style="text-decoration: underline; font-weight: bold">U</span>
    </button>

    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('strikethrough')"
      title="删除线"
    >
      <span style="text-decoration: line-through; font-weight: bold">S</span>
    </button>

    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('orderedList')"
      title="有序列表"
    >
      <svg-icon icon-class="icon-ol" class-name="!w-[24px] !h-[24px]" />
    </button>

    <button
      class="toolbar-btn format-btn"
      @click="formatSelectedText('unorderedList')"
      title="无序列表"
    >
      <svg-icon icon-class="icon-ul" class-name="!w-[24px] !h-[24px]" />
    </button>

    <!-- 分隔线 -->
    <div class="separator"></div>

    <!-- 复制按钮 -->
    <button class="toolbar-btn copy-btn" @click="handleCopy" title="复制">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="8"
          height="8"
          stroke="currentColor"
          stroke-width="1.2"
          fill="none"
          rx="1"
        />
        <path
          d="M6 2V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1"
          stroke="currentColor"
          stroke-width="1.2"
          fill="none"
        />
      </svg>
      复制
    </button>
  </div>
</template>

<script>
import AIRewriteButton from "@/views/mainPage/components/AIRewriteButton.vue";

export default {
  name: "TextSelectionToolbar",
  components: {
    AIRewriteButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
    },
    selectedText: {
      type: String,
      default: "",
    },
  },

  data() {
    return {};
  },
  methods: {
    formatSelectedText(type) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      if (!selection.toString().trim()) return;

      try {
        if (this.isBasicFormat(type)) {
          this.toggleFormatClass(range, this.getFormatClassName(type));
        } else if (this.isListFormat(type)) {
          this.toggleListFormat(range, type === "orderedList" ? "ol" : "ul");
        }
      } catch (error) {
        console.error("格式化文本时出错:", error);
      } finally {
        this.clearSelectionAndEmit();
      }
    },

    // Helper methods
    isBasicFormat: (type) => ['bold', 'italic', 'underline', 'strikethrough'].includes(type),
    isListFormat: (type) => ['orderedList', 'unorderedList'].includes(type),
    getFormatClassName: (type) => `format-${type}`,

    clearSelectionAndEmit() {
      window.getSelection().removeAllRanges();
      this.$emit("content-changed");
    },

    // Toggle format class with simplified logic
    toggleFormatClass(range, className) {
      if (this.checkParentFormatClass(range, className)) {
        this.removeParentFormatClass(range, className);
        return;
      }

      const contents = range.extractContents();
      const hasFormat = this.hasFormatClass(contents, className);
      const cleanContent = this.removeFormatClass(contents, className);

      range.insertNode(hasFormat ? cleanContent : this.addFormatClass(cleanContent, className));
    },

    // Check if parent has format class
    checkParentFormatClass(range, className) {
      let parent = this.getElementFromRange(range);
      while (parent && parent !== document.body) {
        if (parent.classList?.contains(className)) return true;
        parent = parent.parentNode;
      }
      return false;
    },

    getElementFromRange: (range) => {
      const node = range.commonAncestorContainer;
      return node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
    },

    // Remove format class from parent
    removeParentFormatClass(range, className) {
      const formatParent = this.findFormatParent(range, className);
      if (!formatParent) return;

      formatParent.className.trim() === className
        ? this.unwrapElement(formatParent)
        : formatParent.classList.remove(className);
    },

    findFormatParent(range, className) {
      let parent = this.getElementFromRange(range);
      while (parent && parent !== document.body) {
        if (parent.classList?.contains(className)) return parent;
        parent = parent.parentNode;
      }
      return null;
    },

    unwrapElement(element) {
      const fragment = document.createDocumentFragment();
      while (element.firstChild) fragment.appendChild(element.firstChild);
      element.parentNode.replaceChild(fragment, element);
    },

    // Check if content has format class
    hasFormatClass(contents, className) {
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(contents.cloneNode(true));
      return !!tempDiv.querySelector(`.${className}`);
    },

    // Add format class to content
    addFormatClass(contents, className) {
      const span = document.createElement("span");
      span.className = className;
      span.appendChild(this.removeFormatClass(contents, className));
      return span;
    },

    // 合并相邻的相同格式类元素
    mergeAdjacentFormatElements(element, className) {
      if (!element.parentNode) return;

      const parent = element.parentNode;
      let prev = element.previousSibling;
      let next = element.nextSibling;

      // 合并前一个相邻的相同格式元素
      while (
        prev &&
        prev.nodeType === Node.ELEMENT_NODE &&
        prev.tagName === "SPAN" &&
        prev.className === className
      ) {
        while (prev.firstChild) {
          element.insertBefore(prev.firstChild, element.firstChild);
        }
        parent.removeChild(prev);
        prev = element.previousSibling;
      }

      // 合并后一个相邻的相同格式元素
      while (
        next &&
        next.nodeType === Node.ELEMENT_NODE &&
        next.tagName === "SPAN" &&
        next.className === className
      ) {
        while (next.firstChild) {
          element.appendChild(next.firstChild);
        }
        parent.removeChild(next);
        next = element.nextSibling;
      }
    },

    // 改进的移除格式类方法 - 递归移除所有嵌套
    removeFormatClass(contents, className) {
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(contents);

      // 使用循环来递归移除所有嵌套的格式类
      let hasRemovedElements = true;
      let iterations = 0;
      const maxIterations = 10; // 防止无限循环

      while (hasRemovedElements && iterations < maxIterations) {
        hasRemovedElements = false;
        iterations++;

        // 查找所有包含指定类的元素
        const elementsWithClass = Array.from(
          tempDiv.querySelectorAll(`.${className}`)
        );

        if (elementsWithClass.length > 0) {
          hasRemovedElements = true;

          elementsWithClass.forEach((el) => {
            // 如果元素只有这一个类，移除整个元素但保留内容
            if (el.className.trim() === className) {
              while (el.firstChild) {
                el.parentNode.insertBefore(el.firstChild, el);
              }
              el.parentNode.removeChild(el);
            } else {
              // 如果元素有多个类，只移除指定的类
              el.classList.remove(className);
            }
          });
        }
      }

      // 返回处理后的文档片段
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      return fragment;
    },

    // 改进的列表格式切换方法 - 防止嵌套和内容丢失
    toggleListFormat(range, listType) {
      // 检查是否在列表环境中
      const isInList = this.checkParentList(range);

      if (isInList) {
        const parentList = this.findParentList(range);
        if (parentList && parentList.tagName.toLowerCase() === listType) {
          // 如果在相同类型的列表中，移除列表格式
          this.removeParentList(range);
          return;
        } else if (parentList) {
          // 如果在不同类型的列表中，转换列表类型
          this.convertParentListType(parentList, listType);
          return;
        }
      }

      // 处理选中内容
      const contents = range.extractContents();
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(contents);

      // 保存原始内容作为备份
      const originalContent = tempDiv.cloneNode(true);

      const hasCurrentList = tempDiv.querySelector(listType);
      const hasOtherList = tempDiv.querySelector(
        listType === "ol" ? "ul" : "ol"
      );

      try {
        if (hasCurrentList) {
          // 移除当前列表格式
          this.removeListFormatFromContent(tempDiv);
        } else if (hasOtherList) {
          // 转换列表类型
          this.convertListType(tempDiv, listType);
        } else {
          // 创建新列表
          this.createListFromText(tempDiv, listType);
        }

        // 检查处理后是否还有内容
        if (!tempDiv.hasChildNodes() && originalContent.hasChildNodes()) {
          console.warn("内容在处理过程中丢失，使用原始内容");
          tempDiv.appendChild(originalContent.cloneNode(true));
        }
      } catch (error) {
        console.error("列表处理出错，使用原始内容:", error);
        tempDiv.innerHTML = "";
        tempDiv.appendChild(originalContent.cloneNode(true));
      }

      // 插入处理后的内容
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
    },

    // 检查是否在列表环境中
    checkParentList(range) {
      let parent = range.commonAncestorContainer;
      if (parent.nodeType === Node.TEXT_NODE) {
        parent = parent.parentNode;
      }

      while (parent && parent !== document.body) {
        if (
          parent.tagName &&
          (parent.tagName.toLowerCase() === "ol" ||
            parent.tagName.toLowerCase() === "ul")
        ) {
          return true;
        }
        parent = parent.parentNode;
      }
      return false;
    },

    // 找到父列表元素
    findParentList(range) {
      let parent = range.commonAncestorContainer;
      if (parent.nodeType === Node.TEXT_NODE) {
        parent = parent.parentNode;
      }

      while (parent && parent !== document.body) {
        if (
          parent.tagName &&
          (parent.tagName.toLowerCase() === "ol" ||
            parent.tagName.toLowerCase() === "ul")
        ) {
          return parent;
        }
        parent = parent.parentNode;
      }
      return null;
    },

    // 移除父列表 - 每个li转换为独立段落（改进版本）
    removeParentList(range) {
      const parentList = this.findParentList(range);
      if (parentList) {
        const listItems = Array.from(parentList.querySelectorAll("li"));

        // 确保有列表项才处理
        if (listItems.length === 0) {
          // 如果没有li，直接移除列表但保留其他内容
          const fragment = document.createDocumentFragment();
          while (parentList.firstChild) {
            fragment.appendChild(parentList.firstChild);
          }
          parentList.parentNode.insertBefore(fragment, parentList);
          parentList.parentNode.removeChild(parentList);
          return;
        }

        const fragment = document.createDocumentFragment();

        // 将每个li转换为p标签
        listItems.forEach((li, index) => {
          const paragraph = document.createElement("p");

          // 克隆li的内容而不是移动，避免丢失
          const liClone = li.cloneNode(true);
          while (liClone.firstChild) {
            paragraph.appendChild(liClone.firstChild);
          }

          // 如果段落为空，添加一个空格以保持结构
          if (!paragraph.textContent.trim()) {
            paragraph.appendChild(document.createTextNode("\u00A0")); // 不间断空格
          }

          fragment.appendChild(paragraph);

          // 在段落之间添加换行（除了最后一个）
          // if (index < listItems.length - 1) {
          //   fragment.appendChild(document.createElement("br"));
          // }
        });

        parentList.parentNode.insertBefore(fragment, parentList);
        parentList.parentNode.removeChild(parentList);
      }
    },

    // 转换父列表类型
    convertParentListType(parentList, targetListType) {
      const newList = document.createElement(targetListType);

      // 复制所有属性
      Array.from(parentList.attributes).forEach((attr) => {
        newList.setAttribute(attr.name, attr.value);
      });

      // 移动所有子元素
      while (parentList.firstChild) {
        newList.appendChild(parentList.firstChild);
      }

      // 替换原列表
      parentList.parentNode.insertBefore(newList, parentList);
      parentList.parentNode.removeChild(parentList);
    },

    // 从内容中移除列表格式 - 每个li转换为独立段落（改进版本）
    removeListFormatFromContent(container) {
      const lists = Array.from(container.querySelectorAll("ol, ul"));

      lists.forEach((list) => {
        const listItems = Array.from(list.querySelectorAll("li"));

        // 确保有列表项才处理
        if (listItems.length === 0) {
          // 如果没有li，保留列表的其他内容
          const fragment = document.createDocumentFragment();
          while (list.firstChild) {
            fragment.appendChild(list.firstChild);
          }
          if (fragment.hasChildNodes()) {
            list.parentNode.insertBefore(fragment, list);
          }
          list.parentNode.removeChild(list);
          return;
        }

        const fragment = document.createDocumentFragment();

        // 将每个li转换为p标签
        listItems.forEach((li, index) => {
          const paragraph = document.createElement("p");

          // 克隆li的内容而不是移动，避免丢失
          const liClone = li.cloneNode(true);
          while (liClone.firstChild) {
            paragraph.appendChild(liClone.firstChild);
          }

          // 如果段落为空，添加一个空格以保持结构
          if (!paragraph.textContent.trim()) {
            paragraph.appendChild(document.createTextNode("\u00A0")); // 不间断空格
          }

          fragment.appendChild(paragraph);

          // 在段落之间添加换行（除了最后一个）
          if (index < listItems.length - 1) {
            fragment.appendChild(document.createElement("br"));
          }
        });

        // 替换列表
        list.parentNode.insertBefore(fragment, list);
        list.parentNode.removeChild(list);
      });

      // 处理孤立的列表项 - 也转换为段落
      const orphanedItems = Array.from(container.querySelectorAll("li"));
      orphanedItems.forEach((li) => {
        const paragraph = document.createElement("p");

        // 克隆li的内容而不是移动，避免丢失
        const liClone = li.cloneNode(true);
        while (liClone.firstChild) {
          paragraph.appendChild(liClone.firstChild);
        }

        // 如果段落为空，添加一个空格以保持结构
        if (!paragraph.textContent.trim()) {
          paragraph.appendChild(document.createTextNode("\u00A0")); // 不间断空格
        }

        li.parentNode.insertBefore(paragraph, li);
        li.parentNode.removeChild(li);
      });
    },

    // 从文本创建列表 - 改进段落处理
    createListFromText(container, listType) {
      // 首先检查是否有段落元素
      const paragraphs = container.querySelectorAll("p");

      if (paragraphs.length > 0) {
        // 如果有段落，将每个段落转换为列表项
        const list = document.createElement(listType);

        Array.from(paragraphs).forEach((p) => {
          const li = document.createElement("li");

          // 复制段落的所有子节点到li
          while (p.firstChild) {
            li.appendChild(p.firstChild);
          }

          // 如果li为空，添加一个空格
          if (!li.textContent.trim()) {
            li.appendChild(document.createTextNode("\u00A0"));
          }

          list.appendChild(li);
        });

        // 清空容器并添加列表
        container.innerHTML = "";
        container.appendChild(list);
      } else {
        // 如果没有段落，使用原来的文本处理方式
        const text = container.textContent.trim();
        if (!text) return;

        container.innerHTML = "";
        const list = document.createElement(listType);

        // 按行分割文本创建列表项
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length === 0) {
          // 如果没有换行，创建单个列表项
          const li = document.createElement("li");
          li.textContent = text;
          list.appendChild(li);
        } else {
          lines.forEach((line) => {
            const li = document.createElement("li");
            li.textContent = line.trim();
            list.appendChild(li);
          });
        }

        container.appendChild(list);
      }
    },

    // 转换列表类型
    convertListType(container, targetListType) {
      const sourceListType = targetListType === "ol" ? "ul" : "ol";
      const sourceLists = container.querySelectorAll(sourceListType);

      sourceLists.forEach((list) => {
        const newList = document.createElement(targetListType);

        // 复制所有属性
        Array.from(list.attributes).forEach((attr) => {
          newList.setAttribute(attr.name, attr.value);
        });

        // 复制所有列表项到新列表
        while (list.firstChild) {
          newList.appendChild(list.firstChild);
        }

        // 替换原列表
        list.parentNode.insertBefore(newList, list);
        list.parentNode.removeChild(list);
      });
    },

    // 创建新列表
    createList(tempDiv, listType) {
      const textContent = tempDiv.textContent.trim();
      if (!textContent) return;

      // 按换行符分割文本
      const lines = textContent.split("\n").filter((line) => line.trim());

      if (lines.length === 0) return;

      // 清空容器
      tempDiv.innerHTML = "";

      // 创建新列表
      const listElement = document.createElement(listType);

      // 为每一行创建列表项
      lines.forEach((line) => {
        const listItem = document.createElement("li");
        listItem.textContent = line.trim();
        listElement.appendChild(listItem);
      });

      tempDiv.appendChild(listElement);
    },

    handleCopy() {
      navigator.clipboard.writeText(this.selectedText).then(() => {
        this.$emit("text-copied", this.selectedText);
      });
    },

    handleAIOption(option) {
      // 映射选项类型
      const typeMap = {
        polish: "润色",
        simplify: "简写",
        expand: "扩写",
      };

      this.$emit("ai-rewrite", {
        type: typeMap[option] || option,
        text: this.selectedText,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.text-selection-toolbar {
  position: fixed !important;
  background: white !important;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 6px 8px;
  display: flex !important;
  align-items: center;
  gap: 2px;
  z-index: 9999 !important;
  font-size: 14px;
  border: 1px solid #e1e5e9;
  min-height: 40px;
  visibility: visible !important;
  opacity: 1 !important;

  .toolbar-btn {
    border: none;
    background: transparent;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #333;
    font-size: 14px;
    transition: background-color 0.2s;
    min-height: 28px;
    white-space: nowrap;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #e8e8e8;
    }
  }

  .format-btn {
    width: 32px;
    height: 28px;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
  }

  .copy-btn {
    color: #666;
    font-size: 13px;
  }

  .separator {
    width: 1px;
    height: 20px;
    background-color: #e1e5e9;
    margin: 0 4px;
  }
}

// 格式化样式类 - 全局样式，不使用 scoped
:global(.format-bold) {
  font-weight: bold;
}

:global(.format-italic) {
  font-style: italic;
}

:global(.format-underline) {
  text-decoration: underline;
}

:global(.format-strikethrough) {
  text-decoration: line-through;
}
</style>
