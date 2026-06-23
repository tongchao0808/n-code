import request from "@/utils/request";

// 发起翻译对话
export function taskGenerate(data) {
  return request({
    url: '/auxiliary/commonTranslation/translation/common/generate',
    method: 'post',
    data
  })
}

// 获取翻译语言列表
export function getTranslationLanguages() {
  return request({
    url: '/auxiliary/commonTranslation/translation/languages',
    method: 'get',
  })
}