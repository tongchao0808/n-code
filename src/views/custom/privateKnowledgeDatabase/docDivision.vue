<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex items-center px-4 py-2">
      <el-button
        icon="el-icon-arrow-left"
        type="text"
        class="mr-2 !text-[#959BA1]"
        @click="goBack"
        >返回文件列表</el-button
      >
      <span class="font-medium text-text">{{ title }}</span>
    </div>

    <div v-loading="loading" class="flex flex-col flex-1 overflow-hidden">
      <div
        class="flex items-center justify-between px-4 py-3 border-t border-b"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm text-textLight text-[#959BA1]">
            <span class="text-[#3662FF]">{{ divisionData.length }}</span
            >个段落
          </div>
        </div>
        <el-button type="primary" size="small" @click="openAddDialog">
          添加分段
        </el-button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="flex flex-col w-64 gap-2 p-2 border-r bg-sidebar">
          <div
            v-for="(item, index) in divisionData"
            :key="index"
            class="text-ellipsis-2-lines"
            :class="[
              'px-4 py-2 cursor-pointer rounded-[6px] overflow-hidden',
              activeMenu === index
                ? 'bg-[#f5f8ff] border-l-[3px] border-[#3964ff]'
                : 'hover:bg-gray-50',
            ]"
            @click="scrollToSection(index)"
            :title="item.a || item.usTitle"
          >
            {{ item.a || item.usTitle || "标题" + (index + 1) }}
          </div>
        </div>

        <div class="flex flex-col flex-1">
          <div
            ref="contentContainer"
            class="flex-1 p-6 overflow-y-auto scrollbar-thin"
            @scroll="handleScroll"
          >
            <div
              v-for="(item, index) in divisionData"
              :id="`section-${index}`"
              :key="index"
              class="mb-4 p-4 rounded bg-[#f5f8ff]"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-bold">
                  {{ item.usTitle || "标题" + (index + 1) }}
                </h3>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleDevectorize(item, index)"
                >
                  向量化
                </el-button>
              </div>
              <p
                class="text-sm leading-relaxed text-textLight"
                v-html="item.q"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="新增分段"
      :visible.sync="showAddDialog"
      width="60%"
      :close-on-click-modal="false"
      @close="resetAddForm"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-form-item label="分段标题" prop="title">
          <el-input
            v-model="addForm.title"
            placeholder="请输入分段标题"
            maxlength="256"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="分段内容" prop="content">
          <template slot="label">
            分段内容<span style="color: #f56c6c; margin-left: 4px">*</span>
          </template>
          <el-input
            type="textarea"
            v-model="addForm.content"
            placeholder="请输入分段内容"
            :rows="10"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="addLoading"
          @click="submitAddSegment"
        >
          确认导入
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="向量化结果"
      :visible.sync="showVectorDialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-loading="vectorLoading" class="vector-result">
        <div v-if="vectorResult && vectorResult.length > 0">
          <div class="p-4 overflow-auto rounded bg-gray-50 max-h-96">
            {{ formatJSON(vectorResult) }}
          </div>
        </div>
        <div v-else class="py-8 text-center text-gray-400">暂无数据</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showVectorDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  docDivision,
  segmentationVector,
  docInsertData, // 确保接口被正确引入
} from "@/api/custom/customKnowledgeBase";

export default {
  name: "GastricCancerDoc",
  data() {
    return {
      divisionData: {},
      title: this.$route.query.name,
      activeMenu: 0,
      searchType: "title",
      searchKeyword: "",
      isScrolling: false,
      loading: false,
      showVectorDialog: false,
      vectorLoading: false,
      vectorResult: null,

      // 新增分段相关数据
      showAddDialog: false,
      addLoading: false,
      addForm: {
        title: "",
        content: "",
      },
      addRules: {
        content: [
          { required: true, message: "请输入分段内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 提取获取数据的逻辑，方便刷新列表
    fetchData() {
      this.loading = true;
      docDivision({
        documentId: this.$route.query.docId,
      })
        .then((res) => {
          this.divisionData = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    goBack() {
      this.$router.go(-1);
    },
    handleMenuSelect(index) {
      this.activeMenu = index;
    },
    handleSearch() {
      console.log(
        "搜索类型：",
        this.searchType,
        "搜索关键词：",
        this.searchKeyword
      );
    },
    scrollToSection(index) {
      this.activeMenu = index;
      this.isScrolling = true;
      const section = document.getElementById(`section-${index}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          this.isScrolling = false;
        }, 1000);
      } else {
        this.isScrolling = false;
      }
    },
    handleScroll() {
      if (this.isScrolling) return;

      const container = this.$refs.contentContainer;
      if (!container) return;

      const sections = container.querySelectorAll('[id^="section-"]');
      let currentSection = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = index;
        }
      });

      if (this.activeMenu !== currentSection) {
        this.activeMenu = currentSection;
      }
    },
    async handleDevectorize(item, index) {
      this.showVectorDialog = true;
      this.vectorLoading = true;
      this.vectorResult = null;

      try {
        const params = {
          datasetId: item.datasetId,
          collectionId: item.collectionId,
          chunkIndex: index,
        };

        const response = await segmentationVector(params);

        if (response.code === 200) {
          this.vectorResult = response.data?.vectors || [];
        } else {
          this.$message.error(response.msg || "向量化失败");
          this.vectorResult = [];
        }
      } catch (error) {
        console.error("向量化错误:", error);
        this.$message.error("向量化请求失败");
        this.vectorResult = [];
      } finally {
        this.vectorLoading = false;
      }
    },

    // --- 新增分段相关方法 ---
    openAddDialog() {
      this.showAddDialog = true;
    },
    resetAddForm() {
      if (this.$refs.addFormRef) {
        this.$refs.addFormRef.resetFields();
      }
      this.addForm = {
        title: "",
        content: "",
      };
    },
    submitAddSegment() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          this.addLoading = true;
          try {
            // 根据要求构造提交参数
            const params = {
              collectionId: this.divisionData[0].collectionId, // 使用文档的 ID
              q: this.addForm.content, // 分段内容
              a: this.addForm.title || "", // 分段标题
              indexes: [], // 传空数组
            };

            const response = await docInsertData(params);

            if (response.code === 200) {
              this.$message.success("添加分段成功");
              this.showAddDialog = false;
              // 提交成功后重新获取列表数据刷新页面
              this.fetchData();
            } else {
              this.$message.error(response.msg || "添加分段失败");
            }
          } catch (error) {
            console.error("添加分段错误:", error);
            this.$message.error("添加分段请求失败");
          } finally {
            this.addLoading = false;
          }
        }
      });
    },

    formatJSON(data) {
      if (!data) return "";
      try {
        const jsonString = JSON.stringify(data, null, 2);
        let formatted = jsonString.replace(/([。？！])\s*"/g, '$1"\n');
        formatted = formatted.replace(/([.!?])\s*"/g, '$1"\n');
        formatted = formatted.replace(/,\s*"/g, ',\n"');
        formatted = formatted.replace(/,\s*\[/g, ",\n[");
        formatted = formatted.replace(/,\s*\{/g, ",\n{");
        formatted = formatted.replace(/"\s*:\s*/g, '": ');
        return formatted;
      } catch (error) {
        console.error("JSON格式化错误:", error);
        return JSON.stringify(data, null, 2);
      }
    },
  },
};
</script>

<style scoped>
/* 保持原有样式 */
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 2px;
}

.bg-blue-50 {
  background-color: #f0f7ff;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.vector-result pre {
  font-family: "Courier New", monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}
.text-ellipsis-2-lines {
  white-space: nowrap; /* 1. 强制文本在一行内显示，绝对不换行 */
  overflow: hidden; /* 2. 隐藏超出容器宽度的部分 */
  text-overflow: ellipsis; /* 3. 当文本溢出时，在末尾显示省略号 (...) */
}
</style>
