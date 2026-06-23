import request from "@/utils/request";
import store from "@/store";

// 取消任务
export function taskCancel(taskId) {
  return request({
    url: '/attachment/task/cancel',
    method: 'post',
    data: {taskId}
  })
}

// 场景附件上传
export function sceneUpload(taskId) {
  const scene = store.state.history.scene;
  return request({
    url: '/attachment/sceneUpload/saveRecord',
    method: 'post',
    data: {
      taskId,
      scene
    }
  })
}

// 场景附件删除
export function sceneUploadDelete(id) {
  return request({
    url: '/attachment/sceneUpload/deleteRecord',
    method: 'post',
    data: {
      id
    }
  })
}

// 检查附件是否加载到列表
export function checkDocumentsCompleteStatus(taskIds) {
  return request({
    url: '/attachment/check/documentsCompleteStatus',
    method: 'post',
    data: {
      taskIds
    }
  })
}