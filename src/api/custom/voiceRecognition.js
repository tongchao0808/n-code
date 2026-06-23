import request from '@/utils/request'

// 重命名文件
export function renameFile(data) {
  return request({
    url: '/auxiliary/speechRecognition/rename',
    method: 'post',
    data
  })
}

// 加入知识库
export function addToKnowledge(data) {
  return request({
    url: '/auxiliary/speechRecognition/addToKnowledge',
    method: 'post',
    data
  })
}

// 查询识别详情
export function getDetail(fileId) {
  return request({
    url: '/auxiliary/speechRecognition/getDetail',
    method: 'get',
    params: {
      fileId
    }
  })
}

// 查询识别状态
export function getAudioStatusById(fileId) {
  return request({
    url: '/auxiliary/speechRecognition/getAudioStatusById',
    method: 'get',
    params: {
      fileId
    }
  })
}

// 查询文件列表
export function getAudioList(params) {
  return request({
    url: '/auxiliary/speechRecognition/getAudioList',
    method: 'get',
    params
  })
}

// 删除文件上传记录
export function deleteAudio(fileId) {
  return request({
    url: '/auxiliary/speechRecognition/delete',
    method: 'delete',
    params: {
      fileId
    }
  })
}