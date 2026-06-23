<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[55px] flex items-center pl-[24px]">
      <el-breadcrumb>
        <el-breadcrumb-item
          ><a @click="$router.push('/smart/agent/qualityAnalysisList')"
            >返回质控分析列表</a
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item>分析结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div
      class="flex-1 flex flex-col w-full p-[24px] overflow-hidden"
      v-loading="loading"
      element-loading-text="质检中，请稍等⌛️"
    >
      <div class="flex items-center justify-between h-[80px]">
        <div class="flex flex-col gap-[8px]">
          <span class="text-[18px] text-[#000] leading-[32px] font-bold"
            >质量分析结果 ({{ detailData.reportName || "分析报告" }})</span
          >
          <span class="text-[14px] leading-[24px] pointer" @click="previewFile"
            >检测依据：<span
              class="text-[#3662FF] text-[14px] leading-[24px] font-bold"
              >{{ detailData.sopFileName }}</span
            ></span
          >
        </div>
        <el-button
          class="border-[#3662FF] rounded-1 text-[#3662FF]"
          plain
          @click="exportReport"
          icon="el-icon-download"
          >下载pdf报告</el-button
        >
      </div>
      <div class="">
        <div class="report-info-box mb-[16px]" v-loading="loading">
          <div class="flex items-center text-[14px] text-[#4E5969] mb-[16px]">
            <i class="mr-2 el-icon-document"></i>报告信息
          </div>
          <div class="flex flex-wrap items-center justify-between h-full">
            <div class="flex flex-col gap-[8px] min-w-[300px]">
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
                <span
                  :class="isPrevQualified ? 'text-[#03CEA1]' : 'text-[#FF5656]'"
                >
                  {{ isPrevQualified ? "合格" : "不合格" }}
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

      <div
        class="flex-1 w-full bg-white py-[20px] flex flex-col gap-[32px] overflow-hidden"
      >
        <div class="flex flex-col gap-[16px]">
          <div class="text-[18px] text-[#000] leading-[32px]">
            质量分析结果预览
            <el-tag :type="isQualified ? 'success' : 'danger'" class="ml-2">
              综合判定：{{ isQualified ? "整体合格" : "整体不合格" }}
            </el-tag>
          </div>
          <div class="w-full h-[135px] grid grid-cols-2 gap-[16px]">
            <div
              class="border-rainbow rounded-[8px] w-full h-full text-[#03CEA1] px-[40px] py-[24px]"
            >
              <div class="flex items-end gap-[4px]">
                <span class="text-[40px]">{{
                  detailData.content.metric.qualifiedCount
                }}</span>
                <span class="text-[16px] leading-[32px]">项</span>
              </div>
              <div
                class="text-[18px] leading-[32px] flex items-center gap-[4px]"
              >
                <i class="el-icon-circle-check"></i>规则已合格
              </div>
            </div>

            <div
              class="border-rainbow rounded-[8px] w-full h-full text-[#FF5656] px-[40px] py-[24px] flex items-center justify-between"
            >
              <div>
                <div class="flex items-end gap-[4px]">
                  <span class="text-[40px]">{{
                    detailData.content.metric.unqualifiedCount
                  }}</span>
                  <span class="text-[16px] leading-[32px]">项</span>
                </div>
                <div
                  class="text-[18px] leading-[32px] flex items-center gap-[4px]"
                >
                  <i class="el-icon-circle-close"></i>规则不合格
                </div>
              </div>
              <el-button
                type="danger"
                size="mini"
                class="rounded-[8px]"
                @click="unqualifiedDialogVisible = true"
                >查看详情</el-button
              >
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-[16px] overflow-hidden">
          <div class="text-[18px] text-[#000] leading-[32px]">规则匹配详情</div>

          <div class="flex-1 overflow-y-auto">
            <el-table
              :data="detailData.content.rows"
              height="100%"
              :header-cell-style="headerCellStyle"
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
              ></el-table-column>
              <el-table-column
                prop="sampleId"
                label="样本编号"
                min-width="100"
              ></el-table-column>

              <el-table-column label="指标1" min-width="140">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.origIndicators && scope.row.origIndicators[0]
                    "
                  >
                    {{ scope.row.origIndicators[0].name
                    }}<span v-if="scope.row.origIndicators[0].value">:</span
                    >{{ scope.row.origIndicators[0].value }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="指标2" min-width="140">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.origIndicators && scope.row.origIndicators[1]
                    "
                  >
                    {{ scope.row.origIndicators[1].name
                    }}<span v-if="scope.row.origIndicators[1].value">:</span
                    >{{ scope.row.origIndicators[1].value }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="指标3" min-width="140">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.origIndicators && scope.row.origIndicators[2]
                    "
                  >
                    {{ scope.row.origIndicators[2].name
                    }}<span v-if="scope.row.origIndicators[2].value">:</span
                    >{{ scope.row.origIndicators[2].value }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="coreText"
                label="核心文本"
                min-width="180"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="dataIndicator"
                label="数据指标"
                min-width="180"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column prop="result" label="分析结果" min-width="100">
                <template slot-scope="scope" class="text-[14px] leading-[24px]">
                  <div
                    v-if="scope.row.result === 'qualified'"
                    class="w-[72px] text-[#6DD401] rounded-[99px] bg-[#6DD4010A] border-[1px] border-[#6DD401] text-center"
                  >
                    合格
                  </div>
                  <div
                    v-else
                    class="w-[72px] text-[#FF5656] rounded-[99px] bg-[#FF56560A] border-[1px] border-[#FF5656] text-center"
                  >
                    不合格
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="illegalReason"
                label="不合格可能性原因分析"
                min-width="180"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column label="改进建议" min-width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.result !== 'qualified'"
                    class="bg-[#E8EFFF] text-[14px] text-[#3662FF] cursor-pointer border-0"
                    @click="goToFake(scope.row)"
                  >
                    <svg-icon
                      icon-class="icon-view"
                      class="mr-[4px]"
                      style="width: 14px; height: 14px"
                    />
                    查看更多
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="综合判定详情"
      :visible.sync="unqualifiedDialogVisible"
      width="30%"
      custom-class="rounded-[16px]"
    >
      <div class="text-[14px] leading-[24px]">
        <div class="font-bold">
          本项目检测
          <span class="text-[#3662FF]">{{
            detailData.content.metric.totalCount
          }}</span>
          例 样本， 合格项目
          <span class="text-[#3662FF]">{{
            detailData.content.metric.qualifiedCount
          }}</span>
          例， 不合格样本
          <span class="text-[#FF5656]">{{
            detailData.content.metric.unqualifiedCount
          }}</span>
          例。
        </div>

        <div
          class="mt-[12px]"
          v-if="
            detailData.content.metric.unqualifiedDetails &&
            detailData.content.metric.unqualifiedDetails.length
          "
        >
          不合格样本编号：
          <span
            v-for="item in detailData.content.metric.unqualifiedDetails"
            :key="item.sampleId"
            class="text-[#FF5656]"
            >{{ item.sampleId }}、</span
          >
        </div>

        <div
          class="mt-[4px]"
          v-if="detailData.content.metric.summaryReasonText"
        >
          不合格的原因可能为：<span>{{
            detailData.content.metric.summaryReasonText
          }}</span>
        </div>

        <div class="mt-[12px] p-[12px] bg-[#f5f7fa] rounded-[8px]">
          <p class="font-bold">
            最终结论：
            <span :class="isQualified ? 'text-[#6DD401]' : 'text-[#FF5656]'">
              {{ isQualified ? "整体合格" : "整体不合格" }}
            </span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import { blobValidate } from "@/utils/ruoyi";
import { Message, Loading } from "element-ui";
import { getFilenameFromDisposition } from "@/api/custom/customKnowledgeBase";
import {
  sopQcDetail,
  sopQcReportPreview,
  sopQcPassThreshold,
} from "@/api/custom/sopQc.js"; // 移除了 sopQcPassThreshold 引用
import { downloadPost } from "@/utils/request";
import { openFilePreview } from "@/utils/file";
export default {
  name: "QualityAnalysisDetail",
  data() {
    return {
      taskId: null,
      loading: false,
      unqualifiedDialogVisible: false,
      detailData: {
        reportName: "",
        reportTime: "",
        sopFileName: "",
        excelName: "",
        content: {
          metric: {
            qualifiedCount: 0,
            unqualifiedCount: 0,
            totalCount: 0,
            unqualifiedDetails: [],
            summaryReasonText: "",
          },
          rows: [],
        },
      },
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
      headerCellStyle: {
        "background-color": "#F2F3F5",
        color: "#1D2129",
        "font-size": "14px",
        "font-weight": "400",
        "text-align": "left",
        padding: "10px 6px",
        height: "60px",
      },
    };
  },
  computed: {
    isQualified() {
      // 如果不存在不合格的数据，则判定为整体合格
      return this.detailData.content.metric.unqualifiedCount === 0;
    },
    isPrevQualified() {
      // 逻辑调整：passRate(实际) >= thresholdData(阈值) 则合格
      // 如果 thresholdData 大于 passRate，就不合格
      return this.previewData.passRate >= this.thresholdData;
    },
  },
  created() {
    this.taskId = this.$route.query.taskId;
    if (this.taskId) {
      this.fetchDetailData();
    } else {
      this.$message.error("未获取到任务ID");
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
    previewFile() {
      if (this.detailData.sopFileUrl) {
        openFilePreview(this.detailData.sopFileUrl);
      } else {
        this.$message.error("未获取到检测依据文件链接");
      }
    },
    async fetchDetailData() {
      this.loading = true;
      try {
        // 仅调用详情接口
        const previewRes = await sopQcDetail({ taskId: this.taskId });

        if (previewRes.code === 200 || previewRes.code === 0) {
          const apiData = previewRes.data || {};
          this.detailData = {
            ...apiData,
            content: {
              metric: apiData.content?.metric || {
                qualifiedCount: 0,
                unqualifiedCount: 0,
                totalCount: 0,
                unqualifiedDetails: [],
                summaryReasonText: "",
              },
              rows: apiData.content?.rows || [],
            },
          };
          if (apiData.content) {
            this.fetchPreviewData();
          } else {
            this.loading = true;
            setTimeout(() => {
              this.fetchDetailData();
            }, 1000 * 30); // 如果没有content，说明数据还在生成中，30秒后重试一次
          }
        } else {
          this.$message.error(previewRes.msg || "获取详情失败");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        this.$message.error("数据加载失败");
        this.loading = false;
      }
    },
    exportReport() {
      downloadPost(
        "/sop/qc/report/export/single",
        {
          taskId: this.taskId,
        },
        ``
      );
      // job_${new Date().getTime()}.pdf
    },
    goToFake(row) {
      console.log(row);
      sessionStorage.setItem("reason", JSON.stringify(row));
      this.$router.push({ path: "/smart/agent/qualityAnalysisIllegal" });
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
.linear-bg {
  background: linear-gradient(180deg, #c1d4ff55, #f4eaff55);
}
.border-rainbow {
  border: 1px solid transparent;
  &:nth-child(1) {
    background: linear-gradient(180deg, rgb(248, 255, 254), rgb(248, 255, 253))
        padding-box,
      linear-gradient(180deg, #9bccff, #d1a6ff, #9799ff);
  }
  &:nth-child(2) {
    background: linear-gradient(#fff8f8, #fff8f8) padding-box,
      linear-gradient(180deg, #9bccff, #d1a6ff, #9799ff);
  }
}
</style>
