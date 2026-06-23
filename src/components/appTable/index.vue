<template>
  <div class="table">
    <!-- 搜索区域 -->
    <div ref="searchRef">
      <slot name="search" />
    </div>
    <!-- 顶部操作 -->
    <div class="menuTop">
      <!-- 左边-新增、导出之类 -->
      <div>
        <slot name="menuTopLeft" :data="{ row: selectionList }" />
      </div>
      <!-- 右边-搜索、重置之类 -->
      <div>
        <slot name="menuTopRight" :data="{ row: selectionList }" />
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      ref="Table"
      v-loading="tableLoading"
      v-bind="$attrs"
      :height="height"
      :element-loading-text="tableOption.loadingText"
      :data="tableData"
      :size="tableOption.size"
      :row-key="rowKey"
      :show-header="tableOption.showHeader"
      :lazy="tableOption.lazy"
      :load="treeLoad"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :tree-props="tableOption.treeProps"
      :span-method="mergeMethod"
      :default-sort="tableOption.sortProps"
      :header-cell-style="tableOption.headerCellStyle"
      :highlight-current-row="tableOption.highlightCurrentRow"
      @selection-change="selectionChange"
      @sort-change="sortChange"
    >
      <slot name="list">
        <!-- 复选框 -->
        <el-table-column
          v-if="showSelect"
          type="selection"
          :fixed="true"
          :reserve-selection="reserveSelection"
          :width="tableOption.selectionWidth"
          :align="tableOption.align"
        />
        <!-- 展开行 -->
        <el-table-column v-if="showExpand" type="expand">
          <template slot-scope="scope">
            <slot name="expand" :data="{ row:scope.row, index:scope.$index }" />
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column v-if="showIndex" label="序号" type="index" :align="tableOption.align" />
        <!-- 标头 -->
        <el-table-column
          v-for="item in tableOption.column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :fixed="item.fixed"
          :width="item.width"
          :sortable="item.sortable"
          :show-overflow-tooltip="item['show-overflow-tooltip']"
          :align="tableOption.align"
          style="color: rgba(0, 0, 0, 0.85)"
        >
          <!-- 自定义表头 -->
          <template v-if="item.slotHeader" #header>
            <slot :name="item.slotHeader" />
          </template>
          <!-- 多级表头 -->
          <template v-if="item.multiHeader">
            <slot name="multiHeader" />
          </template>
          <!-- 内容 -->
          <template slot-scope="scope">
            <!-- 自定义内容 -->
            <span v-if="item.formatter">{{ item.formatter(scope.row) }}</span>
            <!-- 插槽 -->
            <span v-else-if="item.slot">
              <slot :name="item.prop" :data="{ row:scope.row, index:scope.$index }" />
            </span>
            <!-- 图片 -->
            <span v-else-if="item.image">
              <el-image
                v-for="(image, index) in scope.row.image"
                :key="image"
                style="width: 50px; height: 50px; margin-right: 5px"
                :src="image"
                :preview-src-list="previewSrcList(scope.row.image, index)"
              />
            </span>
            <!-- 默认内容 -->
            <span v-else>{{ scope.row[item.prop] || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showMenu"
          :label="tableOption.menuTitle"
          fixed="right"
          :align="tableOption.align"
          :width="tableOption.menuWidth"
        >
          <template slot-scope="scope">
            <slot name="mergeBtnMenu" :data="{ row:scope.row, index:scope.$index }" />
            <slot name="operateMenu" :data="{ row:scope.row, index:scope.$index }" />
          </template>
        </el-table-column>
      </slot>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="showPage && page.total"
      class="page"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 标头
    columns: {
      type: Array,
      default: () => []
    },
    onLoad: {
      type: Function,
      default: () => {}
    },
    // 分页
    page: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    // 是否显示序号
    showIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示展开行
    showExpand: {
      type: Boolean,
      default: false
    },
    // 是否显示多选框
    showSelect: {
      type: Boolean,
      default: false
    },
    // 是否跨页多选
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 是否显示操作栏
    showMenu: {
      type: Boolean,
      default: true
    },
    // 是否显示分页
    showPage: {
      type: Boolean,
      default: true
    },
    // 是否显示合计行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 排序配置
    sortProps: {
      type: Object,
      default: () => {}
    },
    // 是否开启懒加载树形数据
    lazy: {
      type: Boolean,
      default: true
    },
    // 树形子节点配置 数据包含hasChildren则懒加载数据
    treeProps: {
      type: Object,
      default: () => {
        return { children: 'children', hasChildren: 'hasChildren' }
      }
    },
    // 加载子节点方法 返回参数 tree当前节点, treeNode节点的层级, resolve加载的数据
    treeLoad: {
      type: Function,
      default: () => {}
    },
    // 行数据的 Key，用来优化 Table 的渲染以及翻页选择
    rowKey: {
      type: Function,
      default: row => row.id
    },
    // 合并行或列的计算方法
    mergeMethod: {
      type: Function,
      default: () => {}
    },
    // 自定义的合计计算方法
    summaryMethod: {
      type: Function,
      default: param => {
        // const { columns, data } = param
        const sums = ['总价']
        return sums
      }
    },
    // 操作栏宽度
    menuWidth: {
      type: String,
      default: '220'
    },
    // 操作栏名称
    menuTitle: {
      type: String,
      default: '操作'
    }
  },
  data() {
    return {
      option: {
        showHeader: true, // 是否显示表头
        // border: false, // 是否带有纵向边框
        highlightCurrentRow: true, // 是否要高亮当前行
        selectionWidth: '50', // 选择框列宽度
        size: 'small', // 表格尺寸 medium / small / mini
        loadingText: '正在加载中...', // 加载数据时显示文本内容
        emptyText: '暂无数据', // 空数据时显示的文本内容
        align: 'center', // 对齐方式 left/center/right
        headerCellStyle: {
          background: '#fafafa',
          color: '#252525',
          fontWeight: 700
        } // 表头单元格样式
      },
      selectionList: [],
      searchHeight: null
    }
  },
  computed: {
    tableOption() {
      return {
        ...this.option,
        column: this.columns,
        lazy: this.lazy,
        treeProps: this.treeProps,
        sortProps: this.sortProps,
        menuWidth: this.menuWidth,
        menuTitle: this.menuTitle
      }
    }
  },
  watch: {
    tableLoading() {
      this.selectionList = []
      this.$refs.Table.clearSelection()
    }
  },
  created() {
    this.onLoad()
  },
  updated() {
    /**
     * 解决表格错位方法
     * 第一种：在 el-table标签 加上 :key='Math.random()'
     * 第二种：数据重新渲染 触发 官方提供的 doLayout 方法;
     */
    this.$nextTick(() => {
      this.$refs.Table.doLayout()
    })
  },
  methods: {
    // 选中的数据
    selectionChange(list) {
      this.selectionList = list
      this.$emit('selectionChange', list)
    },
    // 排序
    sortChange(row) {
      this.$emit('sortChange', row)
    },
    // 改变页码
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.$emit('update:page', this.page)
      this.onLoad()
    },
    // 改变页数
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.$emit('update:page', this.page)
      this.onLoad()
    },
    // 预览大图
    previewSrcList(data, index) {
      const arr = []
      if (data.length === 0) {
        return arr
      }
      for (let i = 0; i < data.length; i++) {
        arr.push(data[(i + index) % data.length])
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.page {
  padding-top: 10px;
  text-align: right;
}
.menuTop {
  padding: 0 0 8px 0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
