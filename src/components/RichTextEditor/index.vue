<template>
    <quill-editor v-model="content" ref="quillEditor" class="h-full flex flex-col" :options="editorOption" @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)" @change="onEditorChange($event)">
    </quill-editor>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'


export default {
    name: 'Note',
    props: {
        initContent: {
            type: String,
            default: ''
        }
    },
    components: {
        quillEditor
    },
    data() {
        return {
            content: ``, //双向数据绑定数据
            editorOption: {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], //几级标题
                        ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }], //有序列表，无序列表
                        // [{ 'script': 'sub' }, { 'script': 'super' }], //上标/下标
                        // [{ 'indent': '-1' }, { 'indent': '+1' }], //缩进
                        // [{ 'direction': 'rtl' }], //文本方向
                        // [{ 'size': ['small', false, 'large', 'huge'] }], //字体大小
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], //几级标题
                        // [{ 'color': [] }, { 'background': [] }], //字体颜色，字体背景颜色
                        // [{ 'font': [] }], //字体
                        // [{ 'align': [] }], //对齐方式
                        // ['clean'], //清除字体样式
                        // ['image', 'video'], //上传图片、上传视频
                    ]
                },
                placeholder: "输入笔记内容"
            }, //编辑器配置项
        }
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
        onEditorBlur() { }, // 失去焦点触发事件
        onEditorFocus() { }, // 获得焦点触发事件
        onEditorChange() {
            this.$emit('change', this.content)
         }, // 内容改变触发事件
    }
}
</script>

<style scoped lang="scss">
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