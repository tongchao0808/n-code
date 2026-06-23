<template>
  <div class="h-full w-full flex flex-col overflow-hidden">
    <div class="editor" ref="editor" :style="styles"></div>
  </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { mergeHeaderIntoTbody } from "./parseData.js";
import { Document } from 'docx';
import htmlToDocx from 'html-to-docx';
import { saveAs } from 'file-saver';

export default {
  name: "Editor",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: 0,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      time: null,
      quill: null,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          table: true,
          // 工具栏配置
          toolbar: {
            container: [
              [{header: [1, 2, 3, 4, 5, 6, false]}], //几级标题
              ["wordBox", "bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              ["blockquote"], //引用，代码块
            //   [{header: 1}, {header: 2}], // 标题，键值对的形式；1、2表示字体大小
              [{list: "ordered"}, {list: "bullet"}], //列表
              [{script: "sub"}, {script: "super"}], // 上下标
              [{indent: "-1"}, {indent: "+1"}], // 缩进
            //   [{direction: "rtl"}], // 文本方向
            //   [{'size': ['12px', '14px', '16px', '20px', '24px', '32px']}], // 字体大小
              [{color: []}, {background: []}], // 字体颜色，字体背景颜色
            //   [{'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial']}], //字体
              [{align: []}], //对齐方式
              ["clean"], //清除字体样式
              ["image"], //上传图片、上传视频
              [
                {table: 'TD'},
                {'table-insert-row': 'TIR'},
                {'table-insert-column': 'TIC'},
                {'table-delete-row': 'TDR'},
                {'table-delete-column': 'TDC'}
              ],
              ['save', 'download']
            ],
            handlers: {
              //实现首行缩进的功能
              wordBox: function (val) {
                let range = this.quill.getSelection();
                this.quill.insertText(range.index, '\t', {'style': 'text-indent: 2em;'});
              },
              // 保存
              save: () => {
                this.$emit('save', String(this.quill.root.innerHTML), () => {
                  // 保存成功后，禁用保存按钮
                  this.elementDisabledState(document.querySelector('.ql-save'), true);
                });
              },
              // 下载
              download: async () => {
                // html转换为docx并下载
                  const htmlContent = this.quill.root.innerHTML;
                  const fullHtml = `
                                    <!DOCTYPE html>
                                    <html>
                                      <head>
                                        <meta charset="UTF-8">
                                        <style>
                                          /* 可添加自定义样式，确保 DOCX 格式一致 */
                                          p { margin: 0 0 12px 0; }
                                          strong { font-weight: bold; }
                                          em { font-style: italic; }
                                          ul, ol { margin: 0 0 12px 24px; }
                                        </style>
                                      </head>
                                      <body>${htmlContent}</body>
                                    </html>
                                  `;
                  const options = {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 英寸 = 1440 缇
                    orientation: 'portrait'
                  };
                  const docxBuffer = await htmlToDocx(fullHtml, null, options);
                  saveAs(new Blob([docxBuffer]), '下载.docx');
              },
              //增加表格
              table: function (val) {
                this.quill.getModule('table').insertTable(2, 3)
              },
              //插入行
              'table-insert-row': function () {
                this.quill.getModule('table').insertRowBelow()
              },
              //插入列
              'table-insert-column': function () {
                this.quill.getModule('table').insertColumnRight()
              },
              //删除行
              'table-delete-row': function () {
                this.quill.getModule('table').deleteRow()
              },
              //删除列
              'table-delete-column': function () {
                this.quill.getModule('table').deleteColumn()
              }
            }
          }
        },
        placeholder: "请输入内容",
      },
      // 图标显示对应的文字提示
      titleConfig: [
        {Choice: '.ql-wordBox', title: '首行缩进'},
        {Choice: '.ql-save', title: '保存'},
        {Choice: '.ql-download', title: '下载'},
        {Choice: '.ql-insertMetric', title: '跳转配置'},
        {Choice: '.ql-bold', title: '加粗'},
        {Choice: '.ql-italic', title: '斜体'},
        {Choice: '.ql-underline', title: '下划线'},
        {Choice: '.ql-header', title: '段落格式'},
        {Choice: '.ql-strike', title: '删除线'},
        {Choice: '.ql-blockquote', title: '块引用'},
        {Choice: '.ql-code', title: '插入代码'},
        {Choice: '.ql-code-block', title: '插入代码段'},
        {Choice: '.ql-font', title: '字体'},
        {Choice: '.ql-size', title: '字体大小'},
        {Choice: '.ql-list[value="ordered"]', title: '编号列表'},
        {Choice: '.ql-list[value="bullet"]', title: '项目列表'},
        {Choice: '.ql-direction', title: '文本方向'},
        {Choice: '.ql-header[value="1"]', title: 'h1'},
        {Choice: '.ql-header[value="2"]', title: 'h2'},
        {Choice: '.ql-align', title: '对齐方式'},
        {Choice: '.ql-color', title: '字体颜色'},
        {Choice: '.ql-background', title: '背景颜色'},
        {Choice: '.ql-image', title: '图像'},
        {Choice: '.ql-video', title: '视频'},
        {Choice: '.ql-link', title: '添加链接'},
        {Choice: '.ql-formula', title: '插入公式'},
        {Choice: '.ql-clean', title: '清除字体格式'},
        {Choice: '.ql-script[value="sub"]', title: '下标'},
        {Choice: '.ql-script[value="super"]', title: '上标'},
        {Choice: '.ql-indent[value="-1"]', title: '向左缩进'},
        {Choice: '.ql-indent[value="+1"]', title: '向右缩进'},
        {Choice: '.ql-header .ql-picker-label', title: '标题大小'},
        {Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐'},
        {Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐'},
        {Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐'},
        {Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐'},
        {Choice: '.ql-table', title: '添加表格'},
        {Choice: '.ql-table-insert-row', title: '插入行'},
        {Choice: '.ql-table-insert-column', title: '插入列'},
        {Choice: '.ql-table-delete-row', title: '删除行'},
        {Choice: '.ql-table-delete-column', title: '删除列'},
      ]
    }
  },
  computed: {
    styles() {
      // 设置宽高
      let style = {width: '100%', flex: '1 1 auto', height: 'auto', overflow: 'auto'};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.currentValue) {
          this.currentValue = (val === null || val === '<p><br></p>') ? "" : mergeHeaderIntoTbody(val);
          if (this.quill) {
            this.quill.clipboard.dangerouslyPasteHTML(this.currentValue);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.quill = null;
  },
  methods: {
    init() {
      // 初始化	
      const editor = this.$refs.editor;
      this.quill = new Quill(editor, this.options);
      this.quill.clipboard.dangerouslyPasteHTML(this.currentValue);
      this.quill.on("text-change", (delta, oldDelta, source) => {
        let html = this.$refs.editor.children[0].innerHTML;
        if (html.indexOf('<table>') !== -1) {
        //这里是特殊处理，因为是邮件模板，保存的html会丢失表格样式，需要在内容前面加上
         let _class = "<head>"
          +"<style>"
          +"table {table-layout: fixed; width: 100%; border-collapse: collapse; }"
          +"td, th { padding: 2px 5px; border: 1px solid #000; outline: none; display: table-cell; vertical-align: inherit; unicode-bidi: isolate;}"
          +"img { max-width: 100%; height: auto; }"
          +"</style>"
          +"</head>";
          html = _class + html;
        }
        this.currentValue = html;
        const text = this.quill.getText();
        const quill = this.quill;
        this.$emit("input", html);
        this.$emit("on-change", {html, text, quill});
      });
      this.quill.on("text-change", (delta, oldDelta, source) => {
        document.querySelector('.ql-save') && this.elementDisabledState(document.querySelector('.ql-save'), false);
        // 防抖处理，避免频繁触发
        if (this.time) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          this.options.modules.toolbar.handlers.save();
          this.$emit("on-text-change", delta, oldDelta, source);
        }, 5000);
      });
      this.quill.on("selection-change", (range, oldRange, source) => {
        this.$emit("on-selection-change", range, oldRange, source);
      });
      this.quill.on("editor-change", (eventName, ...args) => {
        this.$emit("on-editor-change", eventName, ...args);
      });
	  // 首行缩进的图标
      this.registerButtonEvent('.ql-wordBox', '<i class="el-icon-s-unfold"/>')
      this.registerButtonEvent('.ql-save', '<i class="el-icon-document-checked"/>')
      this.registerButtonEvent('.ql-download', '<i class="el-icon-download"/>')
      // 鼠标悬浮在图标上显示对应的标题
      this.titleConfig.forEach(item => {
        const tip = document.querySelector(item.Choice)
        if (tip) {
          tip.setAttribute('title', item.title)
        }
      });
    },
    // 自定义按钮注册事件
    registerButtonEvent(className, htmlText) {
      if(!document.querySelector(className)) {
        return;
      }
      const element = document.querySelector(className);
      element.innerHTML = htmlText;

      // 保存按钮初始化时禁用
      if(className === '.ql-save') {
        this.elementDisabledState(document.querySelector('.ql-save'), true)
      }
    },
    elementDisabledState(element, state) {
      element.disabled = state;
      element.classList.toggle('ql-disabled', state);
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .ql-toolbar {
    // 要与styles()方法中的width保持一致
    width: 100%; 
  }

  .ql-disabled {
    color: #c0c4cc;
    cursor: default !important;

    &:hover {
      color: #c0c4cc !important;
    }
  }
  
  // 设置字体和字体大小
  .ql-picker.ql-font {
    .ql-picker-label[data-value="SimSun"]::before,
    .ql-picker-item[data-value="SimSun"]::before {
      content: "宋体";
      font-family: "SimSun" !important;
    }

    .ql-picker-label[data-value="SimHei"]::before,
    .ql-picker-item[data-value="SimHei"]::before {
      content: "黑体";
      font-family: "SimHei";
    }

    .ql-picker-label[data-value="Microsoft-YaHei"]::before,
    .ql-picker-item[data-value="Microsoft-YaHei"]::before {
      content: "微软雅黑";
      font-family: "Microsoft YaHei";
    }

    .ql-picker-label[data-value="KaiTi"]::before,
    .ql-picker-item[data-value="KaiTi"]::before {
      content: "楷体";
      font-family: "KaiTi" !important;
    }

    .ql-picker-label[data-value="FangSong"]::before,
    .ql-picker-item[data-value="FangSong"]::before {
      content: "仿宋";
      font-family: "FangSong";
    }
  }

  .ql-picker.ql-header {
    .ql-picker-label[data-value="1"]::before,
    .ql-picker-item[data-value="1"]::before {
      content: '一级标题';
    }
    
    .ql-picker-label[data-value="2"]::before,
    .ql-picker-item[data-value="2"]::before {
      content: '二级标题';
    }
    
    .ql-picker-label[data-value="3"]::before,
    .ql-picker-item[data-value="3"]::before {
      content: '三级标题';
    }
    
    .ql-picker-label[data-value="4"]::before,
    .ql-picker-item[data-value="4"]::before {
      content: '四级标题';
    }
    
    .ql-picker-label[data-value="5"]::before,
    .ql-picker-item[data-value="5"]::before {
      content: '五级标题';
    }
    
    .ql-picker-label[data-value="6"]::before,
    .ql-picker-item[data-value="6"]::before {
      content: '六级标题';
    }
    
    .ql-picker-label::before,
    .ql-picker-item::before {
      content: '标准';
    }
  }

  .ql-picker.ql-size {
    .ql-picker-label[data-value="12px"]::before,
    .ql-picker-item[data-value="12px"]::before {
      content: '12px';
    }

    .ql-picker-label[data-value="14px"]::before,
    .ql-picker-item[data-value="14px"]::before {
      content: '14px';
    }

    .ql-picker-label[data-value="16px"]::before,
    .ql-picker-item[data-value="16px"]::before {
      content: '16px';
    }

    .ql-picker-label[data-value="20px"]::before,
    .ql-picker-item[data-value="20px"]::before {
      content: '20px';
    }

    .ql-picker-label[data-value="24px"]::before,
    .ql-picker-item[data-value="24px"]::before {
      content: '24px';
    }

    .ql-picker-label[data-value="32px"]::before,
    .ql-picker-item[data-value="32px"]::before {
      content: '32px';
    }

    .ql-snow & {
      .ql-picker-label[data-value="32px"]::before,
      .ql-picker-item[data-value="32px"]::before {
        content: '32px';
      }
    }
  }

  // 设置表格操作的几个按钮图标，可以在 www.iconfont.cn 找
  .ql-toolbar {
    .ql-table-insert-row {
      background-image: url(~@/assets/images/custom/table-insert-row.svg);
      background-size: 14px 14px;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    .ql-table-insert-column {
      background-image: url(~@/assets/images/custom/table-insert-col.svg);
      background-size: 14px 14px;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    .ql-table-delete-row {
      background-image: url(~@/assets/images/custom/table-delete-row.svg);
      background-size: 14px 14px;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    .ql-table-delete-column {
      background-image: url(~@/assets/images/custom/table-delete-col.svg);
      background-size: 14px 14px;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

::v-deep {
    .ql-toolbar.ql-snow {
        border: 0;
        border-radius: 8px;
        /* 投影1 */
        box-shadow: 0px 5px 7px 1px rgba(108, 118, 155, 0.05), 0px 4px 4px 0px rgba(65, 114, 209, 0.08);
        background: var(--白色背景-FFFFFF, rgba(255, 255, 255, 1));
    }

    .ql-container.ql-snow {
        border: 0;
        flex: 1;
        overflow-y: auto;
    }

}
</style>
