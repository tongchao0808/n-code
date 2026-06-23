import request from '@/utils/request'

// 获取文件列表
export function getAgentFileList(data) {
  return request({
    url: '/agent/sop/search',
    method: 'post',
    data
  })
}

// 文件重命名
export function renameAgentFile(data) {
  return request({
    url: '/agent/sop/rename',
    method: 'post',
    data
  })
}

// 新建文件夹
export function createFolder(data) {
  return request({
    url: '/agent/sop/folder/create',
    method: 'post',
    data
  })
}

// 删除文件
export function deleteAgentFile(dataId) {
  return request({
    url: '/agent/sop/delete',
    method: 'post',
    data: {
      dataId
    }
  })
}

// 查询文件夹下的全部数据
export function getFolderFileList(parentId) {
  return request({
    url: '/agent/sop/folder/command/ls',
    method: 'get',
    params: {
      parentId
    }
  })
}

// 获取文件详情
export function getAgentFileDetail(dataId) {
  return request({
    url: '/agent/sop/file/detail',
    method: 'get',
    params: {
      dataId
    }
  })
}