<template>
  <div class="w-full h-full overflow-hidden">
        <RichTextEditor v-model="content" @save="onSave" />
  </div>
</template>

<script>
import { marked } from "marked";
import "github-markdown-css/github-markdown-light.css";
import RichTextEditor from '@/components/RichTextEditor/quillEditor.vue'

export default {
  name: "FileDetailPanel",
  props: {
    editContent: {
      type: String,
      default: ''
    }
  },
  components: {
    RichTextEditor
  },
  data() {
    return {
      content: '',
    }
  },
  watch: {
    editContent: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.content = this.parseContent(newVal);
        }
      },
      immediate: true,
    }
  },
  methods: {
    parseContent(content) {
      if(!content) return '';
      return marked(content);
    },
    onSave(content, callback) {
      this.$emit('save', content, callback);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
