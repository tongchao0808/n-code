<template>
  <el-dialog
    title="角色配置"
    :visible.sync="visible"
    width="90%"
    top="5vh"
    :before-close="handleClose"
    custom-class="detail-dialog"
  >
    <div class="dialog-content">
      <div class="scroll-container">
        <!-- 内容卡片列表 -->
        <div class="content-cards" :class="{'items-center justify-center': contentList.length === 1}">
          <div
            v-for="(item, index) in contentList"
            :key="index"
            class="content-card"
          >
            <!-- 左边框 -->
            <div
              class="left-border"
              :style="{ backgroundColor: item.borderColor }"
            ></div>

            <!-- 卡片内容 -->
            <div class="card-content">
              <!-- 标题 -->
              <h3 class="card-title">{{ item.title }}</h3>

              <!-- 待办事项 -->
              <div class="todo-section">
                <h4 class="section-title">待办事项</h4>
                <div class="todo-container">
                  <div class="todo-list">
                    <div
                      v-for="todo in item.todos"
                      :key="todo.id"
                      class="todo-item"
                    >
                      <el-checkbox
                        v-model="todo.checked"
                        class="flex items-baseline todo-checkbox"
                        @change="handleTodoChange(item, todo)"
                      >
                        <span class="todo-text">{{ todo.text }}</span>
                      </el-checkbox>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 关联规则 -->
              <div class="rules-section">
                <h4 class="section-title">关联规则</h4>
                <div class="rules-container">
                  <div class="rules-tags">
                    <el-tag
                      v-for="rule in item.rules"
                      :key="rule.id"
                      :type="rule.type"
                      size="small"
                      class="rule-tag"
                    >
                      {{ rule.text }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 相关文档 -->
              <div class="docs-section">
                <h4 class="section-title">相关文档</h4>
                <div class="docs-container">
                  <div class="docs-list">
                    <div
                      v-for="doc in item.docs"
                      :key="doc.id"
                      class="doc-item"
                    >
                      <i class="el-icon-document doc-icon"></i>
                      <span class="doc-name">{{ doc.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DetailDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    roleData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      todoStates: {}
    }
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    contentList() {
      const colors = [
        "#52c41a",
        "#1890ff",
        "#faad14",
        "#f5222d",
        "#722ed1",
        "#13c2c2",
      ];

      return this.roleData.map((role, index) => ({
        title: role.roleName,

        borderColor: colors[index % colors.length],
        todos: role.todoLists.map((todo, todoIndex) => {
          const todoId = `${index}-${todoIndex}`;
          // 初始化todoStates中的状态
          if (this.todoStates[todoId] === undefined) {
            this.$set(this.todoStates, todoId, false);
          }

          return {
            id: todoIndex + 1,
            text: todo,
            checked: this.todoStates[todoId],
            todoId: todoId
          }
        }),
        rules: role.involvedRuleIds.map((ruleId, ruleIndex) => ({
          id: ruleIndex + 1,
          text: ruleId,
          type:
            ruleIndex % 4 === 0
              ? "success"
              : ruleIndex % 4 === 1
              ? "warning"
              : ruleIndex % 4 === 2
              ? "info"
              : "primary",
        })),
        docs: role.involvedReferences.map((ref, refIndex) => ({
          id: refIndex + 1,
          name: ref,
        })),
      }));
    },
  },

  methods: {
    handleClose() {
      this.visible = false;
    },
    handleTodoChange(item, todo) {
      console.log(`${item.title} - ${todo.text}: ${todo.checked}`);
      // 更新todoStates中的状态
      this.$set(this.todoStates, todo.todoId, todo.checked);
    },
  },
};
</script>

<style scoped>
::v-deep .detail-dialog {
  border-radius: 12px;
}

::v-deep .detail-dialog .el-dialog__header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}

::v-deep .detail-dialog .el-dialog__body {
  padding: 0;
  height: 70vh;
}

.dialog-content {
  height: 100%;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 20px;
}

/* 横向滚动条样式 */
.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #43a3f5 0%, #00d9fe 100%);
}

.content-cards {
  display: flex;
  gap: 20px;
  min-width: fit-content;
}

.content-card {
  position: relative;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  width: 320px;
  flex-shrink: 0;
}

.content-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.left-border {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.card-content {
  padding: 20px;
  padding-left: 24px;
  max-height: 500px;
  overflow-y: auto;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 8px 0;
}

.todo-section {
  margin-bottom: 16px;
}

.todo-container {
  /* 移除滚动设置 */
}

.todo-container::-webkit-scrollbar {
  /* 移除滚动设置 */
}

.todo-container::-webkit-scrollbar-track {
  /* 移除滚动设置 */
}

.todo-container::-webkit-scrollbar-thumb {
  /* 移除滚动设置 */
}

.todo-container::-webkit-scrollbar-thumb:hover {
  /* 移除滚动设置 */
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f5f5f5;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-checkbox {
  flex: 1;
  margin-right: 8px;
}

.todo-checkbox ::v-deep .el-checkbox__label {
  padding-left: 8px;
}

.todo-text {
  font-size: 13px;
  color: #666;
  word-wrap: break-word;
  white-space: break-spaces;
}

.rules-section {
  margin-bottom: 16px;
}

.rules-container {
  /* 移除滚动设置 */
}

.rules-container::-webkit-scrollbar {
  /* 移除滚动设置 */
}

.rules-container::-webkit-scrollbar-track {
  /* 移除滚动设置 */
}

.rules-container::-webkit-scrollbar-thumb {
  /* 移除滚动设置 */
}

.rules-container::-webkit-scrollbar-thumb:hover {
  /* 移除滚动设置 */
}

.rules-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rule-tag {
  font-size: 12px;
}

.docs-section {
  margin-bottom: 0;
}

.docs-container {
  /* 移除滚动设置 */
}

.docs-container::-webkit-scrollbar {
  /* 移除滚动设置 */
}

.docs-container::-webkit-scrollbar-track {
  /* 移除滚动设置 */
}

.docs-container::-webkit-scrollbar-thumb {
  /* 移除滚动设置 */
}

.docs-container::-webkit-scrollbar-thumb:hover {
  /* 移除滚动设置 */
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.doc-icon {
  color: #1890ff;
  margin-right: 6px;
  font-size: 14px;
}

.doc-name {
  font-size: 13px;
  color: #666;
}
</style>
