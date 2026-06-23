import request from "@/utils/request";
import store from "@/store";

// POST
// /sop/qc/rerun
// 重跑分析任务
export function sopQcReRun(data) {
  return request({
    url: "/sop/qc/rerun",
    method: "post",
    data
  });
}

// POST
// /sop/qc/paged
// 分页任务列表
export function sopQcPaged(data) {
  return request({
    url: "/sop/qc/paged",
    method: "post",
    data
  });
}

// POST
// /sop/qc/delete
// 删除分析任务
export function sopQcDelete(data) {
  return request({
    url: "/sop/qc/delete",
    method: "post",
    data
  });
}

// POST
// /sop/qc/create
// 开始执行具体的分析
export function sopQcCreate(data) {
  return request({
    url: "/sop/qc/create",
    method: "post",
    data
  });
}

// GET
// /sop/qc/suggestion
// 推荐相关的标准文件
export function sopQcSuggestion(params) {
  return request({
    url: "/sop/qc/suggestion",
    method: "get",
    params
  });
}

// GET
// /sop/qc/report/preview
// 报告预览,返回报告中需要填充的数据
export function sopQcReportPreview(params) {
  return request({
    url: "/sop/qc/report/preview",
    method: "get",
    params
  });
}

// GET
// /sop/qc/pass/threshold
// 获取合格率的阈值,大于等于此值代表合格, 返回值取值范围为0-100之间
export function sopQcPassThreshold(params) {
  return request({
    url: "/sop/qc/pass/threshold",
    method: "get",
    params
  });
}

// GET
// /sop/qc/detail
// 查询任务详情
export function sopQcDetail(params) {
  return request({
    url: "/sop/qc/detail",
    method: "get",
    params
  });
}
// /sop/qc/rename

export function sopQcRename(data) {
  return request({
    url: "/sop/qc/rename",
    method: "post",
    data
  });
}
