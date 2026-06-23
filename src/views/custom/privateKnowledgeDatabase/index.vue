<script>
import SideBar from "@/views/custom/privateKnowledgeDatabase/Sidebar.vue";
import EmptyList from "@/views/custom/privateKnowledgeDatabase/EmptyList.vue";
import OpHeader from "@/views/custom/privateKnowledgeDatabase/OpHeader.vue";
import DocList from "@/views/custom/privateKnowledgeDatabase/DocList.vue";
import AddDocumentDialog from "@/components/custom/dialog/AddDocumentDialog.vue";
import {
  changeKgName,
  changeKgPermission,
  createNewKg,
  deleteKg,
  getCustomKnowledgeBaseList
} from "@/api/custom/customKnowledgeBase";
import AddKnowledgeDialog from "@/components/custom/dialog/AddKnowledgeDialog.vue";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";
import CreateNewKnowledgeBaseDialog
  from "@/views/custom/privateKnowledgeDatabase/components/CreateNewKnowledgeBaseDialog.vue";
import ChangePermissionDialog from "@/views/custom/privateKnowledgeDatabase/components/ChangePermissionDialog.vue";
import DeleteKgDialog from "@/views/custom/privateKnowledgeDatabase/components/DeleteKgDialog.vue";
import KgRenameDialog from "@/views/custom/privateKnowledgeDatabase/components/KgRenameDialog.vue";
import SmallCrumbs from "@/views/custom/privateKnowledgeDatabase/SmallCrumbs.vue";

export default {
  name: "index",
  components: {
    SmallCrumbs,
    KgRenameDialog,
    DeleteKgDialog,
    ChangePermissionDialog,
    CreateNewKnowledgeBaseDialog,
    NewKnowledgeBaseDialog, AddKnowledgeDialog, AddDocumentDialog, DocList, OpHeader, EmptyList, SideBar},
  data: function () {
    const tabs = [
      {label:'全部文件',name:'ALL'},
      {label:'质量管理知识库',name:'PRO'},
      {label:'他人共享',name:'SHARED_BY_OTHER'},
      {label:'我的共享',name:'SHARED_BY_ME'},
      {label:'我的个人库',name:'MY_PERSONAL'},
    ]
    const iconMap = {
        PRO: 'knowledge-base-pro',
        SHARED_BY_OTHER: 'knowledge-base-public',
        SHARED_BY_ME: 'knowledge-base-public',
        MY_PERSONAL: 'knowledge-base-private',
      }
    return {
      isSearchResult: false,
      kgList: [],
      currentKg: undefined,
      activeName: 'all',
      tabs: tabs,
      iconMap: iconMap,
      total: 0,
      params: {
        keyword: '',
        permissionType: 'ALL',
        pageNum: 1,
        pageSize: 10
      },

      showPermissionDialog: false,
      showDeleteDialog: false,
      showRenameDialog: false,
      showCreateKgDialog: false,
    }
  },
  created() {
    this.params.permissionType = this.$route.query.permissionType || 'ALL'
  },
  methods: {
    openCreateKgDialog() {
      this.showCreateKgDialog = true;
    },
    closeCreateKgDialog() {
      this.showCreateKgDialog = false;
    },
    async doCreateKg(kgName, permission) {
      await createNewKg(kgName, permission);
      this.closeCreateKgDialog();
      await this.reloadKgList();
    },
    openPermissionDialog(kg) {
      this.currentKg = kg;
      this.showPermissionDialog = true;
    },
    closePermissionDialog() {
      this.showPermissionDialog = false;
      this.currentKg = undefined;
    },
    doChangePermission(id, permission) {
      changeKgPermission(id, permission).then(res => {
        this.$message.success("修改成功");
        this.closePermissionDialog();
        this.reloadKgList();
      }).catch(err => {
        console.log("error change permission: ", err);
      });
    },
    openDeleteDialog(kg) {
      this.currentKg = kg;
      this.showDeleteDialog = true;
    },
    closeDeleteDialog() {
      this.showDeleteDialog = false;
      this.currentKg = undefined;
    },
    async doDeleteKg(id, deleteOption) {
      await deleteKg(id, deleteOption);
      this.closeDeleteDialog();
      await this.reloadKgList();
    },
    openKgRenameDialog(kg) {
      this.currentKg = kg;
      this.showRenameDialog = true;
    },
    closeKgRenameDialog() {
      this.showRenameDialog = false;
      this.currentKg = undefined;
    },
    doRenameKg(id, name) {
      changeKgName(id, name).then(res => {
        this.$message.success("修改成功");
        this.closeKgRenameDialog();
        this.reloadKgList();
      }).catch(err => {
        console.log("error change name: ", err);
      });
    },
    handleSearch() {
      this.params.pageNum = 1
      this.reloadKgList();

    },
    async reloadKgList() {
      const res = await getCustomKnowledgeBaseList(this.params);
      this.kgList = res.records;
      this.total = res.total
      this.isSearchResult = this.params.keyword !== "";
    },
    onEnterKnowledgeBaseClick(kg) {
      const params = {name: kg.name, id: kg.id,categoryId:kg.categoryId,permissionType: this.params.permissionType}
      if(this.params.permissionType == 'ALL') {
        params.folderType = kg.ownership
      }
      this.$tab.openPage("知识库文档", "knowledgeDocList", params);
    },
    clearSearch() {
      this.params.keyword = "";
      this.reloadKgList();
      this.isSearchResult = false;
    },
    handleTabs(tab, event) {
      this.params = this.$options.data().params
      this.params.permissionType = tab.name
      this.reloadKgList();
      this.isSearchResult = false;
    },
    replaceKeywork(str) {
      return str.replaceAll(this.params.keyword, `<span class="text-[#FF5656]">${this.params.keyword}</span>`)
    },
  },
  async mounted() {
    this.reloadKgList();
  },
  computed: {
    crumbItems() {
      const tabName = this.tabs.find(tab => tab.name === this.params.permissionType || this.$route.query.permissionType || 'ALL').label
      if (this.isSearchResult) {
        return [{path: 'CustomKnowledgeBase', text: tabName, jumpFunc: this.clearSearch}, {path: '', text: `搜索“${this.params.keyword}”的相关结果（文件名相关${this.total}项）`}]
      } else {
        return [{path: '', text: tabName}]
      }
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full h-full">
    <div class="w-full h-[48px] flex items-end justify-between px-[32px]">
      <span class="text-[20px] font-ms-yahei text-[#1D2129] leading-[26px] mb-[7px] font-bold">自定义知识库</span>
      <div class="flex flex-row items-center h-[40px] gap-[8px]">
        <el-input placeholder="请输入搜索关键字" class="w-[400px] custom-input" v-model="params.keyword" clearable
          @clear="handleSearch" @keyup.enter.native="handleSearch" />
        <el-button type="primary" class="w-[120px] h-full" @click.stop="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="flex flex-row items-center w-full px-[32px] mt-[8px]">
      <el-button type="primary" icon="el-icon-folder-add" class="rounded-[8px]"
        @click.stop="openCreateKgDialog">新建知识库</el-button>
      <CreateNewKnowledgeBaseDialog :show="showCreateKgDialog" :on-ok="doCreateKg" :on-cancel="closeCreateKgDialog"
        enable-permision />
    </div>

    <div class="tabs-box w-full pt-[8px] px-[32px] mt-[8px]">
      <el-tabs v-model="params.permissionType" @tab-click="handleTabs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <span slot="label" class="flex flex-col items-center justify-between h-full">
            <span class="text-[16px] leading-[22px]" :class="tab.name == 'PRO' ? 'pro-style' : ''">{{ tab.label
              }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <div class="w-full list-border">
      <SmallCrumbs :paths="crumbItems" />
    </div> -->
    <!-- 表头 -->
    <header class="w-full grid grid-cols-4 px-[32px] text-[14px] text-[#959BA1] leading-[40px] list-border">
      <span class="col-span-2 ml-[40px]">文件名</span><span>创建时间</span><span></span>
    </header>
    <!-- 列表部分 -->
    <div class="flex flex-1 flex-col w-full overflow-y-scroll">
      <div class="w-full !h-[74px] px-[32px] min-h-[74px] py-[16px] grid grid-cols-4 base-list-item list-border"
        v-for="base in kgList" :key="base.id" @mouseenter="() => { base.showOp = true; $forceUpdate(); }"
        @mouseleave="base.showOp = false" @click.stop="() => onEnterKnowledgeBaseClick(base)">
        <!-- 文件名 -->
        <div class="col-span-2 flex items-center">
          <svg-icon v-if="base.name === '生物样本库知识库'" :icon-class="iconMap['PRO']" style="width: 32px; height: 32px; cursor: pointer;" />
          <svg-icon v-else :icon-class="base.isDefault?'knowledge-base-default':iconMap[base.ownership]" style="width: 32px; height: 32px; cursor: pointer;" />
          <div class="ml-[8px] text-[#1D2129] text-[16px] font-ms-yahei cursor-pointer"
            v-html="isSearchResult ? replaceKeywork(base.name) : base.name"></div>
          <div class="ml-[16px] text-[#959BA1] text-[12px] font-ms-yahei cursor-pointer">{{ base.numDocuments }}</div>
        </div>
        <!-- 创建时间 -->
        <div class="flex items-center text-[16px] text-[#5F646C] leading-[22px]">
          {{ parseTime(base.createTime, '{y}-{m}-{d}') }}
        </div>
        <!-- 操作 -->
        <div v-if="base.showOp && ['SHARED_BY_ME', 'MY_PERSONAL'].includes(base.ownership)"
          class="h-[42px] flex flex-row items-center justify-between p-1 rounded-lg bg-[#E8EFFF] ml-auto gap-x-2 text-[12px] xl:text-[14px]">
          <div class="h-[34px] p-2 rounded-lg text-[#3662FF]  flex items-center op-item cursor-pointer"
            @click.stop="() => openKgRenameDialog(base)">
            <svg-icon icon-class="base-op-text" class-name="!w-[18px] !h-[18px] mr-2 hidden xl:!block" />
            重命名
          </div>
          <div class="h-[34px] p-2 rounded-lg text-[#3662FF] flex items-center op-item cursor-pointer"
            @click.stop="() => openPermissionDialog(base)">
            <svg-icon icon-class="base-op-lock" class-name="!w-[18px] !h-[18px] mr-2 hidden xl:!block" />
            权限
          </div>
          <div class="h-[34px] p-2 rounded-lg text-[#3662FF] flex items-center op-item cursor-pointer"
            @click.stop="() => openDeleteDialog(base)">
            <svg-icon icon-class="base-op-delete" class-name="!w-[18px] !h-[18px] mr-2 hidden xl:!block" />
            删除
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex justify-end">
      <pagination v-show="total > 0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
        @pagination="reloadKgList" />
    </div>

    <KgRenameDialog v-if="currentKg !== undefined" :show="showRenameDialog" :id="currentKg.id"
      :default-value="currentKg.name" :on-ok="doRenameKg" :on-cancel="closeKgRenameDialog" />

    <ChangePermissionDialog v-if="currentKg !== undefined" :show="showPermissionDialog" :id="currentKg.id"
      :default-permission="currentKg.permission" :on-ok="doChangePermission" :on-cancel="closePermissionDialog" />
    <DeleteKgDialog v-if="currentKg !== undefined" :show="showDeleteDialog" :id="currentKg.id" :on-ok="doDeleteKg"
      :on-cancel="closeDeleteDialog" />

  </div>
</template>

<style scoped lang="scss">
.custom-input {
  ::v-deep .el-input__inner {
    height: 40px;
  }
}

.list-border {
  border-top: #F2F3F5 solid 1px;
  border-bottom: #F2F3F5 solid 1px;
}

.base-list-item:hover {
  background-color: #F5F8FF;
}

.op-item:hover {
  background-color: #F5F8FF;
}

.custom-radio-group {
  height: 44px !important;
  display: flex;
  align-items: center;
}

.custom-radio {
  width: 130px !important;
  font-size: 16px;
}

::v-deep .el-radio__inner {
  border-color: #959BA1 !important;
  width: 18px !important;
  height: 18px !important;
}

::v-deep .is-checked .el-radio__inner {
  border-color: #3662FF !important;
  background-color: #3662FF !important;
  width: 18px !important;
  height: 18px !important;
}

.custom-radio-group-delete {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.custom-radio-delete {
  width: 130px !important;
  height: 44px !important;
  font-size: 16px;
  display: flex;
  align-items: center;

  ::v-deep .el-radio__label {
    font-size: 12px;
  }
}

::v-deep .tabs-box {
  .el-tabs__active-bar {
    background: #ffffff00;
    height: 4px;
    display: flex;
    justify-content: center;

    &::after {
      content: '';
      width: 20px;
      height: 100%;
      border-radius: 34px;
      background: #3662FF;
    }
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap::after {
    display: none !important;
  }
    .el-tabs__item {
      color: #5F646C;
    }

    .el-tabs__item.is-active {
      color: #3662FF;
      font-weight: 600;
    }

    .pro-style {
      background: linear-gradient(135deg, #3397FFFF, #5F9CFFFF, #AB5CFFFF);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      &::after {
        content: 'PRO';
        font-size: 10px;
        line-height: 12px;
        width: 28px;
        height: 15px;
        margin-left: 4px;
        border-radius: 8px 2px 8px 2px;
        padding: 2px 4px;
        background-clip: border-box;
        -webkit-text-fill-color: #fff;
        background: linear-gradient(135deg, #9BCCFF, #D1A6FF, #9799FF);
      }
    }
}
</style>
