import request from '@/utils/request'

// 获取科普文章联网搜索结果
export function getWebSearchResult(messageId) {
  return request({
    url: '/auxiliary/popularScience/webSearch/result',
    method: 'get',
    params: {
      messageId
    }
  })
}