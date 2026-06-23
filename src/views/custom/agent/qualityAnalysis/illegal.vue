<template>
  <div class="w-full h-full flex flex-col gap-[16px] p-6 box-border overflow-hidden">
    <div class="flex flex-col gap-4 shrink-0">
      <el-breadcrumb>
        <el-breadcrumb-item><a @click="$router.push('/agent/qualityAnalysisList')" class="cursor-pointer">质量分析</a></el-breadcrumb-item>
        <el-breadcrumb-item>当前页面</el-breadcrumb-item>
      </el-breadcrumb>
      <h2 class="text-xl font-bold text-[#333]">质量控制不符合项推理</h2>
    </div>


    <div class="flex-1 flex gap-4 overflow-hidden fileList-box">

      <div class="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p class="text-sm text-gray-400 mb-4 font-medium">不符合项案例</p>
          <div class="border border-blue-100 rounded-lg p-5 bg-[#f9fbff]">
            <h4 class="font-bold text-lg mb-2">{{reason.realReasonAnalysis.name}}</h4>
            <div class="inline-flex items-center px-2 py-1 bg-red-50 border border-red-100 rounded text-xs mb-4"
                 :class="{'text-red-500': reason.realReasonAnalysis.level === '高', 'yellow-red-500': reason.realReasonAnalysis.level === '中', 'green-red-500': reason.realReasonAnalysis.level === '低'}">
              <span class="mr-1">⚠️</span> 风险等级：{{reason.realReasonAnalysis.level}}
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{reason.realReasonAnalysis.desc}}
            </p>
          </div>
        </section>

        <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p class="text-sm text-gray-400 mb-6 font-medium">法规条款匹配与质控计划</p>

          <div class="flex flex-col gap-8">
            <div>
              <div class="flex items-center gap-2 mb-3 text-blue-600">
                <span class="text-lg">📄</span>
                <span class="font-bold">自动匹配相关法规条款</span>
              </div>
              <ul class="list-disc ml-10 text-sm text-gray-600 space-y-3">
                <li v-for="(item, index) in reason.realReasonAnalysis.legalTerms" :key="index">{{item}}</li>
              </ul>
            </div>

            <div class="border-t pt-6">
              <div class="flex items-center gap-2 mb-3 text-blue-600">
                <span class="text-lg">📋</span>
                <span class="font-bold">质控计划</span>
              </div>
              <ul class="list-disc ml-10 text-sm text-gray-600 space-y-3">
                <li v-for="(item, index) in reason.realReasonAnalysis.qcPlans" :key="index">{{item}}</li>
              </ul>
            </div>

            <div class="border-t pt-6">
              <div class="flex items-center gap-2 mb-3 text-blue-600">
                <span class="text-lg">💡</span>
                <span class="font-bold">风险预警与整改建议</span>
              </div>
              <ul class="list-disc ml-10 text-sm text-gray-600 space-y-3">
                <li v-for="(item, index) in reason.realReasonAnalysis.suggestions" :key="index">{{item}}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div class="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100 overflow-y-auto no-scrollbar">
        <p class="text-sm text-gray-400 mb-8 font-medium">根因分析</p>

        <div class="relative flex flex-col gap-12">
          <div class="absolute left-[13px] top-2 bottom-4 w-[2px] bg-blue-100"></div>

          <div v-for="(item, index) in reason.realReasonAnalysis.traces" :key="index" class="flex items-start gap-4">
            <div class="flex-shrink-0 w-[26px] h-[26px] bg-blue-500 rounded-full text-white flex items-center justify-center z-10 text-xs font-bold shadow-md">
              {{ index + 1 }}
            </div>

            <div class="flex-1">
              <h4 class="text-blue-600 font-bold mb-3 text-[15px]">{{ item.name }}</h4>

              <div v-if="item.type === 'step'" class="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 leading-relaxed shadow-sm text-justify">
                {{ item.desc }}
              </div>
              <div v-else class="text-[15px] text-gray-700 leading-relaxed font-medium">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "illegal",
  data() {
    return {
      reason: {
        realReasonAnalysis: {
          name: '冻存样本温度异常事件',
          level: '高',
          desc: '某批 -80℃ 冻存样本在周末巡检时发现温度曾短时升高至 -40℃。',
          legalTerms: [
            '《GB/T 38360-2019 生物样本库技术规范》：对样本存储温度监测和报警响应时间提出明确要求。',
            '内部《样本库设备管理制度》：规定低温设备需每 12 个月完成一次性能校准。'
          ],
          qcPlans: [
            '将相关低温设备纳入重点监控清单，补做性能校准并记录结果。',
            '增加夜间值班巡检频次，要求对异常温度波动进行书面说明。',
            '优化预警机制，增加短信/微信推送渠道，确保 15 分钟内响应。',
          ],
          suggestions: [
            '当前设备风险等级评估为“高”，建议 3 个月内复查质控效果。',
            '对相关人员进行针对性培训，强调样本温度控制在质量体系中的重要性。',
          ],
          traces: [
            { type: "step", name: "关联设备校准记录", desc: "自动定位涉及的 -80℃ 冰箱设备，检索最近一次校准/维护记录，发现校准已超过 12 个月未执行。" },
            { type: "step", name: "关联人员操作记录", desc: "调用人员操作日志，发现事件期间存在多次长时间开门操作，且夜间值班人员未按规定填写操作原因。" },
            { type: "step", name: "关联环境监控数据", desc: "查询环境监控系统，未发现断电记录，但冰箱传感器存在多次短时温度波动报警，未被及时处理。" },
            { type: "step", name: "自动生成根因结论", desc: "综合判定：主要原因包括设备未按期校准、值班人员操作不规范及报警响应不及时，暂未发现外部供电异常等因素。" }
          ]
        }
      },
    }
  },
  mounted() {
    let r = sessionStorage.getItem('reason');
    if (r) {
      this.reason = JSON.parse(r);
    }
  },
  methods: {
    goBack() {
      sessionStorage.removeItem('reason');
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="scss">
.fileList-box {
  background: linear-gradient(180deg, rgba(193, 212, 255, 0.5), rgba(244, 234, 255, 0.5));
}

/* 彻底隐藏滚动条样式 */
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
    width: 0 !important;
    height: 0 !important;
  }
}

/* 深度选择器处理 Element UI 样式 */
:deep(.el-breadcrumb__inner) {
  color: #999 !important;
  font-weight: normal !important;
}
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #333 !important;
}
</style>
