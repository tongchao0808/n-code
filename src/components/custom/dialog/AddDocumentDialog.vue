<script>
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import {createDoc, deleteDocs} from "@/api/custom/customKnowledgeBase";
import {formatFileSize} from "@/utils/misc";

export default {
  name: "AddDocumentDialog",
  components: {PrimaryButton, SecondaryButton},
  props: {
    kgId: {type: String, required: true},
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
  },
  data: function() {
    return {
      documents: [],
      fileToUpload: {},
      fileList: [],
      loading: false,
    }
  },
  mounted() {

  },
  methods: {
    formatFileSize,
    onChangeFile(file, fileList) {
      if (!file) {
        this.fileToUpload = null;
        this.documents = [];
        this.fileList = [];
        return;
      }
      file.title = file.name;
      this.fileToUpload = file;
      this.documents = [file];
      this.fileList = fileList;
    },

    // async doReadUploadFile(e) {
    //   console.log(e);
    //   const file = e.target.files[0];
    //   if (!file) return;
    //   const formData = new FormData();
    //   formData.append("file", file.raw);
    //   const doc = await createDoc(this.kgId, formData);
    //   this.$refs.fileRef.value = '';
    //   this.documents.push(doc);
    // },
    // onSelectFile() {
    //   this.$refs.fileRef.value = '';
    //   this.$refs.fileRef.click();
    // },

    onOkClick() {
      if (this.fileList.length === 0) {
        this.onOk(this.fileList);
        return;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append("file", this.fileToUpload.raw);
      formData.append("meta", new Blob([JSON.stringify({knowledgeDatabaseId:this.kgId,pathId:0})], {type: 'application/json'}));

      createDoc(formData).then(res => {
          this.loading = false;
          this.onOk(this.fileList);
      }).catch(err => {
        console.log("error upload file: ", err);
      });
    },

    async onDeleteFile(doc) {
      // const idx = this.documents.indexOf(doc);
      // if (idx >= 0) {
      //   const item = this.documents[idx];
      //   await deleteDocs([item.id]);
      //   this.documents.splice(idx, 1);
      // }
      this.documents = [];
      this.fileToUpload = {};
      this.fileList = [];
    },

    clearInput() {
      this.documents = [];
      this.fileToUpload = {};
      this.fileList = [];
      this.$forceUpdate();
    }
  },
  watch: {
    show: {
      handler: function(newVal) {
        if (newVal) {
          this.clearInput();
        }
      }
    }
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="400px" :modal-append-to-body="true"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">添加文档</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]" />
      </div>
    </div>
    <div class="w-full px-6 pt-[10px] pb-[20px] flex flex-col items-center">

      <div v-loading="loading" element-loading-text="上传中"
        class="w-full h-[100px] min-w-full flex flex-col justify-center">
        <el-upload drag multiple action="undefined" class="custom-uploader" accept=".doc,.docx,.txt,.pdf"
          :file-list="fileList" :on-change="onChangeFile" :on-remove="onChangeFile" :auto-upload="false"
          :show-file-list="false">
          <div
            class="w-full h-[100px] flex flex-col items-center justify-center bg-[#F2F3F580] rounded-lg mb-2 cursor-pointer">
            <svg-icon icon-class="add-document" style="width: 32px; height: 32px;" />
            <div class="text-[#1D2129] text-[12px] mt-1">点击添加</div>
            <div class="text-[#C9CDD4] text-[12px]">支持文件格式：.doc .docx .txt .pdf</div>
          </div>
        </el-upload>
      </div>

      <!--      <div class="w-full h-[100px] flex flex-col items-center justify-center border-[1px] border-[#C9CDD4] bg-[#F2F3F580] rounded-lg mb-2 cursor-pointer" @click.stop="onSelectFile">-->
      <!--        <svg-icon icon-class="add-document" style="width: 32px; height: 32px;" />-->
      <!--        <div class="text-[#1D2129] text-[12px] mt-1">点击添加</div>-->
      <!--        <div class="text-[#C9CDD4] text-[12px]">支持文件格式：.doc .docx .txt .pdf</div>-->
      <!--      </div>-->

      <div class="w-full max-h-[50vh] overflow-y-scroll hide-scroll-bar flex flex-col items-center">
        <div v-for="doc in fileList" :key="doc.uid"
          class="w-full h-52px flex flex-row items-center p-2 border-[1px] border-[#E5E6EB] my-2 rounded-lg">
          <svg-icon icon-class="icon-document" style="width: 36px; height: 36px;" class-name="mr-2" />
          <div class="flex flex-col items-start justify-between">
            <div class="text-[12px] text-[#4E5969]">{{ doc.title }}</div>
            <div class="text-[10px] text-[#86909C]">{{ formatFileSize(doc.size) }}</div>
          </div>
          <svg-icon icon-class="del-document" style="width: 17px; height: 17px;" class-name="ml-auto cursor-pointer"
            @click.stop="() => onDeleteFile(doc)" />
        </div>
      </div>
    </div>
    <div slot="footer" class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]">
      <div class="w-[74px] h-[32px]">
        <SecondaryButton text="取消" @click="onCancel" />
      </div>
      <div class="w-[74px] h-[32px]">
        <PrimaryButton text="确定" @click="onOkClick" />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.custom-dialog {
  padding: 0;

  ::v-deep .el-dialog {
    border-radius: 8px;
  }

  ::v-deep .el-dialog__header {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }
}

.custom-uploader {
  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
  }

  ::v-deep .el-upload-dragger {
    width: 100%;
    height: 100px;
  }
}
</style>
