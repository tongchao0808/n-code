<script>
import EmptyList from "@/views/custom/privateKnowledgeDatabase/EmptyList.vue";
import AddDocumentDialog from "@/components/custom/dialog/AddDocumentDialog.vue";
import {getKnowledgeBaseDocList} from "@/api/custom/customKnowledgeBase";

export default {
  name: "DocList",
  components: {AddDocumentDialog, EmptyList},
  props: {
    batchMode: {type: Boolean, default: false},
    changeSelection: {type: Function, default: null},
    knowledgeBaseItem: {type: Object, required: true},
  },
  data() {
    return {
      showAddDocumentDialog: false,
      docList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    computedKeyword() {
      return this.$store.state.knowledgeBase.docListFilter.keyword;
    },
    computedDocType() {
      return this.$store.state.knowledgeBase.docListFilter.docType;
    },
  },
  methods: {
    onCheckChange(checked, doc) {
      if (checked) {
        this.$store.dispatch("knowledgeBase/addCheckDoc", doc);
      } else {
        this.$store.dispatch("knowledgeBase/deleteCheckDoc", doc);
      }
    },
    onDocClick(doc) {
      this.$tab.openPage("知识详请", "knowledgeDetail")
    },
    onAddDocClick() {
      this.showAddDocumentDialog = true;
    },
    onDeleteDocClick(doc) {
      // TODO 调用API 单个删除
    },
    addDocumentOK() {
      // TODO 调用API上传文件
      this.showAddDocumentDialog = false;
    },
    addDocumentCancel() {
      this.showAddDocumentDialog = false;
    },

    async refreshDocumentList() {
      const params = {
        knowledgeBaseId: this.knowledgeBaseItem.id,
        keyword: this.computedKeyword,
        docType: this.computedDocType,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      // console.log("*** search params: ", params);
      const respData = await getKnowledgeBaseDocList(params.knowledgeBaseId, params.pageIndex, params.pageSize);
      this.docList = respData.rows;
      this.total = respData.total;
    }
  },
  watch: {
    knowledgeBaseItem: {
      immediate: true,
      async handler(newValue, oldValue) {
        await this.refreshDocumentList();
      }
    },
    computedKeyword: {
      immediate: true,
      async handler(newValue, oldValue) {
        await this.refreshDocumentList();
      }
    },
    computedDocType: {
      immediate: true,
      async handler(newValue, oldValue) {
        await this.refreshDocumentList();
      }
    },
  }
}
</script>

<template>
<div class="w-full h-full flex flex-col justify-center pl-[28px] pr-[100px]">
  <EmptyList v-if="!docList || docList.length === 0" :add-doc="onAddDocClick" />
  <div v-else class="w-full h-[calc(100%-40px)] overflow-y-scroll hide-scroll-bar">
    <div class="w-full h-[72px] py-[14px] px-2 flex flex-row items-center hover:bg-[#F2F3F5] cursor-pointer group"
         v-for="doc in docList"
    >
      <el-checkbox v-if="batchMode" style="margin-right: 18px" @change="(e) => onCheckChange(e, doc)" @click.native.stop />
      <img src="@/assets/images/custom/knowledge-doc.png" alt="" width="44" height="44" />
      <div class=" text-[14px] text-[#1D2129] ml-[18px] font-ms-yahei" @click.stop="() => onDocClick(doc)">{{ doc.content }}</div>
      <div class="text-[#86909C] text-[12px] font-ms-yahei ml-auto">{{ doc.createTime }}</div>
      <div class="w-[45px] text-[#86909C] text-[12px] font-ms-yahei mr-[50px] ml-[40px] text-center">{{ doc.size }}</div>
      <div class="opacity-0 group-hover:opacity-100" @click.stop="() => onDeleteDocClick(doc)">
        <svg-icon icon-class="knowledge-delete" style="width: 32px; height: 32px;" />
      </div>
    </div>
  </div>
  <div v-if="docList && docList.length > 0" class="flex justify-end">
    <Pagination
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="refreshDocumentList"
      layout="prev, pager, next"
    />
  </div>
  <AddDocumentDialog :show="showAddDocumentDialog"
                     :on-ok="addDocumentOK"
                     :on-cancel="addDocumentCancel"
  />
</div>
</template>

<style scoped lang="scss">

</style>
