import request, { downloadGet } from '../../utils/request'
import { randomDate, randomEnum, randomString, randomValue, randomZhString } from '@/api/custom/fake'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import { formatFileSize } from '@/utils/misc'
import { blobValidate } from '@/utils/ruoyi'
import errorCode from '@/utils/errorCode'
// 查询向量化结果
export function segmentationVector (data) {
  return request({
    url: '/knowledge/document/segmentation/vector',
    method: 'POST',
    data
  })
}
// 命中测试
export function hitTest (data) {
  return request({
    url: '/knowledge/document/hit/test',
    method: 'POST',
    data
  })
}
// 分档分块
export function docDivision (params) {
  return request({
    url: '/knowledge/document/document/data/list',
    method: 'GET',
    params
  })
}
// 向文档中插入新的内容
export function docInsertData (data) {
  return request({
    url: '/knowledge/document/document/insert/data',
    method: 'POST',
    data
  })
}

// 修改分块内容
export function updateSegmentation (data) {
  return request({
    url: '/knowledge/document/segmentation/update',
    method: 'POST',
    data
  })
}

// 分块详情
export function getSegmentationDetail (params) {
  return request({
    url: '/knowledge/document/segmentation/details',
    method: 'GET',
    params
  })
}

// 用文件id查文档id
export function getDocumentId (params) {
  return request({
    url: '/attachment/task/getDocumentId',
    method: 'GET',
    params
  })
}

// 文档自动分段
export function autoSegmentation (data) {
  return request({
    url: '/knowledge/document/document/quick',
    method: 'POST',
    data
  })
}

export async function getCustomKnowledgeBaseList (data) {
  const container = []
  const resp = await request({
    url: '/knowledge/database/list',
    method: 'POST',
    data: {
      ...data
    }
  })

  // if (resp.code === 200) {
  //   resp.data.forEach(item => {
  //     item.name = item.baseName;
  //   });
  //   container.push(...resp.data);
  // } else {
  //   console.log("[error] getCustomKnowledgeBaseList: ", resp.msg);
  // }
  if (resp.code !== 200) {
    return Promise.reject(resp.msg)
  }
  return resp.data
}

export function changeKgPermission (id, permission) {
  return request({
    url: '/knowledge/database/update',
    method: 'POST',
    data: {
      id: id,
      permission: permission
    }
  })
}

export function changeKgName (id, name) {
  return request({
    url: '/knowledge/database/update',
    method: 'POST',
    data: {
      id: id,
      name: name
      // permission:
    }
  })
}

export function deleteKg (id, deleteOption) {
  return request({
    url: `/knowledge/database/delete`,
    method: 'DELETE',
    params: {
      databaseId: id
    }
  })
}

export async function getKgDocs (kgId, directoryId, searchKeyword, pageIndex, pageSize) {
  const resp = await request({
    url: `/knowledge/document/list`,
    method: 'POST',
    data: {
      'databaseId': kgId,
      'directoryId': directoryId,
      'searchMode': 'MIXED',
      'keyword': searchKeyword,
      'fileExtension': '',
      'pageNum': pageIndex,
      'pageSize': pageSize
    }
  })

  if (resp.code === 200) {
    // if (resp.rows.length > 0) {
    //   resp.rows.forEach(item => {
    //     item.name = item.docTitle;
    //     item.size = formatFileSize(item.docSize)
    //   });
    // }
    // container.push(...resp.rows);
    return Promise.resolve({
      rows: resp.data.records || [],
      total: resp.data.total || 0
    })
  } else {
    return Promise.resolve({
      rows: [],
      total: 0
    })
  }
}

export function renameDoc (documentId, name) {
  return request({
    url: '/knowledge/document/update',
    method: 'POST',
    data: {
      documentId, name
    }
  })
}

export async function moveToDoc (docId, databaseId, directoryId) {
  return request({
    url: '/knowledge/document/move',
    method: 'POST',
    data: {
      // id: docId,
      // baseId: kgId
      'documentId': docId,
      'dstDatabaseId': databaseId,
      'dstDirectoryId': directoryId
    }
  })
}

export async function createDoc (formData) {
  // /attachment/knowledge/upload
  const resp = await request({
    // url: `/ytj/knowledgeDoc/docUpload?kgId=${kgId}`,
    url: `/attachment/knowledge/upload`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if (resp.code !== 200) {
    return Promise.reject(resp.msg)
  }
  return Promise.resolve({
    id: randomString(10),
    name: randomString(10),
    size: `${randomValue(10, 80)}Mb`
  })
}

export async function deleteDocs (id) {
  const resp = await request({
    url: '/knowledge/document/delete',
    method: 'DELETE',
    params: {
      documentId: id
    }
  })

  if (resp.code === 200) {
    return Promise.resolve(resp.data)
  } else {
    return Promise.reject(resp.msg)
  }
}

export async function deleteDocPath (id) {
  let resp = await request({
    url: "/knowledge/document/deleteDirectory",
    method: "DELETE",
    params: {
      directoryId: id
    }
  });

  if (resp.code === 200) {
    return Promise.resolve(resp.data);
  } else {
    return Promise.reject(resp.msg);
  }
}

//  批量删除知识库文档
export async function deleteDocsBatch (ids) {
  return await request({
    url: `/knowledge/document/delete/batch`,
    method: 'POST',
    data: ids
  })
}

export async function createSubDir (databaseId, name, parentId) {
  return await request({
    url: `/knowledge/document/createDirectory`,
    method: "POST",
    data: { databaseId, name, parentId }
  });
}

export async function getDocDetail (documentId) {
  const resp = await request({
    url: '/knowledge/document/detail',
    method: 'GET',
    params: {
      documentId
    }
  })

  if (resp.code === 200) {
    resp.data.name = resp.data.name
    resp.data.size = formatFileSize(resp.data.size)
    resp.data.content = resp.data.content

    return Promise.resolve(resp.data)
  } else {
    return Promise.reject(resp.msg)
  }
}

function generateRandomDocuments () {
  const prefixes = ['Doc', 'File', 'Note', 'Paper', 'Record', 'Asset', 'Book', 'Info']
  const suffixes = ['Final', 'Draft', 'Copy', 'Backup', 'Work', 'Project', 'Home', 'Misc']
  const extensions = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png']
  const count = Math.floor(Math.random() * 21) + 30 // 30 到 50 个

  const documents = []

  for (let i = 0; i < count; i++) {
    // 生成 name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    const randomNum = Math.floor(Math.random() * 1000)
    const ext = extensions[Math.floor(Math.random() * extensions.length)]
    const name = `${prefix}_${suffix}_${randomNum}.${ext}`

    // 生成 createTime（过去两年内的随机日期）
    const startDate = new Date(2021, 0, 1) // 2021年1月1日
    const endDate = new Date() // 当前时间
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    const createTime = new Date(randomTime).toISOString().slice(0, 16).replace('T', ' ')

    // 生成 size（随机选择 kb 或 mb）
    let size
    if (Math.random() < 0.5) {
      // KB
      const kb = Math.floor(Math.random() * 999) + 1
      size = kb + 'kb'
    } else {
      // MB
      const mb = (Math.random() * 99.9 + 0.1).toFixed(1) // 0.1 到 100.0 之间，保留一位小数
      size = mb + 'mb'
    }

    // 构建文档对象并加入数组
    documents.push({
      name,
      createTime,
      size
    })
  }

  return documents
}

export async function getCustomKnowledgeBaseDocList (knowledgeBaseId, pageNumber, pageSize) {
  const res = generateRandomDocuments()
  return Promise.resolve({
    total: res.length,
    rows: res
  })
}

export function getFilenameFromDisposition (disposition) {
  // 处理 filename* 的情况（UTF-8 编码）
  const utf8FilenameRegex = /filename\*=UTF-8''([^;]+)/i
  const utf8Match = disposition.match(utf8FilenameRegex)
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1])
  }

  // 处理其他编码的 filename*（不常见）
  const filenameStarRegex = /filename\*=(['"]?)([^;]+)\1/i
  const filenameStarMatch = disposition.match(filenameStarRegex)
  if (filenameStarMatch) {
    const filenamePart = filenameStarMatch[2]
    const parts = filenamePart.split("''")
    if (parts.length > 1) {
      return decodeURIComponent(parts[1])
    }
    return decodeURIComponent(filenamePart)
  }

  // 处理普通 filename
  const filenameRegex = /filename=(["']?)(.*?)\1/i
  const filenameMatch = disposition.match(filenameRegex)
  if (filenameMatch && filenameMatch[2]) {
    const filename = filenameMatch[2]
    try {
      return decodeURIComponent(filename) // 处理可能的 URI 编码
    } catch {
      return filename // 解码失败返回原值
    }
  }

  return null // 未找到文件名
}

export function downloadDoc (docId) {
  const downloadLoadingInstance = Loading.service({ text: '正在下载数据，请稍候', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
  request({
    url: '/ytj/knowledgeDoc/downloadDoc',
    method: 'GET',
    params: { docId: docId },
    responseType: 'blob'
  }).then(async (resp) => {
    console.log('download resp: ', resp)
    let fileName = getFilenameFromDisposition(resp.headers['content-disposition'])
    if (!fileName) { fileName = '知识详情.xlsx' }
    const data = resp.data
    const isBlob = blobValidate(data)
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, fileName)
    } else {
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}

// ------------------------  以前的接口  ------------------------

export async function getKnowledgeBaseList () {
  let res = []
  const respData = await request({
    url: '/ytj/coolKnowledge/type/list',
    method: 'GET'
  })

  if (respData.code === 200 && respData.rows.length > 0) {
    res = respData.rows
    res.forEach(item => {
      item.count = 0
    })
  }
  return Promise.resolve(res)
}

export async function getKnowledgeBaseDocList (knowledgeBaseId, pageNumber, pageSize) {
  const respData = await request({
    url: '/ytj/coolKnowledge/info/page',
    method: 'POST',
    data: {
      typeId: knowledgeBaseId,
      pageNum: pageNumber,
      pageSize: pageSize
    }
  })
  if (respData.code === 200) {
    return Promise.resolve(respData)
  } else {
    return Promise.reject(respData.msg)
  }
}

// ////

export async function getUserKnowledgeList (categoryId = 3) {
  console.log('获取用户知识库列表')

  const responseData = await request({
    url: '/knowledge/database/list',
    method: 'POST',
    data: {
      pageNumber: 1,
      pageSize: 999999999,
      categoryId
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`)
    return Promise.reject(responseData.msg)
  }
  return responseData.data.records
}

export async function createNewKg (name, permission) {
  const responseData = await request({
    url: '/knowledge/database/create',
    method: 'POST',
    data: {
      name: name,
      permission: permission,
      source: 'USER'
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`)
    return Promise.reject(responseData.msg)
  } else {
    return Promise.resolve(responseData.data)
  }
}

// 获取知识库分类树 /knowledge/database/tree
export async function getCustomKnowledgeBaseTree () {
  const responseData = await request({
    url: '/knowledge/database/tree',
    method: 'GET'
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`)
    return Promise.reject(responseData.msg)
  }
  return responseData.data
}

// 获取知识库文档分析状态
export async function getDocTraningStatus (documentId) {
  const responseData = await request({
    url: '/knowledge/document/training/status',
    method: 'GET',
    params: { documentId }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`)
    return Promise.reject(responseData.msg)
  }
  return responseData.data
}
