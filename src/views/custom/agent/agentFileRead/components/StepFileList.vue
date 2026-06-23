<template>
  <div class="w-full mx-auto bg-[#fff] rounded-[8px] p-[16px] h-[100%]">
    <!-- 面包屑导航 -->
    <div class="flex items-center justify-between mb-6">
      <el-breadcrumb separator="/" class="text-gray-500">
        <el-breadcrumb-item>
          <a
            href="javascript:void(0)"
            @click="handleBackToAnalysis"
            class="text-blue-500 hover:text-blue-700"
          >
            解析应用
          </a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>规则解读</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex text-[16px] items-center mb-[16px]">
      <div class="text-[#5F646C]">解析应用</div>
      <div class="text-[#3662FF] font-bold" @click="openUrl">
        {{metaInfo.fileName}}
      </div>
      <!-- <div
        class="bg-[#F5F8FF] text-[14px] text-[#5F646C] rounded-[4px] px-[4px]"
      >
        {{metaInfo.code}}
      </div> -->
    </div>

    <!-- 文件表格容器 -->
    <div class="table-container">
      <el-table :data="fileList" style="width: 100%">
        <el-table-column
          prop="sequence"
          label="序号"
          width="80"
          align="center"
        />

        <el-table-column
          prop="description"
          label="核心要求文本"
          min-width="300"
          show-overflow-tooltip
        />

        <el-table-column
          prop="score"
          label="来源条款编号"
          width="120"
          align="center"
        />

        <el-table-column
          label="关联角色"
          class-name="role-visible"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div
              class="role-tags-container"
              :class="`role-container-${scope.row.id}`"
            >
              <!-- 显示角色标签 -->
              <div class="role-tags-display">
                <div class="role-tags-wrapper">
                  <span
                    v-for="roleValue in getDisplayRoles(scope.row.roles)"
                    :key="roleValue"
                    class="role-tag"
                  >
                    {{ roleValue }}
                  </span>
                </div>
                <!-- 当角色超过3个时显示下拉图标 -->
                <div
                  v-if="scope.row.roles && scope.row.roles.length > 3"
                  class="role-dropdown-trigger"
                  @click.stop="toggleRoleDropdown(scope.row.id)"
                >
                  <i
                    class="el-icon-arrow-down"
                    :class="{ rotated: scope.row.showAllRoles }"
                  ></i>
                </div>
              </div>

              <!-- 下拉浮层显示所有角色 -->
              <div
                v-if="
                  scope.row.showAllRoles &&
                  scope.row.roles &&
                  scope.row.roles.length > 3
                "
                class="role-dropdown-panel"
              >
                <div class="role-dropdown-content">
                  <span
                    v-for="roleValue in scope.row.roles"
                    :key="roleValue"
                    class="role-tag-dropdown"
                  >
                    {{ roleValue }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="强制等级" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              :type="getButtonType(scope.row.actionType)"
              size="mini"
              plain
              round
              @click="handleAction(scope.row)"
            >
              {{ scope.row.actionText }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部操作 -->
    <!-- <div class="flex justify-between mt-6">
      <el-button @click="$emit('prev-step')">
        <i class="el-icon-arrow-left"></i>
        返回分析结果
      </el-button>
      <el-button type="primary" @click="handleStartReading">
        开始解析应用
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "StepFileList",
  props: {
    rulesData: {
      type: Array,
      default: () => [],
    },
    metaInfo:{
      type: Object,
      default: () => {}
    },
  },
  computed: {
    fileList() {
      return this.rulesData.map((rule, index) => ({
        id: index + 1,
        sequence: String(index + 1).padStart(2, "0"),
        description: rule.requirements ? rule.requirements.join("；") : "",
        score: rule.references ? rule.references.join(", ") : "",
        type: rule.category || "",
        roles: rule.involvedRoles || [],
        showAllRoles: false,
        actionType: this.getActionType(rule.forceLevel),
        actionText: rule.forceLevel,
        ruleId: rule.ruleId,
      }));
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 添加全局点击事件监听，点击外部关闭下拉
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    // 移除事件监听
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    openUrl() {
      const url = this.metaInfo.publicUrl;
      if (url) {
        window.open(url, "_blank");
      }
    },
    handleClickOutside(event) {
      // 检查点击是否在角色下拉区域外
      const roleContainers = document.querySelectorAll(".role-tags-container");
      let clickedInside = false;

      roleContainers.forEach((container) => {
        if (container.contains(event.target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        // 关闭所有下拉
        this.fileList.forEach((file) => {
          if (file.showAllRoles) {
            this.$set(file, "showAllRoles", false);
          }
        });
      }
    },

    getActionType(forceLevel) {
      const typeMap = {
        强制性: "danger",
        参考性: "primary", // 默认类型
        推荐性: "warning",
      };
      return typeMap[forceLevel] || "primary";
    },
    getButtonType(actionType) {
      const typeMap = {
        danger: "danger",
        warning: "warning",
        success: "success",
        primary: "primary",
      };
      return typeMap[actionType] || "primary";
    },
    handleTypeChange(file) {
      this.$emit("type-change", { file, newType: file.type });
    },

    getDisplayRoles(roles) {
      if (!roles || roles.length === 0) return [];
      // 如果角色数量<=3个，显示所有；如果>3个，只显示前3个
      return roles.length <= 3 ? roles : roles.slice(0, 3);
    },
    toggleRoleDropdown(fileId) {
      console.log("Toggle dropdown for file:", fileId);

      // 先关闭其他所有下拉
      this.fileList.forEach((file) => {
        if (file.id !== fileId && file.showAllRoles) {
          this.$set(file, "showAllRoles", false);
        }
      });

      // 切换当前下拉状态
      const file = this.fileList.find((f) => f.id === fileId);
      if (file) {
        const newState = !file.showAllRoles;
        this.$set(file, "showAllRoles", newState);
        console.log("File showAllRoles set to:", newState);

        // 强制更新视图
        this.$forceUpdate();
      }
    },
    handleAction(file) {
      this.$emit("file-action", file);
    },
    handleStartReading() {
      const pendingFiles = this.fileList.filter(
        (file) => file.actionType === "danger"
      );
      if (pendingFiles.length > 0) {
        this.$emit("start-reading", pendingFiles);
      } else {
        this.$message.info("所有文件已解读完成");
      }
    },
    handleBackToAnalysis() {
      this.$emit("prev-step");
    },
  },
};
</script>

<style scoped>
/* 表格容器样式 */
.table-container {
  height: calc(100vh - 240px);
  overflow-y: auto;
  overflow-x: auto;
}

::v-deep .el-table__body tr:hover > td {
  background-color: #f5f8ff;
  color: #3662ff;
}
::v-deep .role-visible .cell {
  overflow: visible;
}
/* 角色标签容器 */
.role-tags-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.role-tags-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 24px;
  width: 100%;
}

.role-tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.role-tag {
  background-color: #e8efff;
  color: #5f646c;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;

  line-height: 1.2;
  display: block;
}

.role-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #5f646c;
  transition: all 0.3s;
  border-radius: 2px;
  flex-shrink: 0;
  position: relative;
  z-index: 999;
}

.role-dropdown-trigger:hover {
  color: #3662ff;
}

.role-dropdown-trigger i {
  font-size: 12px;
  transition: transform 0.3s;
}

.role-dropdown-trigger i.rotated {
  transform: rotate(180deg);
}

/* 下拉浮层样式 */
.role-dropdown-panel {
  position: absolute !important;
  top: 0;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 99 !important;
  background: white !important;
  border: 2px solid #3662ff !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  min-width: 200px !important;
  max-width: 300px !important;
  animation: fadeIn 0.2s ease-out !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.role-dropdown-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-start;
}

.role-tag-dropdown {
  background-color: #e8efff;
  color: #5f646c;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  display: block;
  line-height: 1.2;
  width: fit-content;
}

/* 确保表格单元格有足够的层级和溢出处理 */
::v-deep .el-table td {
  position: relative !important;
  overflow: visible !important;
}

::v-deep .el-table {
  overflow: visible !important;
}

::v-deep .el-table__body-wrapper {
  overflow: visible !important;
}

::v-deep .el-table__body {
  overflow: visible !important;
}

::v-deep .el-table__row {
  overflow: visible !important;
}
</style>
