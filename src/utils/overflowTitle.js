class OverflowTitle {
  constructor(selector = '.overflow-box') {
    this.selector = selector;
    this.observer = null;
    this.resizeTimer = null;
    this.mutationObserver = null;
    this.init();
  }

  // 核心：判断元素是否溢出
  isElementOverflow(element) {
    if (!element.offsetParent) return false;
    // +1 容错：避免边框/内边距导致的尺寸误差
    const horizontalOverflow = element.scrollWidth > element.clientWidth + 1;
    const verticalOverflow = element.scrollHeight > element.clientHeight + 1;
    return horizontalOverflow || verticalOverflow;
  }

  // 提取纯文本（排除 HTML 标签）
  getElementText(element) {
    return element.textContent.trim();
  }

  // 更新单个元素的 title
  updateElementTitle(element) {
    const text = this.getElementText(element);
    if (this.isElementOverflow(element) && text) {
      element.title = text;
    } else {
      element.removeAttribute('title');
    }
  }

  // 批量检测所有目标元素
  checkAllElements() {
    const elements = document.querySelectorAll(this.selector);
    elements.forEach(el => this.updateElementTitle(el));
  }

  // 监听窗口缩放（防抖）
  setupResizeListener() {
    // 使用箭头函数确保this指向正确
    this.handleResize = () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.checkAllElements(), 100);
    };
    window.addEventListener('resize', this.handleResize);
  }

  // 监听元素尺寸变化
  setupResizeObserver() {
    if (!window.ResizeObserver) return;

    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        // 处理目标元素本身
        if (entry.target.matches(this.selector)) {
          this.updateElementTitle(entry.target);
        }
        // 处理目标元素内的匹配元素
        entry.target.querySelectorAll(this.selector).forEach(el => {
          this.updateElementTitle(el);
        });
      });
    });

    // 初始观察所有匹配元素
    document.querySelectorAll(this.selector).forEach(el => {
      observer.observe(el);
    });
    
    // 同时观察body以捕获新添加的元素
    observer.observe(document.body, { subtree: true });
    this.observer = observer;
  }

  // 使用MutationObserver监听DOM变化
  setupMutationObserver() {
    if (!window.MutationObserver) return;

    const observer = new MutationObserver(mutations => {
      // 标记是否有需要处理的变化
      let needsUpdate = false;
      
      mutations.forEach(mutation => {
        // 检查添加的节点
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            // 如果添加的节点是元素
            if (node.nodeType === 1) {
              // 如果节点本身匹配选择器
              if (node.matches(this.selector)) {
                needsUpdate = true;
              }
              // 如果节点包含匹配的子元素
              if (node.querySelectorAll(this.selector).length > 0) {
                needsUpdate = true;
              }
            }
          });
        }
        
        // 检查文本内容变化
        if (mutation.type === 'characterData') {
          const parentElement = mutation.target.parentElement;
          if (parentElement && parentElement.matches(this.selector)) {
            needsUpdate = true;
          }
        }
        
        // 检查属性变化
        if (mutation.type === 'attributes') {
          if (mutation.target.matches(this.selector)) {
            needsUpdate = true;
          }
        }
      });
      
      // 如果有需要处理的变化，更新所有元素
      if (needsUpdate) {
        // 使用微任务队列延迟执行，确保DOM更新完成
        setTimeout(() => this.checkAllElements(), 0);
      }
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    this.mutationObserver = observer;
  }

  // 提供手动更新方法，供Vue组件在需要时调用
  update() {
    this.checkAllElements();
  }

  init() {
    // 确保DOM完全加载后再初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._init());
    } else {
      this._init();
    }
  }

  _init() {
    this.checkAllElements(); // 初始检测
    this.setupResizeListener(); // 窗口缩放监听
    this.setupResizeObserver(); // 尺寸变化监听
    this.setupMutationObserver(); // DOM变化监听
    
    // 监听Vue路由变化，确保页面切换后也能正确处理
    if (window && window.addEventListener) {
      // 监听hash变化
      window.addEventListener('hashchange', () => {
        setTimeout(() => this.checkAllElements(), 100);
      });
      
      // 如果有Vue实例，尝试监听路由变化
      if (window.app && window.app.$router) {
        window.app.$router.afterEach(() => {
          setTimeout(() => this.checkAllElements(), 100);
        });
      }
    }
  }

  // 销毁监听
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }
}

// 导出单例
export const overflowTitle = new OverflowTitle('.overflow-box, .overflow-box-multi, .overflow-box-multi-2, .overflow-box-multi-3, .overflow-box-multi-4, .overflow-box-multi-5');

// 将实例挂载到window上，方便调试和手动调用
window.overflowTitle = overflowTitle;

export default OverflowTitle;