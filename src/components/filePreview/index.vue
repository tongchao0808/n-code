<template>
  <div class="flex justify-center w-full h-full file-preview">
    <vue-office-docx v-if="fileType === 'docx'" :src="fileUrl" />
    <vue-office-excel v-else-if="fileType === 'xlsx'" :src="fileUrl" />
    <!-- <vue-office-pdf v-else-if="fileType === 'pdf'" :src="fileUrl" @rendered="handleLoad" /> -->
    <pdfPreview v-else-if="fileType === 'pdf' && !nativePdf" :src="fileUrl" />
  </div>
</template>

<script>
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";
import VueOfficeExcel from "@vue-office/excel";
import "@vue-office/excel/lib/index.css";
import VueOfficePdf from "@vue-office/pdf";
import pdfPreview from "./pdfPreview.vue";
export default {
  name: "FilePreview",
  props: {
    src: {
      type: String,
      default: "",
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    nativePdf: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf,
    pdfPreview,
  },
  data() {
    return {
      fileUrl: this.src || this.$route.params.fileUrl,
    };
  },
  computed: {
    fileType() {
      let fileType = this.fileUrl.split(".").pop();
      return fileType;
    },
  },
  mounted() {
    this.fileUrl = decodeURIComponent(this.fileUrl);
    if (this.fileType === "pdf" && this.nativePdf) {
      // 模拟a标签点击事件
      let a = document.createElement("a");
      a.href = this.fileUrl;
      a.click();
    }
  },
  methods: {
    handleLoad(pdf) {
      console.log("PDF加载完成:", pdf);
      // this.$emit('load', pdf)
    },
    handlePageChange(page) {
      this.$emit("page-change", page);
    },
    handleError(error) {
      console.error("PDF加载错误:", error);
      this.$emit("error", error);
    },
  },
};
</script>

<style scoped lang="scss">
.file-preview {
  /* 确保最外层容器在新窗口中也能铺满屏幕 */
  width: 100vw;
  height: 100vh;

  ::v-deep {
    .docx {
      // width: auto !important;
    }

    /* 新增：强制 Excel 容器铺满 */
    .vue-office-excel {
      width: 100% !important;
      height: 100% !important;

      /* 如果底层是 x-spreadsheet，有时候需要强制作业区域全宽 */
      .x-spreadsheet-sheet {
        width: 100% !important;
      }
      canvas {
        width: 100% !important;
      }
    }
  }
}
</style>
