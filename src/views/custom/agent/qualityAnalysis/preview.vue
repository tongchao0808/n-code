<template>
  <div class="w-full h-full flex flex-col bg-[#fff] overflow-auto">
    <div class="w-full px-[32px] pt-[20px] flex items-center gap-[12px]">
      <a
        @click="$router.push('/smart/agent/qualityAnalysisList')"
        class="text-[14px] text-[#959ba1]"
      >
        <i class="el-icon-arrow-left text-[14px]"></i>返回质控分析列表</a
      >
      <span class="text-[16px] text-[#1D2129]">
        {{ previewData.reportName }}</span
      >
    </div>

    <div class="px-[32px] py-[16px] flex justify-between">
      <h2 class="text-[20px] font-bold text-[#1D2129]">质检报告预览</h2>
      <el-button
        type="primary"
        size="small"
        plain
        class="border-[#3662FF] text-[#3662FF]"
        icon="el-icon-download"
        @click="exportReport"
        >下载pdf报告</el-button
      >
    </div>
    <div class="px-[32px]">
      <div class="report-info-box mb-[16px]" v-loading="loading">
        <div class="flex flex-wrap items-center justify-between h-full">
          <div class="flex flex-col gap-[8px] min-w-[300px]">
            <div class="flex items-center text-[14px] text-[#4E5969]">
              <i class="mr-2 el-icon-document"></i>报告信息
            </div>
            <div class="text-[14px] text-[#959ba1]">
              报告名称：<span class="text-[#959ba1]">{{
                previewData.reportName
              }}</span>
            </div>
            <div class="text-[14px] text-[#959ba1]">
              质控文件：<span class="text-[#959ba1]">{{
                previewData.reportExcelName
              }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-[8px]">
            <div class="text-[14px] text-[#959ba1]">
              生成时间：{{ previewData.reportTime }}
            </div>
            <div class="text-[14px] text-[#959ba1]">
              总体结果：
              <span :class="isQualified ? 'text-[#03CEA1]' : 'text-[#FF5656]'">
                {{ isQualified ? "合格" : "不合格" }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-[8px]">
            <div class="text-[14px] text-[#959ba1]">
              质检依据：{{ previewData.reportSopFileName }}
            </div>
            <div class="text-[14px] text-[#959ba1]">
              合格率：<span class="">{{ previewData.passRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-[32px] grid grid-cols-2 gap-[16px] mb-[24px]">
      <div
        class="bg-white border border-[#03CEA1] rounded-[8px] p-[24px] flex flex-col justify-center"
      >
        <div class="flex items-baseline gap-[4px] text-[#03CEA1]">
          <span class="text-[48px] font-bold">{{ previewData.passCount }}</span>
          <span class="text-[18px]">项</span>
        </div>
        <div class="flex items-center gap-[8px] text-[#03CEA1] text-[18px]">
          <i class="el-icon-circle-check"></i> 规则已合格
        </div>
      </div>
      <div
        class="bg-white border border-[#FF5656] rounded-[8px] p-[24px] flex flex-col justify-center relative"
      >
        <div class="flex items-baseline gap-[4px] text-[#FF5656]">
          <span class="text-[48px] font-bold">{{
            previewData.unPassCount
          }}</span>
          <span class="text-[18px]">项</span>
        </div>
        <div class="flex items-center gap-[8px] text-[#FF5656] text-[18px]">
          <i class="el-icon-circle-close"></i> 规则不合格
        </div>
        <!-- <i class="el-icon-time absolute right-[40px] top-[40px] text-[60px] text-[#FF565622]"></i> -->
      </div>
    </div>

    <div
      class="px-[32px] rounded-[8px] flex-1 mb-[32px] flex flex-col overflow-hidden"
    >
      <div class="text-[16px] font-bold mb-[16px]">质检详情列表</div>
      <div class="flex-1 overflow-hidden">
        <el-table
          :data="tableData"
          height="100%"
          :header-cell-style="headerCellStyle"
          style="width: 100%"
        >
          <!-- <el-table-column type="index" width="80" label="序号"></el-table-column> -->

          <el-table-column
            v-for="(header, index) in previewData.headers"
            :key="index"
            :label="header"
            min-width="150"
          >
            <template slot-scope="scope">
              <div v-if="header.includes('结果')">
                <span
                  v-if="scope.row['col_' + index] === '合格'"
                  class="px-[12px] py-[2px] rounded-[99px] text-[#6DD401] border border-[#6DD401] bg-[#6DD4010A]"
                  >合格</span
                >
                <span
                  v-else-if="scope.row['col_' + index] === '不合格'"
                  class="px-[12px] py-[2px] rounded-[99px] text-[#FF5656] border border-[#FF5656] bg-[#FF56560A]"
                  >不合格</span
                >
                <span v-else>{{ scope.row["col_" + index] }}</span>
              </div>

              <div
                v-else-if="header.includes('原因') || header.includes('说明')"
              >
                <span
                  :class="{
                    'text-[#FF5656]':
                      scope.row['col_' + index] &&
                      scope.row['col_' + index] !== '-',
                  }"
                >
                  {{ scope.row["col_" + index] }}
                </span>
              </div>

              <div v-else>
                <span
                  :class="{
                    'text-[#FF5656]': isNumericError(scope.row['col_' + index]),
                  }"
                >
                  {{ scope.row["col_" + index] }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadPost } from "@/utils/request";
import { sopQcReportPreview, sopQcPassThreshold } from "@/api/custom/sopQc.js";

export default {
  name: "QualityAnalysisPreview",
  data() {
    return {
      taskId: null,
      loading: false,
      thresholdData: 0,
      previewData: {
        reportName: "",
        reportTime: "",
        reportSopFileName: "",
        reportSopFileUrl: "",
        reportExcelName: "",
        passRate: 0,
        passCount: 0,
        unPassCount: 0,
        headers: [],
        rows: [],
      },
      tableData: [],
      headerCellStyle: {
        "background-color": "#F7F8FA",
        color: "#4E5969",
        "font-size": "14px",
        "font-weight": "bold",
        "text-align": "left",
        height: "50px",
      },
    };
  },
  computed: {
    isQualified() {
      // 逻辑调整：passRate(实际) >= thresholdData(阈值) 则合格
      // 如果 thresholdData 大于 passRate，就不合格
      return this.previewData.passRate >= this.thresholdData;
    },
  },
  created() {
    this.taskId = this.$route.query.taskId;
    if (this.taskId) {
      this.fetchPreviewData();
    }
  },
  methods: {
    async fetchPreviewData() {
      this.loading = true;
      try {
        // 1. 获取通过阈值
        const thresholdRes = await sopQcPassThreshold();
        this.thresholdData = thresholdRes.data || 0;

        // 2. 获取预览数据
        const previewRes = await sopQcReportPreview({ taskId: this.taskId });
        if (previewRes.code === 200 || previewRes.code === 0) {
          this.previewData = previewRes.data || {};
          // 转换二维数组
          this.tableData = (this.previewData.rows || []).map((rowArr) => {
            const rowObj = {};
            rowArr.forEach((val, index) => {
              rowObj[`col_${index}`] = val;
            });
            return rowObj;
          });
        }
      } catch (error) {
        this.$message.error("数据加载失败");
      } finally {
        this.loading = false;
      }
    },
    // 辅助方法：判断是否需要变红（简单的模拟图片中数字异常变红逻辑）
    isNumericError(val) {
      if (!val) return false;
      // 模拟：如果是数字12（对应图片中红色数值），则变红
      return val === "12";
    },
    exportReport() {
      downloadPost("/sop/qc/report/export/single", { taskId: this.taskId }, ``);
    },
  },
};
</script>

<style scoped lang="scss">
.report-info-box {
  width: 100%;

  background: rgba(245, 248, 255, 1);
  border-radius: 8px;
  padding: 16px;
  /* 布局分布: 集中分布在两端或均匀分布 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* 图层模式: 穿透在CSS中通常指不遮挡点击事件，如果是视觉上的则保持默认 */
  pointer-events: auto;
}

/* 深度选择器修改面包屑颜色 */
::v-deep .el-breadcrumb__inner {
  color: #4e5969 !important;
  font-weight: 400 !important;
  &.is-link,
  a {
    color: #4e5969 !important;
  }
}
::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #1d2129 !important;
}

/* 还原Element表格边框颜色 */
::v-deep .el-table {
  border: 1px solid #f2f3f5;
  &::before {
    display: none;
  }
  th.el-table__cell {
    border-bottom: 1px solid #f2f3f5;
  }
  td.el-table__cell {
    border-bottom: 1px solid #f2f3f5;
  }
}
</style>
