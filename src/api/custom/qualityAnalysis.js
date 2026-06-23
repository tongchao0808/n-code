import request from '@/utils/request'

// 开始执行具体的分析
export function startQualityAnalysis(data) {
  return request({
    url: '/agent/quality/analysis/start',
    method: 'post',
    data
  })
}

// 下载分析报告
export function downloadQualityAnalysisReport(reportId) {
  return request({
    url: '/agent/quality/analysis/report/download',
    method: 'post',
    data: {
      reportId
    }
  })
}

// 推荐相关的标准文件
export function getQualityAnalysisSuggestion(params) {
  return request({
    url: '/agent/quality/analysis/suggestion',
    method: 'get',
    params
  })
}