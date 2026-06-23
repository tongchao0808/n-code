<script>
import SmallButton from '@/views/custom/privateKnowledgeDatabase/SmallButton.vue'
import SmallCrumbs from '@/views/custom/privateKnowledgeDatabase/SmallCrumbs.vue'
import BasicTable from '@/components/custom/table/BasicTable.vue'
import {createSubDir, deleteDocsBatch, getKgDocs} from "@/api/custom/customKnowledgeBase";
import DocOpDropdown from "@/views/custom/privateKnowledgeDatabase/components/DocOpDropdown.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import NotAutoFileUploadDialog from "@/components/custom/dialog/NotAutoFileUploadDialog.vue";
import { formatFileSize } from "@/utils/misc.js";
import { parseTime } from '@/utils/ruoyi.js'
import CreateNewKnowledgeBaseDialog
from '@/views/custom/privateKnowledgeDatabase/components/CreateNewKnowledgeBaseDialog.vue'
import {
  createNewKg
} from '@/api/custom/customKnowledgeBase'
import KnowledgeDetail from './knowledgeDetail.vue'
import { keyWordReplace } from '@/utils/generator/parseString.js'
import CreateKnowledgeBaseSubDirDialog
  from "@/views/custom/privateKnowledgeDatabase/components/CreateKnowledgeBaseSubDirDialog.vue";
export default {
  name: 'KnowledgeDocList',
  components: {
    CreateKnowledgeBaseSubDirDialog,
    NotAutoFileUploadDialog,
    MessageDialog,
    DocOpDropdown, BasicTable,
    SmallCrumbs, SmallButton,
    CreateNewKnowledgeBaseDialog,
    KnowledgeDetail
  },
  data() {
    const tabs = [
      { label: '全部文件', name: 'ALL' },
      { label: '质量管理知识库', name: 'PRO' },
      { label: '他人共享', name: 'SHARED_BY_OTHER' },
      { label: '我的共享', name: 'SHARED_BY_ME' },
      { label: '我的个人库', name: 'MY_PERSONAL' }
    ]
    const iconMap = {
      PRO: 'knowledge-base-pro',
      SHARED_BY_OTHER: 'knowledge-base-public',
      SHARED_BY_ME: 'knowledge-base-public',
      MY_PERSONAL: 'knowledge-base-private'
    }
    const headerCellStyle = {
      'background-color': '#FFF',
      'color': '#959BA1',
      'font-size': '14px',
      'font-weight': '400',
      'text-align': 'left'
    }
    const statusMap = {
      processing: { text: '处理中', icon: 'processing' },
      complete: { text: '已完成', icon: 'complete' },
      failed: { text: '处理失败', icon: 'failed' }
    }
    return {
      id: '',
      name: '',
      searchKeyword: '',
      docList: [],
      permissionType: 'ALL',
      folderType: '',
      isLoading: false,
      showCreateKgDialog: false,
      directoryId: '',
      pathId: 0,
      meta: '',
      docId: '',

      page: 1,
      pageSize: 10,
      total: 0,

      showCreateDocDialog: false,
      showCreateSubDirDialog: false,
      showDeleteConfirm: false,
      canDeleteDocs: false,
      categoryId: '',
      tabs: tabs,
      iconMap: iconMap,
      statusMap,
      crumbItems: [],
      headerCellStyle: headerCellStyle,
      showKnowledgeDetail: false
    }
  },
  computed: {
    // 当前知识库是否可编辑文档
    writable() {
      return ['SHARED_BY_ME', 'MY_PERSONAL'].includes(this.permissionType == 'ALL' ? this.folderType : this.permissionType) || this.name == '默认知识库'
    }
  },
  async mounted() {
    this.id = this.$route.query.id
    this.name = this.$route.query.name
    this.categoryId = this.$route.query.categoryId
    this.permissionType = this.$route.query.permissionType
    this.folderType = this.$route.query.folderType
    this.initCrumbs()
    await this.reloadKgDocs()
    this.meta = new Blob([JSON.stringify({ knowledgeDatabaseId: this.id, pathId: 0 })], { type: 'application/json' })
  },
  methods: {
    async reloadKgDocs(params) {
      this.isLoading = true
      const directoryId = params?.directoryId || ''
      const resp = await getKgDocs(this.id, directoryId, this.searchKeyword, this.page, this.pageSize)
      this.total = resp.total
      this.docList = resp.rows.map(v => { return { ...v, size: formatFileSize(v.size), createTime: parseTime(v.createTime) } })
      this.isLoading = false
    },
    async doSearch() {
      this.page = 1
      this.pageSize = 10
      await this.reloadKgDocs()
    },
    openShowCreateDocDialog() {
      // this.showCreateDocDialog = true
      this.$router.push({ path: '/knowledgeBase/upload', query: { id: this.id, name: this.name }})
    },
    closeShowCreateDocDialog() {
      this.showCreateDocDialog = false
    },

    openShowCreateSubDirDialog() {
      this.showCreateSubDirDialog = true;
    },
    closeShowCreateSubDirDialog() {
      this.showCreateSubDirDialog = false;
    },

    uploadComplate() {
      this.reloadKgDocs()
    },
    handleSocSelected(values) {
      this.docList.forEach((doc) => doc.selected = false)
      values.forEach(v => {
        const item = this.docList.find((x) => x.id === v.id)
        item.selected = true
      })
      this.canDeleteDocs = this.docList.map(x => x.selected).some(x => x === true)
    },
    openDeleteConfirmDialog() {
      this.showDeleteConfirm = true
    },
    closeDeleteConfirmDialog() {
      this.showDeleteConfirm = false
    },
    async doCreateSubDir(name) {
      const databaseId = this.id;
      const parentId = this.pathId;
      await createSubDir(databaseId, name, parentId);
      this.closeShowCreateSubDirDialog();
      await this.reloadKgDocs();
    },
    async doDeleteDocs() {
      const docIds = this.docList.filter(x => x.selected === true).map(x => x.id)
      await deleteDocsBatch(docIds)
      this.closeDeleteConfirmDialog()
      await this.reloadKgDocs()
    },
    handleListClick(row) {
      if (row.type == 'document') {
        this.goToDetail(row.id)
      } else if (row.type == 'folder') {
        this.goToFolder(row)
      }
    },
    goToDetail(id) {
      this.docId = id
      this.showKnowledgeDetail = true
    },
    goToFolder(row) {
      // todo
      this.searchKeyword = ''
      this.page = 1
      this.directoryId = row.id
      const currentDirectoryId = this.crumbItems[this.crumbItems.length - 1]?.params?.directoryId
      const currentText = this.crumbItems[this.crumbItems.length - 1].text
      this.pathId = row.id;
      console.log('pathIdpathIdpathId', this.pathId);
      this.meta = new Blob([JSON.stringify({ knowledgeDatabaseId: this.id, pathId: this.pathId })], { type: 'application/json' })
      const currentCrumb = [{
        path: 'knowledgeDocList',
        text: currentText,
        params: { directoryId: currentDirectoryId },
        jumpFunc: () => {
          const index = this.crumbItems.findIndex(item => {
            return item.params.directoryId === currentDirectoryId && item.text === currentText
          })
          this.crumbItems.splice(index, this.crumbItems.length - index, { path: '', text: currentText, params: { directoryId: currentDirectoryId }})
          this.reloadKgDocs({ directoryId: currentDirectoryId || '' })
        }
      },
      {
        path: '',
        text: row.name,
        params: { directoryId: row.id }
      }
      ]
      this.crumbItems.splice(this.crumbItems.length - 1, 1, ...currentCrumb)
      this.reloadKgDocs({ directoryId: row.id })
    },
    handleSrc(nameExt) {
      return require(`@/assets/images/${nameExt}.svg`)
    },
    handleTabs(tab, event) {
      this.$tab.openPage('', 'CustomKnowledgeBase', { permissionType: tab.name })
    },
    replaceKeywork({ name, extension }) {
      if (extension && extension != '未知' && !name.endsWith(`.${extension}`)) {
        name = name + `.${extension}`
      }
      return keyWordReplace(name, this.searchKeyword)
    },
    initCrumbs() {
      this.crumbItems = [{
        path: 'CustomKnowledgeBase',
        text: this.tabs.find(tab => tab.name === this.permissionType).label,
        params: { permissionType: this.permissionType }
      },
      { path: '', text: this.name }]
    },
    openCreateKgDialog() {
      this.showCreateKgDialog = true
    },
    closeCreateKgDialog() {
      this.showCreateKgDialog = false
    },
    async doCreateKg(kgName, permission) {
      await createNewKg(kgName, permission)
      this.closeCreateKgDialog()
      this.$message.success('创建成功！')
    },
    uploadSuccess() {
      setTimeout(() => {
        this.$message.success('文件上传完毕')
        this.showCreateDocDialog = false
      }, 3000)
    },

  async mounted() {
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;
    this.categoryId = this.$route.query.categoryId;
    this.permissionType = this.$route.query.permissionType;
    this.folderType = this.$route.query.folderType;
    this.pathId = this.$route.query.pathId || 0
    this.initCrumbs()
    await this.reloadKgDocs();
    this.meta = new Blob([JSON.stringify({ knowledgeDatabaseId: this.id, pathId: this.pathId })], { type: 'application/json' })
  },
    handleDocDivision(row) {
      this.$router.push({ path: '/knowledgeBase/docDivision', query: { docId: row.id, name: row.name }})
    },
    handleHitTest() {
      this.$router.push({ path: '/knowledgeBase/hitTest', query: { databaseId: this.id }})
    },
    // 预览文件
    handleDocPreview(row) {
      window.open(row.url)
    }
  }
}
</script>
<template>
  <div class="flex flex-col items-center w-full h-full relative">
    <div class="w-full h-[48px] flex items-end justify-between px-[32px]">
      <span class="text-[20px] font-ms-yahei text-[#1D2129] leading-[26px] mb-[7px] font-bold">自定义知识库</span>
      <div class="flex flex-row items-center h-[40px] gap-[8px]">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入搜索关键字"
          class="w-[400px] custom-input"
          clearable
          @keyup.enter.native="doSearch"
        />
        <el-button type="primary" class="w-[120px] h-full" @click.stop="doSearch">搜索</el-button>
      </div>
    </div>

    <div class="flex flex-row items-center justify-between w-full px-[32px] mt-[8px]">
      <div class="flex flex-row items-center justify-start gap-4">
        <span class="flex gap-[8px] items-center">
          <el-button type="primary" plain icon="el-icon-plus"
                     class="rounded-[8px]" :disabled="!writable" @click.stop="openShowCreateDocDialog">
            添加文档
          </el-button>
          <el-tooltip class="item" effect="dark"
                      content="较大的文件可能解析较慢，需要一定时间后手动刷新列表" placement="top-start">
            <i class="el-icon-warning-outline text-[#959BA1]"></i>
          </el-tooltip>
        </span>

        <span class="flex gap-[8px] items-center">
          <el-button type="primary" plain icon="el-icon-plus"
                     class="rounded-[8px]" :disabled="!writable" @click.stop="openShowCreateSubDirDialog">
            添加子目录
          </el-button>
          <el-tooltip class="item" effect="dark"
                      content="在当前目录下添加子目录" placement="top-start">
            <i class="el-icon-warning-outline text-[#959BA1]"></i>
          </el-tooltip>
        </span>
      </div>

        <el-button type="primary" class="ml-2" @click="handleHitTest">
          <svg-icon icon-class="hitTest" class="mr-[2px] w-[24px] h-[24px]" />
          命中测试
        </el-button>


      <el-button
        type="danger"
        plain
        icon="el-icon-delete"
        class="rounded-[8px]"
        :disabled="!canDeleteDocs"
        @click.stop="openDeleteConfirmDialog"
      >删除</el-button>
    </div>

    <div class="tabs-box w-full pt-[8px] px-[32px] mt-[8px]">
      <el-tabs v-model="permissionType" @tab-click="handleTabs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <span slot="label" class="flex flex-col items-center justify-between h-full">
            <span class="text-[16px] leading-[22px] text-[#5F646C]">{{ tab.label }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="w-full list-border">
      <SmallCrumbs :paths="crumbItems" />
    </div>

    <div class="table-box w-full flex-1 overflow-y-scroll">
      <BasicTable
        need-select
        :data-list="docList"
        :loading="isLoading"
        :selection-change="handleSocSelected"
        :header-cell-style="headerCellStyle"
        height="100%"
      >
        <div slot="empty" class="w-full flex items-center flex-col gap-4 pt-[60px] pb-[20px]">
          <img src="@/assets/images/custom/empty-kg-doc.svg" alt="" class="w-[312px] h-[242px]">
          <div class="text-[#959BA1] text-[16px] leading-[20px]">暂无内容</div>
          <SmallButton
            label="添加文档"
            prefix-icon="knowledge-add"
            border-color="#3662FF"
            text-color="#3662FF"
            bg-color="#F5F8FF"
            @click.stop="openShowCreateDocDialog"
          />
        </div>
        <el-table-column prop="name" label="文件名" align="left" min-width="300px">
          <template slot-scope="scope">
            <div class="flex items-center w-full gap-2 cursor-pointer" @click="() => handleListClick(scope.row)">
              <svg-icon
                v-if="scope.row.type == 'folder'"
                :icon-class="iconMap[permissionType == 'ALL' ? folderType : permissionType]"
                style="width: 32px; height: 32px;"
              />
              <img
                v-else-if="permissionType == 'PRO' && scope.row.extension"
                class="w-[32px] h-[32px]"
                :src="handleSrc(scope.row.extension)"
              >
              <svg-icon v-else icon-class="kg-doc" class-name="!w-[32px] !h-[32px]" />

              <div class="text-[#1D2129] leading-[22px] flex-1 overflow-box" v-html="replaceKeywork(scope.row)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="left" min-width="160px" />
        <el-table-column prop="size" label="大小" align="left" min-width="100px" />
        <el-table-column prop="status" label="状态" align="left" min-width="100px">
          <template slot-scope="scope">
            <div class="flex items-center justify-start w-full gap-2">
              <svg-icon :icon-class="statusMap[scope.row.status].icon" class-name="!w-[20px] !h-[20px]" />
              <span>{{ statusMap[scope.row.status].text }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="left" min-width="100px" width="200px">
          <template slot-scope="scope">
            <div class="flex items-center">
              <el-button type="text" class="mr-[2px]" @click="handleDocPreview(scope.row)">
                <div class="flex items-center justify-start w-full gap-1">
                  <i class="el-icon-view transform scale-125" />
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
            <div class="flex items-center justify-start w-full gap-2" v-if="scope.row.type == 'folder'">
              <DocOpDropdown :path-id="scope.row.id" :refresh-list="reloadKgDocs" />
            </div>
            <div class="flex items-center justify-start w-full gap-2" v-else>
              <DocOpDropdown :doc="scope.row" :refresh-list="reloadKgDocs" />
            </div>
          </template>
        </el-table-column>
      </BasicTable>
    </div>
    <div class="w-full flex justify-end">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="pageSize"
        @pagination="reloadKgDocs"
      />
    </div>
    <NotAutoFileUploadDialog :show="showCreateDocDialog" url="/attachment/knowledge/upload" :need-load-list="true"
      :onCancel="() => { showCreateDocDialog = false }" @loadListComplate="uploadComplate" @success="uploadSuccess"
      :data="{meta: meta}" />
    <CreateNewKnowledgeBaseDialog :show="showCreateKgDialog" :on-ok="doCreateKg" :on-cancel="closeCreateKgDialog"
      enable-permision />
    <MessageDialog :show="showDeleteConfirm" title="删除提醒" desc="你确定要删除选中的文档么" :on-ok="doDeleteDocs"
      :on-cancel="closeDeleteConfirmDialog" />
    <KnowledgeDetail v-if="showKnowledgeDetail" @onCancel="() => { showKnowledgeDetail = false }"
      @refresh="reloadKgDocs" :docId="docId" />
    <CreateKnowledgeBaseSubDirDialog :show="showCreateSubDirDialog" :on-ok="doCreateSubDir"
                                     :on-cancel="closeDeleteConfirmDialog" />
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
}

::v-deep .table-box {
  .el-table th.el-table__cell>.cell {
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

  // .el-table__row td {
  //   border-bottom: none;
  // }
  .el-table__body tr:hover>td {
    background-color: #F5F8FF !important;
    --el-table-tr-hover-bg-color: #F5F8FF !important;
  }

  // .el-table__row.current-row {
  //   background-color: #000;
  // }
}
</style>
