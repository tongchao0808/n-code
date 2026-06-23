<template>
  <div class="vue2-markdown-editor">
    <v-md-editor
      v-model="content"
      :mode="'edit'"
      :show-toolbar="true"
      :toolbar="toolbar"
      @save="onSave"
      placeholder="输入 Markdown 内容..."
    />
    <!-- <div class="w-full h-[40px] bg-[#fff] flex items-center justify-between px-[12px]">
      <div class="flex items-center justify-start w-full gap-[10px]">
        <el-button type="primary" size="mini" @click="onSave(content)">下载</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import Vue from 'vue';
import VMdEditor from '@kangc/v-md-editor';
// 正确引入主题（从核心包内部导入，无需单独安装）
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// 引入主题样式（从核心包内部导入）
import '@kangc/v-md-editor/lib/theme/style/github.css';

// 配置 Markdown 解析器
import markdownIt from 'markdown-it';
const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true
});
// 注册编辑器
Vue.use(VMdEditor.use(githubTheme, {
  markdownIt: md
}));

export default {
  name: 'MarkdownEditor',
  props: {
    initContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: ``,
      toolbar: {
        // 隐藏不需要的按钮（false 表示隐藏）
        code: false,         // 行内代码
        codeBlock: false,    // 代码块
      }
    };
  },
  watch: {
    initContent: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.content = newVal;
        }
      },
      immediate: true,
    }
  },
  methods: {
    onSave(content) {
      // this.$emit('save', content);
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep.vue2-markdown-editor {
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  max-width: 1000px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 400px;

  .v-md-editor {
    height: 100%;
    overflow: hidden;
  }

  .v-md-editor__right-area {
    height: 100%;
    overflow: hidden;
  }

  .v-md-editor__main {
    overflow-y: auto;
  }
}

/* 确保隐藏的按钮完全不占用空间 */
::v-deep .v-md-editor__toolbar-item-code {
  display: none !important;
}
</style>
    