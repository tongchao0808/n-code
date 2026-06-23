import request from '@/utils/request'

// 文献综述生成
export function generateMedicalReview(data) {
  return request({
    url: '/medical/review/generate',
    method: 'post',
    data
  })
}

// 文献综述重新生成
export function regenerateMedicalReview(data) {
  return request({
    url: '/medical/review/regenerate',
    method: 'post',
    data
  })
}