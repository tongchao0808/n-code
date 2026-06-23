import request from '@/utils/request'

// 获取词云图
export function searchWordCloud() {
  return request({
    url: '/knowledge/clinical/wordcloud',
    method: 'get'
  })
}

// 获取最近更新
export function getRecentUpdates() {
  return request({
    url: '/ytj/clinical/getRecentUpdates',
    method: 'get'
  })
}

// 获取文章列表
export function getArticleList(data) {
  return request({
    url: '/ytj/clinical/searchClinicalList',
    method: 'post',
    data
  })
}

// 搜索候选词
export function searchCandidates(data) {
  return request({
    url: '/ytj/clinical/searchCandidateWords',
    method: 'post',
    data
  })
}

// 详情
export function getClinicalById(params) {
  return request({
    url: '/ytj/clinical/getClinicalById',
    method: 'get',
    params
  })
}

// 词条搜索（分页）
export function searchClinical(data) {
  return request({
    url: '/knowledge/clinical/search',
    method: 'post',
    data
  })
}

// 获取词条类型
export function getClinicalTypes(params) {
  return request({
    url: '/knowledge/clinical/types',
    method: 'get',
    params
  })
}

// 词条详情
export function getClinicalDetail(params) {
  return request({
    url: '/knowledge/clinical/detail',
    method: 'get',
    params
  })
}

// 最近更新词条
export function getClinicalRecent(params) {
  return request({
    url: '/knowledge/clinical/recent',
    method: 'get',
    params
  })
}
