import request from '@/utils/request'

// 设置收藏
export function setFavorite(sectionId, isFavorite) {
  return request({
    url: '/agent/termSearch/section/favorite',
    method: 'get',
    params: {
      sectionId,
      isFavorite
    }
  })
}

// 获取条款详情
export function getZoomDetail(sectionId) {
  return request({
    url: '/agent/termSearch/section/detail',
    method: 'get',
    params: {
      sectionId
    }
  })
}

// 条款检索
export function getZoomList(keyword) {
  return request({
    url: '/agent/termSearch/search',
    method: 'get',
    params: {
      keyword
    }
  })
}

// 获取搜索历史
export function getZoomHistory() {
  return request({
    url: '/agent/termSearch/searchHistory',
    method: 'get'
  })
}

// 获取收藏列表
export function getZoomFavorite() {
  return request({
    url: '/agent/termSearch/favorites',
    method: 'get'
  })
}

// 获取全文
export function getFullContent(documentId) {
  return request({
    url: '/agent/termSearch/documentFullContent',
    method: 'get',
    params: {
      documentId
    }
  })
}