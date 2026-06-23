import request from '@/utils/request'

// 获取医学文献列表
export function getMedicalList(data) {
  return request({
    url: '/knowledge/clinical/search',
    method: 'post',
    data
  })
}

// 新增医学文献
export function addMedical(data) {
  return request({
    url: '/ytj/medical/addMedical',
    method: 'post',
    data
  })
}

// 获取文献详情
export function getKnowledgeDetail(params) {
  return request({
    url: 'ytj/medical/getMedicalById',
    method: 'get',
    params
  })
}

// 搜索医疗文献
// export function searchMedicalList(data) {
//   return request({
//     url: '/ytj/medical/searchMedicalList',
//     method: 'post',
//     data
//   })
// }

// 删除医疗文献
export function removeMedical(params) {
  return request({
    url: '/ytj/medical/removeMedical',
    method: 'post',
    params
  })
}

// 删除医疗文献(批量)
export function removeMedicalByIds(data) {
  return request({
    url: '/ytj/medical/removeMedicalByIds',
    method: 'post',
    data
  })
}

// 搜索(联网)
export function searchMedicalList(params, data) {
  return request({
    url: '/ytj/medical/searchMedicalList',
    method: 'post',
    params,
    data
  })
}

//  获取自建文献库id
export async function getUploadKnowledgeId(name) {
  const res = await request({
    url: '/knowledge/database/list',
    method: 'post',
    data: {
      categoryId :1
    }
  })
  if(res.data.records && res.data.records.length) {
    const { id } = res.data.records.find(item => item.name == name)
    return Promise.resolve(id || '');
  }
}

// 内置文献检索
export async function searchArticle(data) {
  const res = await request({
    url: '/knowledge/article/search',
    method: 'post',
    data
  })
  if(res.code !== 200) {
    return Promise.reject(res.msg)
  }
  return Promise.resolve(res.data)
}

// 获取文献检索checkbox选项内容
export function getKnowledgeOptions() {
  return request({
    url: '/knowledge/article/search/dimensions',
    method: 'get'
  })
}

// 获取文献详情
export function getArticleDetail(articleId) {
  return request({
    url: '/knowledge/article/detail',
    method: 'get',
    params: {
      articleId
    }
  })
}

// 上传自建文献
export function uploadArticle(formData) {
  return request({
    url: '/attachment/knowledge/article/custom/upload',
    method: 'post',
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
