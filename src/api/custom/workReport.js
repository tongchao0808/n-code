import request from '@/utils/request'
import { getSaveUrl, getCheckUrl } from '@/plugins/aiAnserConfig'

// ========================================工作报告==========================================================
// 保存用户自己修改的ai回答内容
export function saveUserAnswer(data) {
  const url = getSaveUrl();
  if(!url) {
    return Promise.reject('场景不存在对应的接口');
  }
  return request({
    url,
    method: 'post',
    data
  })
}

// 查询是否存在手动修改的报告
export function checkUserAnswerChanged(params) {
  const url = getCheckUrl();
  if(!url) {
    return Promise.reject('场景不存在对应的接口');
  }
  return request({
    url,
    method: 'get',
    params
  })
}
