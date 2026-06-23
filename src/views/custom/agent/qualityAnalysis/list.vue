<template>
  <div class="min-h-[calc(100vh-55px)] flex flex-col p-4 bg-[#EEF6FD]">
    <!-- 顶部操作按钮区 -->
    <div class="flex items-center gap-3 mb-4">
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="custom-gradient-btn !border-none !rounded-md"
        @click="handleAnalyze"
      >
        质控分析
      </el-button>
      <el-button
        plain
        icon="el-icon-upload2"
        class="!text-[#3662FF] !border-[#3662FF] !rounded-md hover:!bg-[#E8EFFF]"
        @click="handleExport"
      >
        批量导出
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div
      class="h-[60px] bg-white rounded-lg flex items-center gap-4 px-4 mb-4 shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
    >
      <el-input
        v-model="searchForm.reportName"
        placeholder="请输入报告名称"
        suffix-icon="el-icon-search"
        class="!w-[280px]"
        clearable
      />

      <el-select
        v-model="searchForm.status"
        placeholder="状态"
        class="!w-[180px]"
        clearable
      >
        <el-option label="合格" value="qualified" />
        <el-option label="不合格" value="unqualified" />
      </el-select>

      <el-button
        type="primary"
        class="custom-gradient-btn !border-none !px-6 !rounded-md"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </div>

    <!-- 内容区域 (表格 + 分页) -->
    <div
      class="flex-1 bg-white rounded-lg p-4 flex flex-col overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
    >
      <!-- 表格 -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <el-table
          :data="tableData"
          v-loading="isLoading"
          height="100%"
          style="width: 100%"
          :header-cell-style="{
            background: '#fff',
            color: '#86909C',
            fontWeight: '400',
            height: '54px',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column prop="name" label="任务名称" width="300">
            <template slot-scope="scope">
              <span class="text-[#1D2129]">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <div class="flex items-center gap-1.5 font-medium">
                <span>
                  <svg-icon
                    :icon-class="getStatusText(scope.row.status, 'icon')"
                    class="mr-[4px]"
                    style="width: 18px; height: 18px"
                  />
                  {{ getStatusText(scope.row.status, "text") }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="sopFileName" label="SOP文件" />

          <el-table-column prop="excelName" label="Excel文件" />

          <el-table-column label="操作" width="300" fixed="right">
            <template slot-scope="scope">
              <!-- 操作按钮容器背景 -->
              <div
                v-if="!['pending', 'running'].includes(scope.row.status)"
                class="h-[42px] inline-flex flex-row items-center p-1 rounded-lg bg-[#E8EFFF] gap-x-2 text-[12px] xl:text-[14px]"
              >
                <div
                  v-if="scope.row.status === 'success'"
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleRename(scope.row)"
                >
                  <svg-icon
                    icon-class="icon-rename"
                    class="mr-[4px]"
                    style="width: 18px; height: 18px"
                  />
                  重命名
                </div>

                <div
                  v-if="scope.row.status === 'success'"
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleView(scope.row)"
                >
                  <svg-icon
                    icon-class="icon-view"
                    class="mr-[4px]"
                    style="width: 18px; height: 18px"
                  />
                  查看
                </div>

                <div
                  v-if="scope.row.status === 'failed'"
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleReRun(scope.row)"
                >
                  <svg-icon
                    icon-class="icon-reload"
                    class="mr-[4px]"
                    style="width: 18px; height: 18px"
                  />
                  重试
                </div>
                <div
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleDelete(scope.row)"
                >
                  <svg-icon
                    icon-class="icon-del"
                    class="mr-[4px]"
                    style="width: 18px; height: 18px"
                  />
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  sopQcPaged,
  sopQcRename,
  sopQcDelete,
  sopQcReRun,
} from "@/api/custom/sopQc.js";
import { downloadPost } from "@/utils/request";
export default {
  name: "QualityControlReport",
  data() {
    return {
      searchForm: {
        reportName: "",
        status: "",
      },
      isLoading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      selectedRows: [],
      tableData: [],
    };
  },
  mounted() {
    this.loadTableData();
  },
  methods: {
    async loadTableData() {
      this.isLoading = true;
      try {
        const params = {
          keyword: this.searchForm.reportName || "",
          status: this.searchForm.status || "",
          pageNum: this.page,
          pageSize: this.pageSize,
        };
        const response = await sopQcPaged(params);
        this.tableData = response.records || [];
        this.total = response.total || 0;
      } catch (error) {
        console.error("加载数据失败:", error);
        this.$message.error("加载数据失败");
      } finally {
        this.isLoading = false;
      }
    },
    getStatusText(status, type) {
      const map = {
        pending: { text: "等待中", icon: "icon-pending" },
        running: { text: "进行中", icon: "icon-running" },
        failed: { text: "失败", icon: "icon-failed" },
        success: { text: "已生成", icon: "icon-success" },
      };
      return map[status][type] || status;
    },
    handleAnalyze() {
      this.$router.push("/agent/qualityAnalysis");
    },
    handleExport() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要导出的数据");
        return;
      }
      downloadPost(
        "/sop/qc/report/export/batch",
        {
          taskIds: this.selectedRows.map((item) => item.id),
        },
        `job_${new Date().getTime()}.zip`
      );
    },
    handleSearch() {
      this.page = 1;
      this.loadTableData();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleView(row) {
      // this.$message.info(`查看报告: ${row.reportName}`)
      this.$router.push({
        path: "/agent/qualityAnalysisDetail",
        query: { taskId: row.id },
      });
    },

    // --- 新增 / 完善的方法区 ---

    // 1. 重命名
    handleRename(row) {
      this.$prompt("请输入新的名称", "重命名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.name || row.reportName, // 设定默认输入框的值
        inputValidator: (value) => {
          if (!value || value.trim() === "") {
            return "名称不能为空";
          }
          return true;
        },
      })
        .then(async ({ value }) => {
          try {
            const params = {
              taskId: row.taskId || row.id, // 请根据后端实际的主键字段调整
              name: value.trim(),
            };
            await sopQcRename(params);
            this.$message.success("重命名成功");
            this.loadTableData(); // 刷新表格数据
          } catch (error) {
            console.error("重命名失败:", error);
            this.$message.error("重命名失败");
          }
        })
        .catch(() => {
          // 取消输入，不进行操作
        });
    },

    // 2. 删除
    handleDelete(row) {
      this.$confirm("确认删除该记录吗？删除后不可恢复", "警告", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          try {
            const params = {
              taskId: row.taskId || row.id, // 请根据后端实际的主键字段调整
            };
            await sopQcDelete(params);
            this.$message.success("删除成功");
            this.loadTableData(); // 刷新表格数据
          } catch (error) {
            console.error("删除失败:", error);
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },

    // 3. 重试
    handleReRun(row) {
      this.$confirm("确认重试该任务吗？", "提示", {
        type: "info",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          try {
            const params = {
              taskId: row.taskId || row.id, // 请根据后端实际的主键字段调整
            };
            await sopQcReRun(params);
            this.$message.success("已提交重试");
            this.loadTableData(); // 刷新表格数据
          } catch (error) {
            console.error("重试失败:", error);
            this.$message.error("重试失败");
          }
        })
        .catch(() => {});
    },

    // --- 分页相关方法 ---
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadTableData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.loadTableData();
    },
  },
};
</script>

<style scoped>
/* 核心的按钮渐变色类 */
.custom-gradient-btn {
  background: linear-gradient(
    90deg,
    rgba(106, 136, 245, 1) 0%,
    rgba(32, 77, 239, 1) 100%
  ) !important;
  color: #ffffff !important;
}
.custom-gradient-btn:hover {
  opacity: 0.9;
}

/* 表格样式覆盖，取消纵向边框并调整行高 */
::v-deep .el-table th.is-leaf,
::v-deep .el-table td {
  border-bottom: 1px solid #f2f3f5;
}
::v-deep .el-table--border th,
::v-deep .el-table--border td {
  border-right: none;
}
::v-deep .el-table__row {
  height: 64px;
}
::v-deep .el-table__body tr:hover > td {
  background-color: #f7f8fa !important;
}

/* 分页组件样式微调 */
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #3662ff;
  color: #fff;
}
</style>
