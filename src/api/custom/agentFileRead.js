import request from '@/utils/request'
//获取常见问题 /agent/interpret/frequently/question
export function getFrequentlyQuestion() {
  return request({
    url: '/agent/interpret/frequently/question',
    method: 'get',
  })
}
// 文件解读搜索 /agent/interpret/search
export function searchInterpret(params) {
  return request({
    url: '/agent/interpret/search',
    method: 'get',
    params
  })
}
// 文件解读推荐 /agent/interpret/suggestion
export function suggestionInterpret(params) {
  return request({
    url: '/agent/interpret/suggestion',
    method: 'get',
    params
  })
}
// 获取文件规则列表 /agent/interpret/rules
export function getRules(params) {
  return request({
    url: '/agent/interpret/rules',
    method: 'get',
    params
  })
}