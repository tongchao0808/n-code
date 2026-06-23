<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- 顶部导航栏 -->
    <div class="flex items-center px-4 py-2 border-b">
      <el-button
        icon="el-icon-arrow-left"
        type="text"
        class="mr-2 !text-[#959BA1]"
        @click="goBack"
        >返回文件列表</el-button
      >
    </div>
    <div class="flex flex-col flex-1 overflow-hidden px-[20px] pb-[20px]">
      <el-tabs v-if="step === 0" v-model="activeName">
        <el-tab-pane
          v-for="item in tabs"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <div class="flex flex-col h-full">
            <div class="flex flex-col">
              <div
                class="bg-[#e8efff] rounded-[8px] p-[16px] flex items-center"
              >
                <i
                  class="el-icon-warning text-[#3662ff] transform scale-[1.2]"
                />
                <div class="flex flex-col gap-[4px] ml-[16px]">
                  <div
                    v-for="text in item.textList"
                    :key="text"
                    class="text-[#5F646C]"
                  >
                    {{ text }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-hidden">
              <FileUpload
                v-model="uploadFileList"
                :is-show-tip="false"
                url="/attachment/knowledge/upload"
                class="w-full h-[190px] my-[16px]"
                drag
                multiple
                :file-type="item.limitType"
                :data="{ meta }"
              >
                <!-- <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>-->
                <div class="flex flex-col items-center justify-center h-full">
                  <i
                    class="el-icon-upload text-[#959ba1] transform scale-[3]"
                  />
                  <div class="mt-[20px] mb-[5px]">
                    将拖拽文件到此处或
                    <em>选择文件上传</em>
                  </div>
                  <p class="text-[12px] text-[#959ba1]">
                    支持格式：{{ item.limitType.join("、") }}
                  </p>
                </div>
              </FileUpload>
            </div>

            <div class="flex justify-end w-full">
              <el-button size="small" @click="goBack">取消</el-button>
              <el-button
                size="small"
                type="primary"
                :disabled="uploadFileList.length === 0"
                @click="nextStep"
                >下一步</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <rules
        v-else
        :file-list="uploadFileList"
        @close="goBack"
        @prev="nextStep"
        @submit="goBack"
      />
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import rules from "./rules.vue";

export default {
  components: {
    rules,
  },
  data() {
    return {
      meta: new Blob(
        [
          JSON.stringify({
            knowledgeDatabaseId: this.$route.query.id,
            pathId: this.$route.query.pathId || 0,
          }),
        ],
        { type: "application/json" }
      ),
      tabs: [
        {
          label: "文本文件",
          name: "1",
          textList: [
            "1.文件上传前，建议规范文件的分段标识",
            "2. 每次最多上传 50 个文件, 每个文件不超过 100 MB",
          ],
          limitType: ["TXT", "PDF", "DOCX", "XLS", "XLSX", "CSV"],
        },
        {
          label: "表格",
          name: "2",
          textList: [
            "2.第一行必须是列标题，且列标题必须是有意义的术语，表中每条记录将作为一个分段",
            "3.上传的表格文件中每个sheet会作为一个文档，sheet名称为文档名称",
            "4.每次最多上传50个文件，每个文件不超过100MB",
          ],
          limitType: ["XLS", "XLSX", "CSV"],
        },
      ],
      activeName: "1",
      uploadFileList: [],
      step: 0,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    nextStep(next = true) {
      if (next) {
        this.step++;
      } else {
        this.step--;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .upload-file-uploader,
  .el-upload,
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    background-color: #f8f9fa;
  }

  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__content {
      flex: 1;
      overflow: hidden;

      .el-tab-pane {
        height: 100%;
      }
    }

    .el-tabs__nav-wrap {
      &::after {
        background: #f2f3f5;
        height: 1px;
      }
    }

    .upload-file-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }
}
</style>
