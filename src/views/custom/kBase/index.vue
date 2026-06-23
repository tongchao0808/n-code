<script>
import SmallButton from "@/views/custom/privateKnowledgeDatabase/SmallButton.vue";
import BasicTable from "@/components/custom/table/BasicTable.vue";
import { getCustomKnowledgeBaseTree } from "@/api/custom/customKnowledgeBase";
import {
  createSubDir,
  deleteDocsBatch,
  getKgDocs,
} from "@/api/custom/customKnowledgeBase";
import DocOpDropdown from "@/views/custom/privateKnowledgeDatabase/components/DocOpDropdown.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import NotAutoFileUploadDialog from "@/components/custom/dialog/NotAutoFileUploadDialog.vue";
import { formatFileSize } from "@/utils/misc.js";
import { parseTime } from "@/utils/ruoyi.js";
import CreateNewKnowledgeBaseDialog from "@/views/custom/privateKnowledgeDatabase/components/CreateNewKnowledgeBaseDialog.vue";
import { createNewKg } from "@/api/custom/customKnowledgeBase";
import KnowledgeDetail from "@/views/custom/privateKnowledgeDatabase/knowledgeDetail.vue";
import { keyWordReplace } from "@/utils/generator/parseString.js";
import CreateKnowledgeBaseSubDirDialog from "@/views/custom/privateKnowledgeDatabase/components/CreateKnowledgeBaseSubDirDialog.vue";

import { openFilePreview } from "@/utils/file";
export default {
  name: "KBase",
  components: {
    CreateKnowledgeBaseSubDirDialog,
    NotAutoFileUploadDialog,
    MessageDialog,
    DocOpDropdown,
    BasicTable,
    SmallButton,
    CreateNewKnowledgeBaseDialog,
    KnowledgeDetail,
  },
  data() {
    const iconMap = {
      PRO: "knowledge-base-pro",
      SHARED_BY_OTHER: "knowledge-base-public",
      SHARED_BY_ME: "knowledge-base-public",
      MY_PERSONAL: "knowledge-base-private",
    };
    const headerCellStyle = {
      "background-color": "#FFF",
      color: "#959BA1",
      "font-size": "14px",
      "font-weight": "400",
      "text-align": "left",
    };
    const statusMap = {
      processing: { text: "处理中", icon: "processing" },
      complete: { text: "已向量化", icon: "complete" },
      failed: { text: "处理失败", icon: "failed" },
    };

    return {
      // 固定参数值
      id: null,
      name: "生物样本库知识库",
      categoryId: "3",
      permissionType: "ALL",
      folderType: "SHARED_BY_ME",

      searchKeyword: "",
      docList: [],
      allFolders: [], // 存储所有文件夹
      tabs: [{ label: "全部文件", name: "ALL", id: null }], // 动态tabs
      activeTab: "ALL", // 当前激活的tab
      isLoading: false,
      showCreateKgDialog: false,
      directoryId: "",
      pathId: 0,
      meta: "",
      docId: "",

      page: 1,
      pageSize: 10,
      total: 0,
      showCreateDocDialog: false,
      showCreateSubDirDialog: false,
      showDeleteConfirm: false,
      canDeleteDocs: false,
      iconMap: iconMap,
      statusMap,
      headerCellStyle: headerCellStyle,
      showKnowledgeDetail: false,
      listData: [],
      currentTypeLevel2: "",
    };
  },
  watch: {
    // ----------------- 【改造点：监听路由获取动态 ID】 -----------------
    $route: {
      async handler(to) {
        const targetType = to.meta.typeLevel2;
        this.currentTypeLevel2 = targetType;
        if (!targetType) return;
        this.isLoading = true;
        // 如果还没有加载过总知识库列表，则先去请求
        if (this.listData.length === 0) {
          await this.fetchKnowledgeList();
        }
        // 解析数据并初始化页面
        this.matchIdAndLoadData(targetType);
      },
      immediate: true, // 让组件初始化时立刻执行一次，取代 mounted 里面的请求
    },
  },
  computed: {
    // 当前知识库是否可编辑文档
    writable() {
      return (
        ["SHARED_BY_ME", "MY_PERSONAL"].includes(
          this.permissionType == "ALL" ? this.folderType : this.permissionType
        ) || this.name == "默认知识库"
      );
    },
    canAddDirectory() {
      // 1. 如果没有基础读写权限，不允许
      if (!this.writable) return false;
      // // 2. 如果当前 tab 是“全部文件”，不允许
      // if (this.activeTab === "ALL") return false;
      // 3. 如果当前路由的 typeLevel2 是 biological_sample 或 sop，无论哪个tab都不允许
      if (["biological_sample", "sop"].includes(this.currentTypeLevel2))
        return false;

      return true;
    },
  },
  async mounted() {},
  methods: {
    async fetchKnowledgeList() {
      try {
        const res = await getCustomKnowledgeBaseTree();
        this.listData = res;
      } catch (error) {
        console.error("获取知识库总分类列表失败", error);
      }
    },
    async matchIdAndLoadData(targetType) {
      let matchedDb = null;
      // 遍历解析 JSON 树找对应的 db
      for (let i = 0; i < this.listData.length; i++) {
        const category = this.listData[i];
        const dbs = category.knowledgeDatabases || [];
        const found = dbs.find((db) => db.typeLevel2 === targetType);
        if (found) {
          matchedDb = found;
          break;
        }
      }

      if (matchedDb) {
        // 动态赋值核心参数
        this.id = matchedDb.id.toString();
        this.name = matchedDb.name;
        this.categoryId = matchedDb.categoryId.toString();
        this.folderType = matchedDb.ownership || "SHARED_BY_ME";

        // 初始化 meta (保证传入了正确的 knowledgeDatabaseId)
        this.meta = new Blob(
          [
            JSON.stringify({
              knowledgeDatabaseId: this.id,
              pathId: this.pathId,
            }),
          ],
          { type: "application/json" }
        );

        // 重置状态
        this.page = 1;
        this.searchKeyword = "";
        this.activeTab = "ALL";

        // 开始加载对应 ID 下的文件及内容
        await this.loadFoldersAndInitTabs();
        await this.reloadKgDocs();
      } else {
        this.isLoading = false;
        this.name = "未找到对应的知识库";
        this.docList = [];
        this.$message.warning(
          `未在数据中匹配到 typeLevel2 为 ${targetType} 的知识库`
        );
      }
    },
    async reloadAll() {
      await this.loadFoldersAndInitTabs();
      await this.reloadKgDocs();
    },
    // 加载文件夹并初始化tabs
    async loadFoldersAndInitTabs() {
      try {
        const resp = await getKgDocs(this.id, "", "", 1, 100); // 获取所有内容
        // 筛选出所有文件夹
        const folders = resp.rows.filter((item) => item.type === "folder");
        this.allFolders = folders;

        // 构建tabs: 全部文件 + 各个文件夹
        this.tabs = [
          { label: "全部文件", name: "ALL", id: this.id },
          ...folders.map((folder) => ({
            label: folder.name,
            name: folder.id + "",
            id: folder.id,
          })),
        ];
      } catch (error) {
        console.error("加载文件夹失败:", error);
      }
    },
    async reloadKgDocs(params) {
      if (!this.id) return; // 容错处理：确保 id 存在时才请求
      this.isLoading = true;
      const directoryId = params?.directoryId || "";

      // 根据当前激活的tab决定加载哪些数据
      let targetDirectoryId = directoryId;
      if (!directoryId && this.activeTab !== "ALL") {
        // 如果选中的是某个文件夹tab，加载该文件夹下的内容
        targetDirectoryId = this.activeTab;
      }

      const resp = await getKgDocs(
        this.id,
        targetDirectoryId,
        this.searchKeyword,
        this.page,
        this.pageSize
      );

      // 如果是"全部文件"tab，过滤掉文件夹类型
      let filteredRows = resp.rows;
      // if (this.activeTab === 'ALL' && !directoryId) {
      //   filteredRows = resp.rows.filter(item => item.type !== 'folder')
      // }

      this.total = resp.total;
      this.docList = filteredRows.map((v) => {
        return {
          ...v,
          size: formatFileSize(v.size),
          createTime: parseTime(v.createTime),
        };
      });
      this.isLoading = false;
    },
    async doSearch() {
      this.page = 1;
      this.pageSize = 10;
      await this.reloadKgDocs();
    },
    openShowCreateDocDialog() {
      this.$router.push({
        path: "/knowledgeBase/upload",
        query: { id: this.id, name: this.name, pathId: this.directoryId },
      });
    },
    closeShowCreateDocDialog() {
      this.showCreateDocDialog = false;
    },

    openShowCreateSubDirDialog() {
      this.showCreateSubDirDialog = true;
    },
    closeShowCreateSubDirDialog() {
      this.showCreateSubDirDialog = false;
    },

    uploadComplate() {
      this.reloadKgDocs();
    },
    handleSocSelected(values) {
      this.docList.forEach((doc) => (doc.selected = false));
      values.forEach((v) => {
        const item = this.docList.find((x) => x.id === v.id);
        item.selected = true;
      });
      this.canDeleteDocs = this.docList
        .map((x) => x.selected)
        .some((x) => x === true);
    },
    openDeleteConfirmDialog() {
      this.showDeleteConfirm = true;
    },
    closeDeleteConfirmDialog() {
      this.showDeleteConfirm = false;
    },
    async doCreateSubDir(name) {
      const databaseId = this.id;
      const parentId = this.pathId;
      await createSubDir(databaseId, name, parentId);
      this.closeShowCreateSubDirDialog();
      this.reloadAll();
    },
    async doDeleteDocs() {
      const docIds = this.docList
        .filter((x) => x.selected === true)
        .map((x) => x.id);
      await deleteDocsBatch(docIds);
      this.closeDeleteConfirmDialog();
      await this.reloadKgDocs();
    },
    handleListClick(row) {
      if (row.type == "document") {
        this.goToDetail(row.id);
      } else if (row.type == "folder") {
        this.goToFolder(row);
      }
    },
    goToDetail(id) {
      this.docId = id;
      this.showKnowledgeDetail = true;
    },
    goToFolder(row) {
      this.searchKeyword = "";
      this.page = 1;
      this.directoryId = row.id;
      this.pathId = row.id;
      console.log("pathIdpathIdpathId", this.pathId);
      this.meta = new Blob(
        [JSON.stringify({ knowledgeDatabaseId: this.id, pathId: this.pathId })],
        { type: "application/json" }
      );
      this.reloadKgDocs({ directoryId: row.id });
    },
    handleSrc(nameExt) {
      return require(`@/assets/images/${nameExt}.svg`);
    },
    // 根据文件扩展名获取对应的图标
    getFileIcon(extension) {
      if (!extension) return "kg-doc";

      const ext = extension.toLowerCase();

      if (ext === "pdf") {
        return "file-pdf";
      } else if (ext === "doc" || ext === "docx") {
        return "file-doc";
      } else if (ext === "txt") {
        return "file-txt";
      } else if (ext === "xls" || ext === "xlsx") {
        return "file-xls";
      }

      return "kg-doc";
    },
    handleTabs(tab) {
      console.log("tab", tab);
      // 切换tab时重置页码和搜索
      this.activeTab = tab.name;
      this.page = 1;
      this.searchKeyword = "";
      this.directoryId = "";
      this.directoryId = tab.name;
      this.pathId = tab.name;
      this.meta = new Blob(
        [JSON.stringify({ knowledgeDatabaseId: this.id, pathId: this.pathId })],
        { type: "application/json" }
      );
      this.reloadKgDocs();
    },
    replaceKeywork({ name, extension }) {
      if (extension && extension != "未知" && !name.endsWith(`.${extension}`)) {
        name = name + `.${extension}`;
      }
      return keyWordReplace(name, this.searchKeyword);
    },
    openCreateKgDialog() {
      this.showCreateKgDialog = true;
    },
    closeCreateKgDialog() {
      this.showCreateKgDialog = false;
    },
    async doCreateKg(kgName, permission) {
      await createNewKg(kgName, permission);
      this.closeCreateKgDialog();
      this.$message.success("创建成功！");
    },
    uploadSuccess() {
      setTimeout(() => {
        this.$message.success("文件上传完毕");
        this.showCreateDocDialog = false;
      }, 3000);
    },
    handleDocDivision(row) {
      this.$router.push({
        path: "/knowledgeBase/docDivision",
        query: { docId: row.id, name: row.name },
      });
    },
    handleHitTest() {
      this.$router.push({
        path: "/knowledgeBase/hitTest",
        query: { databaseId: this.id },
      });
    },
    // 预览文件
    handleDocPreview(row) {
      //
      openFilePreview(row.url);
      // window.open(row.url);
    },
  },
};
</script>
<template>
  <div class="relative flex flex-col items-center w-full h-full">
    <div class="w-full h-[48px] flex items-end justify-between px-[32px]">
      <span
        class="text-[20px] font-ms-yahei text-[#1D2129] leading-[26px] mb-[7px] font-bold"
        >{{ name }}</span
      >
      <div class="flex flex-row items-center h-[40px] gap-[8px]">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入搜索关键字"
          class="w-[400px] custom-input"
          clearable
          @keyup.enter.native="doSearch"
        />
        <el-button
          type="primary"
          class="w-[120px] h-full"
          @click.stop="doSearch"
          >搜索</el-button
        >
      </div>
    </div>

    <div
      class="flex flex-row items-center justify-between w-full px-[32px] mt-[8px]"
    >
      <div class="flex flex-row items-center justify-start gap-4">
        <el-button
          class="bg-gradient-to-r from-[#c456d7] to-[#4e50e3] border-none text-[#fff]"
          @click="handleHitTest"
        >
          <svg-icon icon-class="hitTest" class="mr-[2px] w-[24px] h-[24px]" />
          命中测试
        </el-button>
        <span class="flex gap-[8px] items-center">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            class="rounded-[8px]"
            :disabled="!writable"
            @click.stop="openShowCreateDocDialog"
          >
            添加文档
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="较大的文件可能解析较慢，需要一定时间后手动刷新列表"
            placement="top-start"
          >
            <i class="el-icon-warning-outline text-[#959BA1]"></i>
          </el-tooltip>
        </span>

        <span class="flex gap-[8px] items-center">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            class="rounded-[8px]"
            :disabled="!canAddDirectory"
            @click.stop="openShowCreateSubDirDialog"
          >
            添加子目录
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="在当前目录下添加子目录"
            placement="top-start"
          >
            <i class="el-icon-warning-outline text-[#959BA1]"></i>
          </el-tooltip>
        </span>
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          class="rounded-[8px]"
          :disabled="!canDeleteDocs"
          @click.stop="openDeleteConfirmDialog"
          >删除</el-button
        >
      </div>
    </div>

    <div class="tabs-box w-full pt-[8px] px-[32px] mt-[8px]">
      <el-tabs v-model="activeTab" @tab-click="handleTabs">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <span
            slot="label"
            class="flex flex-col items-center justify-between h-full"
          >
            <span class="text-[16px] leading-[22px] text-[#5F646C]">{{
              tab.label
            }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="flex-1 w-full overflow-y-scroll table-box">
      <BasicTable
        need-select
        :data-list="docList"
        :loading="isLoading"
        :selection-change="handleSocSelected"
        :header-cell-style="headerCellStyle"
        height="100%"
      >
        <div
          slot="empty"
          class="w-full flex items-center flex-col gap-4 pt-[60px] pb-[20px]"
        >
          <img
            src="@/assets/images/custom/empty-kg-doc.svg"
            alt=""
            class="w-[312px] h-[242px]"
          />
          <div class="text-[#959BA1] text-[16px] leading-[20px]">暂无内容</div>
          <SmallButton
            v-if="writable"
            label="添加文档"
            prefix-icon="knowledge-add"
            border-color="#3662FF"
            text-color="#3662FF"
            bg-color="#F5F8FF"
            @click.stop="openShowCreateDocDialog"
          />
        </div>
        <el-table-column
          prop="name"
          label="文件名"
          align="left"
          min-width="300px"
        >
          <template slot-scope="scope">
            <div
              class="flex items-center w-full gap-2 cursor-pointer"
              @click="() => handleListClick(scope.row)"
            >
              <svg-icon
                v-if="scope.row.type == 'folder'"
                :icon-class="
                  iconMap[permissionType == 'ALL' ? folderType : permissionType]
                "
                style="width: 32px; height: 32px"
              />
              <img
                v-else-if="permissionType == 'PRO' && scope.row.extension"
                class="w-[32px] h-[32px]"
                :src="handleSrc(scope.row.extension)"
              />
              <svg-icon
                v-else
                :icon-class="getFileIcon(scope.row.extension)"
                class-name="!w-[32px] !h-[32px]"
              />

              <div
                class="text-[#1D2129] leading-[22px] flex-1 overflow-box"
                v-html="replaceKeywork(scope.row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="left"
          min-width="160px"
        />
        <el-table-column
          prop="size"
          label="大小"
          align="left"
          min-width="100px"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="left"
          min-width="100px"
        >
          <template slot-scope="scope">
            <div
              class="flex items-center justify-start w-full gap-2"
              v-if="scope.row.type !== 'folder'"
            >
              <svg-icon
                :icon-class="statusMap[scope.row.status].icon"
                class-name="!w-[20px] !h-[20px]"
              />
              <span>{{ statusMap[scope.row.status].text }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="left"
          min-width="100px"
          width="200px"
        >
          <template slot-scope="scope">
            <div class="flex items-center" v-if="scope.row.type !== 'folder'">
              <el-button
                type="text"
                class="mr-[2px]"
                @click="handleDocPreview(scope.row)"
              >
                <div class="flex items-center justify-start w-full gap-1">
                  <i class="transform scale-125 el-icon-view" />
                  <span>预览</span>
                </div>
              </el-button>
              <el-button type="text" @click="handleDocDivision(scope.row)">
                <div class="flex items-center justify-start w-full gap-1">
                  <svg-icon icon-class="division" class="!w-[16px] !h-[16px]" />
                  <span>文档分块</span>
                </div>
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="writable" align="left" min-width="100px">
          <template slot-scope="scope">
            <div
              class="flex items-center justify-start w-full gap-2"
              v-if="canAddDirectory && scope.row.type == 'folder'"
            >
              <DocOpDropdown
                :path-id="scope.row.id"
                :refresh-list="reloadAll"
              />
            </div>
            <div
              class="flex items-center justify-start w-full gap-2"
              v-if="scope.row.type !== 'folder'"
            >
              <DocOpDropdown
                :doc="scope.row"
                :refresh-list="reloadKgDocs"
                :list="tabs"
              />
            </div>
          </template>
        </el-table-column>
      </BasicTable>
    </div>
    <div class="flex justify-end w-full">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="pageSize"
        @pagination="reloadKgDocs"
      />
    </div>
    <NotAutoFileUploadDialog
      :show="showCreateDocDialog"
      url="/attachment/knowledge/upload"
      :need-load-list="true"
      :onCancel="
        () => {
          showCreateDocDialog = false;
        }
      "
      @loadListComplate="uploadComplate"
      @success="uploadSuccess"
      :data="{ meta: meta }"
    />
    <CreateNewKnowledgeBaseDialog
      :show="showCreateKgDialog"
      :on-ok="doCreateKg"
      :on-cancel="closeCreateKgDialog"
      enable-permision
    />
    <MessageDialog
      :show="showDeleteConfirm"
      title="删除提醒"
      desc="你确定要删除选中的文档么"
      :on-ok="doDeleteDocs"
      :on-cancel="closeDeleteConfirmDialog"
    />
    <KnowledgeDetail
      v-if="showKnowledgeDetail"
      @onCancel="
        () => {
          showKnowledgeDetail = false;
        }
      "
      @refresh="reloadKgDocs"
      :docId="docId"
    />
    <CreateKnowledgeBaseSubDirDialog
      :show="showCreateSubDirDialog"
      :on-ok="doCreateSubDir"
      :on-cancel="closeShowCreateSubDirDialog"
    />
  </div>
</template>

<style scoped lang="scss">
.custom-input {
  ::v-deep .el-input__inner {
    height: 40px;
  }
}

.list-border {
  border-top: #f2f3f5 solid 1px;
  border-bottom: #f2f3f5 solid 1px;
}

::v-deep .tabs-box {
  .el-tabs__active-bar {
    background: #ffffff00;
    height: 4px;
    display: flex;
    justify-content: center;

    &::after {
      content: "";
      width: 20px;
      height: 100%;
      border-radius: 34px;
      background: #3662ff;
    }
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap::after {
    display: none !important;
  }
}

::v-deep .table-box {
  .el-table th.el-table__cell > .cell {
    padding-left: 32px;
    padding-right: 0;
  }

  .el-table-column--selection .cell {
    padding-left: 32px;
    padding-right: 0;
  }

  .el-table__row {
    height: 74px;
    transition: none !important;

    td {
      border-bottom: none;
    }
  }

  .el-table__body tr:hover > td {
    background-color: #f5f8ff !important;
    --el-table-tr-hover-bg-color: #f5f8ff !important;
  }
}
</style>
