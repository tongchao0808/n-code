import request from "@/utils/request";
import store from "@/store";

// ==========================================
// 日历管理 (Calendar Management)
// ==========================================

// POST
// /work/calendar/update
// 编辑日程或提醒事项
export function workCalendarUpdate(data) {
  return request({
    url: "/work/calendar/update",
    method: "post",
    data
  });
}

// POST
// /work/calendar/reminder/uncomplete
// 取消完成提醒事项
export function workCalendarReminderUncomplete(data) {
  return request({
    url: "/work/calendar/reminder/uncomplete",
    method: "post",
    data
  });
}

// POST
// /work/calendar/reminder/complete
// 完成提醒事项
export function workCalendarReminderComplete(data) {
  return request({
    url: "/work/calendar/reminder/complete",
    method: "post",
    data
  });
}

// POST
// /work/calendar/range
// 按日期范围查询日历概要数据
export function workCalendarRange(data) {
  return request({
    url: "/work/calendar/range",
    method: "post",
    data
  });
}

// POST
// /work/calendar/delete
// 删除日历项
export function workCalendarDelete(data) {
  return request({
    url: "/work/calendar/delete",
    method: "post",
    data
  });
}

// POST
// /work/calendar/create
// 创建日程或提醒事项
export function workCalendarCreate(data) {
  return request({
    url: "/work/calendar/create",
    method: "post",
    data
  });
}

// GET
// /work/calendar/options
// 查询日历枚举选项
export function workCalendarOptions(params) {
  return request({
    url: "/work/calendar/options",
    method: "get",
    params
  });
}

// GET
// /work/calendar/detail
// 查询日历项详情
export function workCalendarDetail(params) {
  return request({
    url: "/work/calendar/detail",
    method: "get",
    params
  });
}


// ==========================================
// 任务管理 (Task Management)
// ==========================================

// POST
// /work/task/upload
// 任务管理和工作日历上传附件
export function workTaskUpload(data) {
  return request({
    url: "/work/task/upload",
    method: "post",
    data
  });
}

// POST
// /work/task/update
// 编辑任务
export function workTaskUpdate(data) {
  return request({
    url: "/work/task/update",
    method: "post",
    data
  });
}

// POST
// /work/task/list
// 分页查询任务列表
export function workTaskList(data) {
  return request({
    url: "/work/task/list",
    method: "post",
    data
  });
}

// POST
// /work/task/create
// 创建任务
export function workTaskCreate(data) {
  return request({
    url: "/work/task/create",
    method: "post",
    data
  });
}

// GET
// /work/task/options
// 查询任务类型选项
export function workTaskOptions(params) {
  return request({
    url: "/work/task/options",
    method: "get",
    params
  });
}

// GET
// /work/task/detail
// 查询任务详情
export function workTaskDetail(params) {
  return request({
    url: "/work/task/detail",
    method: "get",
    params
  });
}

// DELETE
// /work/task/delete
// 删除任务
export function workTaskDelete(data) {
  return request({
    url: "/work/task/delete",
    method: "delete",
    data
  });
}
