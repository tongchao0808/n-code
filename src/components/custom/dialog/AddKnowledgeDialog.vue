<script>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import {getKnowledgeBaseList, getUserKnowledgeList} from "@/api/custom/customKnowledgeBase";

export default {
  name: "AddKnowledgeDialog",
  components: {SecondaryButton, PrimaryButton},
  props: {
    mode: {type: String, required: true},
    sessionUniqueId: {type: String, required: true},
    chatTitle: {type: String, required: true},
    onAddNew: {type: Function, required: true},
    dataList: {type: Array, required: true},
    show: {type: Boolean, default: false},
    onOk: {type: Function, default: null},
    onCancel: {type: Function, default: null},
    width: {type: String, required: false, default: '400px'},
    message: {type: Object, required: false},
  },
  data() {
    return {
      selectedIds: [], // 修改为数组
      fileTitle: "",
      editMode: false,
    }
  },
  methods: {
    onAddNewClick() {
      this.onAddNew();
    },
    refreshDefault() {
      this.fileTitle = this.chatTitle;
      this.selectedIds = [];
      if (this.dataList !== undefined && this.dataList.length > 0) {
        const ids = this.dataList.filter(x => x.selected !== undefined && x.selected)
          .map(x => x.id)
          // 确保只能选择一个，当前只能加入到一个知识库中
          ids && ids.length > 0 && this.selectedIds.push(ids[ids.length - 1]);
      }
      if (this.selectedIds.length <= 0) {
        const idx = this.dataList.findIndex(x => x.isDefault !== undefined && x.isDefault);
        if (idx >= 0) {
          this.selectedIds.push(this.dataList[idx].id);
        }
      }
      if (this.selectedIds.length <= 0) {
        const idx = this.dataList.findIndex(x => x.name === '默认知识库');
        if (idx >= 0) {
          this.selectedIds.push(this.dataList[idx].id);
        }
      }
    },
    handleCheckboxChange(id) {
      // 确保每次只能选择一个选项
      this.selectedIds = [id];
    },
    handleSubmit(...args) {
      if (this.selectedIds.length <= 0) {
        this.$message.error('请选择知识库');
        return;
      }
      if (this.fileTitle.trim().length <= 0) {
        this.$message.error('请输入文件标题');
        return;
      }
      this.onOk(...args);
    }
  },
  watch: {
    show: {
      handler(newVal) {
        if (!newVal) {
          // this.refreshDefault();
        }
      }
    },
    dataList: {
      immediate: true,
      deep: true,
      handler(nValue) {
        if (nValue !== undefined && nValue !== null && nValue.length > 0) {
          this.refreshDefault();
        }
      }
    }
  }
}
</script>

<template>
  <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="400px" modal-append-to-body append-to-body>
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">加入知识库</span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]"/>
      </div>
    </div>
    <div class="px-6 pt-[10px] pb-[20px]">
      <div class="h-[26px] w-full flex flex-row items-center justify-start">
        <div class="text-[#5F646C] text-[14px] font-ms-yahei mr-3 w-max">标题</div>
        <div v-if="editMode === false" class="text-[#1D2129] text-[14px] font-ms-yahei flex-1 truncate whitespace-nowrap overflow-hidden" @dblclick="editMode = true">{{ fileTitle }}</div>
        <div v-else class="flex-1">
          <el-input v-model="fileTitle" placeholder="请输入文件标题" class="w-full" @blur="editMode = false" />
        </div>
        <div class="!w-[24px] !h-[24px] hover:bg-[#F7F8FA] rounded">
          <svg-icon icon-class="edit1" class-name="!w-[24px] !h-[24px] text-[#5F646C] cursor-pointer" @click="editMode = true"/>
        </div>
      </div>
      <div class="w-full h-[1px] bg-[#E5E6EB] my-4" />
      <div class="w-full flex flex-col items-center h-[35vh] overflow-x-hidden overflow-y-scroll hide-scroll-bar">
        <el-row v-for="(item, index) in dataList" :key="index" class="w-full py-2 flex items-center" :gutter="20">
          <el-col :span="20">
            <el-checkbox fill="#3662FF" size="medium" v-model="selectedIds" :label="item.id" @change="handleCheckboxChange(item.id)">{{ item.name }}</el-checkbox>
          </el-col>
<!--          <el-col :span="18">-->
<!--            <div class="text-[#1D2129] text-[14px] font-ms-yahei knowledge-name" :style="{color: selectedIds.indexOf(item.id) >= 0 ? '#3662FF' : ''}">{{ item.name }}</div>-->
<!--          </el-col>-->
          <el-col :span="4">
            <div class="text-[#959BA1] text-[14px] font-ms-yahei text-right">{{ item.count }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="w-full h-9 py-2 px-3 mt-4 rounded border-[1px] border-[#C9CDD4] flex flex-row items-center justify-start cursor-pointer" @click.stop="onAddNewClick">
        <svg-icon icon-class="knowledge-add" class-name="w-[14px] h-[14px]" />
        <span class="text-[#5F646C] text-[14px] ml-3">新建知识库</span>
      </div>
    </div>
    <div slot="footer" class="w-full flex justify-center items-center pt-3 pb-4 px-6 gap-[10px]">
      <div class="w-[122px] h-[32px]">
        <PrimaryButton text="确认" @click="() => handleSubmit(sessionUniqueId, message && message.messageUniqueId, selectedIds, mode, fileTitle)"/>
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

.knowledge-name:hover {
  color: #3662FF;
}
</style>
