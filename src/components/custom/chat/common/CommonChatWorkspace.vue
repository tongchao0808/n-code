<script>
import KGSwitch from "@/components/custom/chat/common/KGSwitch.vue";
import DynamicHeightTextArea from "@/components/custom/form/DynamicHeightTextArea.vue";
import ModelChooser from "@/components/custom/chat/common/ModelChooser.vue";
import PreviewUploader from "@/components/custom/chat/common/PreviewUploader.vue";
import {removeAIChatFile, uploadAIChatFile} from "@/api/custom/chat";
import ChatSendButtonGroup from "@/components/custom/chat/ChatSendButtonGroup.vue";

export default {
  name: "CommonChatWorkspace",
  components: {ChatSendButtonGroup, PreviewUploader, ModelChooser, DynamicHeightTextArea, KGSwitch},
  props: {
    title: {type: String, required: true},
    form: {type: Object, required: false},
    forceReset: {type: Function, required: true},
    doRequest: {type: Function, required: true},
  },
  computed: {
    bindForm: {
      get() {
        return this.form;
      },
      set(nValue) {
        this.$emit("update:form", nValue);
      }
    }
  },
  methods: {
    upload(uploadType) {
      const _this = this;
      if (uploadType === "file") {
        return async ({file}) => {
          const formData = new FormData();
          formData.append("file", file);
          const uploadData = await uploadAIChatFile(formData);
          _this.bindForm = {
            ..._this.bindForm,
            files: [uploadData, ..._this.bindForm.files]
          };
        }
      } else {
        return async ({file}) => {
          const formData = new FormData();
          formData.append("file", file);
          const uploadData = await uploadAIChatFile(formData);
          _this.bindForm = {
            ..._this.bindForm,
            images: [uploadData, ..._this.bindForm.images]
          };
        }
      }
    },
    remove(uploadType) {
      const _this = this;
      if (uploadType === "file") {
        return async (objectItem) => {
          await removeAIChatFile(objectItem.id);
          const index = _this.bindForm.files.findIndex(item => item.id === objectItem.id);
          const container = [];
          for (let i = 0; i < _this.bindForm.files.length; i++) {
            if (i === index) { continue; }
            container.push(_this.bindForm.files[i]);
          }
          _this.bindForm = {
            ..._this.bindForm,
            files: container,
          }
        }
      } else {
        return async (objectItem) => {
          await removeAIChatFile(objectItem.id);
          const index = _this.bindForm.images.findIndex(item => item.id === objectItem.id);
          const container = [];
          for (let i = 0; i < _this.bindForm.images.length; i++) {
            if (i === index) { continue; }
            container.push(_this.bindForm.images[i]);
          }
          _this.bindForm = {
            ..._this.bindForm,
            images: container,
          }
        }
      }
    },
  },
  mounted() {

  }
}
</script>

<template>
  <div class="w-full h-full py-2 flex flex-col relative" v-if="bindForm">
    <div class="w-full px-6 text-[16px] text-[#3662FF] font-bold">{{ title && title }}</div>
    <div class="w-full px-6 flex-1">
      <el-form :model="bindForm">
        <el-form-item class="custom-form-item" label="内容输入区" props="content">
          <DynamicHeightTextArea v-model="bindForm.content"/>
        </el-form-item>
        <el-form-item class="custom-form-item" label="添加文件">
          <PreviewUploader mode="file" :upload="upload('file')" :remove="remove('file')"
                           :objects="bindForm.files"/>
        </el-form-item>
        <el-form-item class="custom-form-item" label="添加图片">
          <PreviewUploader mode="image" :upload="upload('image')" :remove="remove('image')"
                           :objects="bindForm.images"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-full">
      <div class="px-8">
        <KGSwitch v-model="bindForm.useKnowledge"/>
      </div>
      <div class="w-full h-[1px] bg-[#e5e6eb] mt-3 mb-4"></div>
      <div class="w-full px-8 flex gap-3">
        <ModelChooser v-model="bindForm.model"/>
        <ChatSendButtonGroup :send="doRequest" :reset="forceReset"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
