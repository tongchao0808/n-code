<template>
  <div class="min-h-[calc(100vh-55px)] flex flex-col p-4 bg-[#EEF6FD]">
    <div
      class="h-[56px] bg-white rounded-lg flex items-center gap-3 px-4 mb-3 shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
    >
      <el-input
        v-model="searchKeyword"
        placeholder="请输入搜索关键字"
        prefix-icon="el-icon-search"
        class="!w-[240px]"
        clearable
      />

      <el-select
        v-model="selectedType"
        placeholder="请选择类型"
        class="!w-[180px]"
        clearable
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="!w-[320px]"
      />

      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
    </div>

    <div
      class="flex-1 bg-white rounded-lg p-4 flex flex-col overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
    >
      <div class="mb-4">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="handleCreateTask"
        >
          新建任务
        </el-button>
      </div>

      <div class="flex-1 overflow-hidden">
        <BasicTable
          :data-list="taskList"
          :loading="isLoading"
          :header-cell-style="headerCellStyle"
          height="calc(100vh - 320px)"
        >
          <div
            slot="empty"
            class="flex flex-col items-center justify-center pt-[60px] pb-5"
          >
            <img
              src="@/assets/images/custom/empty-kg-doc.svg"
              alt=""
              class="!w-[312px] !h-[242px]"
            />
            <div class="text-[#959BA1] text-[16px] leading-5 mt-4">
              暂无任务
            </div>
          </div>

          <el-table-column type="index" label="序号" align="left" width="60" />

          <el-table-column
            prop="title"
            label="任务名称"
            align="left"
            min-width="200px"
          >
            <template slot-scope="scope">
              <div class="text-[#1D2129] font-medium">
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="taskType"
            label="任务类型"
            align="left"
            min-width="120px"
          >
            <template slot-scope="scope">
              <!-- <el-tag :type="getTaskTypeTag(scope.row.taskType)"> -->
              {{ getTaskTypeText(scope.row.taskType) }}
              <!-- </el-tag> -->
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            label="状态"
            align="left"
            min-width="100px"
          >
            <template slot-scope="scope">
              <svg-icon
                :icon-class="'icon-' + getStatusTag(scope.row.status)"
                style="width: 16px; height: 16px; margin-right: 4px"
              >
              </svg-icon>
              {{ getStatusText(scope.row.status) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="创建时间"
            align="left"
            min-width="160px"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="startDate"
            label="开始时间"
            align="left"
            min-width="120px"
          />

          <el-table-column
            prop="endDate"
            label="完成时间"
            align="left"
            min-width="120px"
          />

          <el-table-column
            prop="creatorName"
            label="创建人"
            align="left"
            min-width="120px"
          />

          <el-table-column
            label="操作"
            align="left"
            min-width="180px"
            fixed="right"
          >
            <template slot-scope="scope">
              <div
                class="h-[42px] inline-flex flex-row items-center justify-between p-1 rounded-lg bg-[#E8EFFF] gap-x-2 text-[12px] xl:text-[14px]"
              >
                <div
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleView(scope.row)"
                >
                  <i class="el-icon-view !text-[18px] mr-1" />
                  查看
                </div>
                <div
                  v-if="scope.row.status === 'NOT_STARTED'"
                  class="h-[34px] px-2 rounded-lg text-[#3662FF] flex items-center cursor-pointer hover:bg-[#D4E5FF] transition-colors"
                  @click.stop="handleEdit(scope.row)"
                >
                  <i class="el-icon-edit !text-[18px] mr-1" />
                  编辑
                </div>
                <div
                  class="h-[34px] px-2 rounded-lg text-[#F56C6C] flex items-center cursor-pointer hover:bg-[#FFECE8] transition-colors"
                  @click.stop="handleDelete(scope.row)"
                >
                  <i class="el-icon-delete !text-[18px] mr-1" />
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </BasicTable>
      </div>

      <div class="flex justify-end mt-4">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page"
          :limit.sync="pageSize"
          @pagination="loadTaskList"
        />
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="showTaskDialog"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskRules"
        label-position="top"
        class="task-form"
      >
        <el-form-item label="任务名称" prop="title">
          <el-input
            v-model="taskForm.title"
            placeholder="请输入任务名称"
            :disabled="dialogType === 'view'"
          />
        </el-form-item>

        <el-form-item label="任务类型" prop="taskType">
          <el-select
            v-model="taskForm.taskType"
            placeholder="请选择任务类型"
            class="!w-full"
            :disabled="dialogType === 'view'"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务开始时间" prop="startDate">
              <el-date-picker
                v-model="taskForm.startDate"
                type="date"
                placeholder="请选择开始时间"
                value-format="yyyy-MM-dd"
                class="!w-full"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务结束时间" prop="endDate">
              <el-date-picker
                v-model="taskForm.endDate"
                type="date"
                placeholder="请选择结束时间"
                value-format="yyyy-MM-dd"
                class="!w-full"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
            :disabled="dialogType === 'view'"
          />
        </el-form-item>

        <el-form-item label="任务相关人" prop="relatedUserIds">
          <el-select
            v-model="taskForm.relatedUserIds"
            multiple
            filterable
            placeholder="请选择相关人"
            class="!w-full"
            :disabled="dialogType === 'view'"
          >
            <el-option
              v-for="item in personOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="相关附件" prop="fileList">
          <FileUpload
            v-model="taskForm.fileList"
            :is-show-tip="false"
            :class="{ 'hide-upload-trigger': dialogType === 'view' }"
            class="custom-file-upload"
            :disabled="dialogType === 'view'"
            :is-del-confirm="true"
            :limit="10"
            :file-size="50"
            :file-type="['jpg', 'png', 'docx', 'xlsx', 'xls', 'pdf']"
            url="/work/task/upload"
            del-confirm-text="确定要删除该文件吗？"
            @change="handleFileChange"
            @success="handleFileSuccess"
          >
            <div
              class="w-[554px] py-[12px] rounded-lg bg-[#E8EFFF] border border-[#C9CDD4] flex flex-col justify-center items-center gap-[6px] cursor-pointer hover:bg-[#D4E5FF] transition-colors mix-blend-normal"
            >
              <svg-icon
                icon-class="upload-icon"
                style="width: 32px; height: 32px"
              />
              <div class="text-[12px] text-[#1D2129]">
                将文件拖拽至此区域或<span class="text-[#3662FF]"
                  >选择文件上传</span
                >
              </div>
              <div class="text-[12px] text-[#C9CDD4]">
                支持文件格式：jpg、png、docx、excel、pdf
              </div>
            </div>
          </FileUpload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showTaskDialog = false">{{
          dialogType === "view" ? "关闭" : "取消"
        }}</el-button>
        <el-button
          v-if="dialogType !== 'view'"
          type="primary"
          @click="handleSubmitTask"
          :loading="submitLoading"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/custom/table/BasicTable.vue";
// import FileUpload from "@/components/custom/upload/FileUpload.vue";
import {
  workTaskList,
  workTaskCreate,
  workTaskUpdate,
  workTaskDelete,
  workTaskDetail,
  workTaskOptions,
} from "@/api/custom/work";
import { listUser } from "@/api/system/user";

export default {
  name: "Task",
  components: {
    BasicTable,
    // FileUpload,
  },
  data() {
    return {
      searchKeyword: "",
      selectedType: "",
      dateRange: [],
      typeOptions: [], // 从接口获取
      personOptions: [], // 从用户列表接口获取

      taskList: [],
      isLoading: false,
      submitLoading: false,

      page: 1,
      pageSize: 10,
      total: 0,

      headerCellStyle: {
        "background-color": "#FFF",
        color: "#959BA1",
        "font-size": "14px",
        "font-weight": "400",
        "text-align": "left",
      },

      // 弹窗相关
      showTaskDialog: false,
      dialogType: "create", // 'create', 'view', 'edit'
      taskForm: {
        id: undefined,
        title: "",
        taskType: "",
        startDate: "",
        endDate: "",
        description: "",
        relatedUserIds: [],
        fileList: [],
      },
      taskRules: {
        title: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        taskType: [
          { required: true, message: "请选择任务类型", trigger: "change" },
        ],
        startDate: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const titleMap = {
        create: "新建任务",
        edit: "编辑任务",
        view: "查看任务",
      };
      return titleMap[this.dialogType];
    },
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.loadTaskOptions();
      await this.loadUserOptions();
      this.loadTaskList();
    },

    // 获取任务类型枚举
    async loadTaskOptions() {
      try {
        const res = await workTaskOptions();
        if (res.code === 200) {
          this.typeOptions = res.data;
        }
      } catch (error) {
        console.error("获取任务类型失败", error);
      }
    },

    // 获取系统用户作为关联人选项
    async loadUserOptions() {
      try {
        // 请求足够大的pageSize来获取用户作为下拉选项，或者通过关键字搜索（视业务逻辑定）
        const res = await listUser({ pageNum: 1, pageSize: 500 });
        if (res.code === 200) {
          this.personOptions = res.rows.map((item) => ({
            label: item.nickName || item.userName,
            value: item.userId,
          }));
        }
      } catch (error) {
        console.error("获取用户列表失败", error);
      }
    },

    handleSearch() {
      this.page = 1;
      this.loadTaskList();
    },

    // 分页加载任务列表
    async loadTaskList() {
      this.isLoading = true;
      try {
        const params = {
          pageNum: this.page,
          pageSize: this.pageSize,
          keyword: this.searchKeyword,
          taskType: this.selectedType || undefined,
          rangeStartDate:
            this.dateRange && this.dateRange.length > 0
              ? this.dateRange[0]
              : undefined,
          rangeEndDate:
            this.dateRange && this.dateRange.length > 1
              ? this.dateRange[1]
              : undefined,
        };

        const res = await workTaskList(params);

        if (res.code === 200) {
          this.taskList = res.data.page.records;
          this.total = res.data.page.total;
        }
      } catch (error) {
        console.error("加载任务列表失败:", error);
        this.$message.error("加载任务列表失败");
      } finally {
        this.isLoading = false;
      }
    },

    // 打开新建任务弹窗
    handleCreateTask() {
      this.dialogType = "create";
      this.showTaskDialog = true;
      this.resetTaskForm();
    },

    // 打开查看任务弹窗
    handleView(row) {
      this.dialogType = "view";
      this.showTaskDialog = true;
      this.loadTaskDetail(row.id);
    },

    // 打开编辑任务弹窗
    handleEdit(row) {
      this.dialogType = "edit";
      this.showTaskDialog = true;
      this.loadTaskDetail(row.id);
    },

    // 加载任务详情
    async loadTaskDetail(id) {
      try {
        const res = await workTaskDetail({ id });
        if (res.code === 200) {
          const data = res.data;
          this.taskForm = {
            id: data.id,
            title: data.title,
            taskType: data.taskType,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            relatedUserIds: data.relatedUsers
              ? data.relatedUsers.map((u) => u.userId)
              : [],
            // 组装组件所需的文件格式
            fileList: data.attachments
              ? data.attachments.map((att) => ({
                  name: att.name,
                  url: att.publicUrl,
                  attachmentId: att.attachmentId,
                  uid: att.attachmentId,
                }))
              : [],
          };
        }

        console.log("任务详情数据:", res.data);
        console.log("任务详情数据:", this.taskForm);
      } catch (error) {
        console.error("获取详情失败", error);
        this.$message.error("获取详情失败");
      }
    },

    // 重置表单
    resetTaskForm() {
      this.taskForm = {
        id: undefined,
        title: "",
        taskType: "",
        startDate: "",
        endDate: "",
        description: "",
        relatedUserIds: [],
        fileList: [],
      };
      if (this.$refs.taskForm) {
        this.$refs.taskForm.clearValidate();
      }
    },

    // 弹窗关闭回调
    handleDialogClose() {
      this.resetTaskForm();
    },

    // 提交任务
    handleSubmitTask() {
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          try {
            const attachmentIds = this.taskForm.fileList
              .map((item) => {
                // 如果是之前已经上传过的回显文件，直接取 attachmentId
                if (item.attachmentId) {
                  return item.attachmentId;
                }
                // 如果是本次刚上传的新文件，从 response 中取
                if (item.response && item.response.data) {
                  return item.response.data.attachmentId;
                }
                return null;
              })
              .filter((id) => id); // 过滤掉 null 或 undefined

            const payload = {
              title: this.taskForm.title,
              taskType: this.taskForm.taskType,
              startDate: this.taskForm.startDate,
              endDate: this.taskForm.endDate,
              description: this.taskForm.description,
              relatedUserIds: this.taskForm.relatedUserIds,
              attachmentIds: attachmentIds,
            };

            if (this.dialogType === "create") {
              const res = await workTaskCreate(payload);
              if (res.code === 200) {
                this.$message.success("任务创建成功");
                this.showTaskDialog = false;
                this.loadTaskList();
              }
            } else if (this.dialogType === "edit") {
              payload.id = this.taskForm.id;
              const res = await workTaskUpdate(payload);
              if (res.code === 200) {
                this.$message.success("任务更新成功");
                this.showTaskDialog = false;
                this.loadTaskList();
              }
            }
          } catch (error) {
            console.error("提交任务失败:", error);
          } finally {
            this.submitLoading = false;
          }
        }
      });
    },

    // 删除任务
    handleDelete(row) {
      this.$confirm(`确定要删除任务「${row.title}」吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await workTaskDelete({ ids: [row.id] });
            if (res.code === 200) {
              this.$message.success("删除成功");
              // 如果当前页只有一条数据且不是第一页，删除后跳到上一页
              if (this.taskList.length === 1 && this.page > 1) {
                this.page--;
              }
              this.loadTaskList();
            }
          } catch (error) {
            console.error("删除失败", error);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 文件列表变化
    handleFileChange(fileList) {
      this.taskForm.fileList = fileList;
    },

    // 文件上传成功
    handleFileSuccess(fileList) {
      this.taskForm.fileList = fileList;
      this.$message.success("文件上传成功");
      console.log("文件列表变化:", fileList);
    },

    // 格式化解析日期，可根据项目 utils 进行替换
    parseTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const y = date.getFullYear();
      const m = (date.getMonth() + 1 + "").padStart(2, "0");
      const d = (date.getDate() + "").padStart(2, "0");
      const h = (date.getHours() + "").padStart(2, "0");
      const min = (date.getMinutes() + "").padStart(2, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return `${y}-${m}-${d} ${h}:${min}:${s}`;
    },

    // UI 样式 - 任务类型Tag
    getTaskTypeTag(type) {
      const typeObj = this.typeOptions.find((item) => item.value === type);
      if (!typeObj) return "";
      const map = {
        PROCESS_TODO: "",
        PROCESS_APPLY: "success",
        FILE_REVISION: "warning",
      };
      return map[type] || "";
    },

    // UI 样式 - 任务类型文本
    getTaskTypeText(type) {
      const typeObj = this.typeOptions.find((item) => item.value === type);
      return typeObj ? typeObj.label : type;
    },

    // UI 样式 - 状态Tag
    getStatusTag(status) {
      const statusMap = {
        COMPLETED: "success",
        NOT_STARTED: "info",
        IN_PROGRESS: "pending",
      };
      return statusMap[status] || "success";
    },

    // UI 样式 - 状态文本
    getStatusText(status) {
      const statusMap = {
        COMPLETED: "已完成",
        NOT_STARTED: "待开始",
        IN_PROGRESS: "进行中",
      };
      return statusMap[status] || status;
    },
  },
};
</script>

<style scoped>
.hide-upload-trigger ::v-deep .el-upload {
  display: none !important;
}

.hide-upload-trigger ::v-deep .el-upload-list__item .el-icon-error {
  display: none !important;
}
::v-deep .el-table__row {
  height: 60px;
}

::v-deep .el-table__body tr:hover > td {
  background-color: #f5f8ff !important;
}

.task-form {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
}

.task-form ::v-deep .el-form-item__label {
  line-height: 32px;
  font-weight: 500;
  color: #1d2129;
}

.task-form ::v-deep .el-form-item {
  margin-bottom: 18px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 滚动条美化 */
.task-form::-webkit-scrollbar {
  width: 6px;
}
.task-form::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 4px;
}
.task-form::-webkit-scrollbar-track {
  background: transparent;
}
</style>
