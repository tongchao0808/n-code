import request from '@/utils/request'
import store from "@/store";
import { nanoid } from "nanoid";

// 文献翻译
export function translateArticle(data) {
  const requestBody = {
    requestUniqueId: nanoid(32),
    question: '1',
    knowledgeDatabases: [],
    attachments: [],
    ...data
  }
  return request({
    url: '/medical/literatureRead/translate',
    method: 'post',
    data: requestBody
  })
}

// 重新翻译
export function reTranslateArticle(data) {
  return request({
    url: '/medical/literatureRead/reTranslate',
    method: 'post',
    data: {
      ...data,
      requestUniqueId: nanoid(32)
    }
  })
}

// 删除文献阅读记录
export function deleteReadHistory(sessionId) {
  const scene = store.state.history.scene;
  return request({
    url: '/medical/literatureRead/history/delete',
    method: 'post',
    data: {
      sessionId,
      scene
    }
  })
}

// 保存笔记
export function saveNotes(data) {
  return request({
    url: '/medical/literatureRead/deep/saveNotes',
    method: 'post',
    data
  })
}

// 发起提问
export function chat(data) {
  return request({
    url: '/medical/literatureRead/deep/chat',
    method: 'post',
    data
  })
}

// 重新回答问题
export function reChat(data) {
  return request({
    url: '/medical/literatureRead/deep/chat/regenerate',
    method: 'post',
    data
  })
}

// 文献深度阅读
export function deepReadArticle(data) {
  return request({
    url: '/medical/literatureRead/deep/detail',
    method: 'post',
    data
  })
}

// 搜索文献
export function searchArticle(data) {
  return request({
    url: '/medical/literatureRead/literature/search',
    method: 'post',
    data
  })
}

// 查询文献是否进行过深度阅读
export function isExistSessionId(literatureId) {
  const scene = store.state.history.scene;
  return request({
    url: '/medical/literatureRead/isExistSessionId',
    method: 'get',
    params: {
      literatureId,
      scene
    }
  })
}

// 查询阅读历史记录
export function getReadHistory(params) {
  params.scene = store.state.history.scene;
  return request({
    url: '/medical/literatureRead/history/list',
    method: 'get',
    params
  })
}

// 文献上传历史
export function getUploadHistory(params) {
  const scene = store.state.history.scene;
  return request({
    url: '/medical/literatureRead/upload/history',
    method: 'get',
    params: {
      ...params,
      scene
    }
  })
}

// 查询分析状态
export function getAnalysisStatus(params) {
  return request({
    url: '/medical/literatureRead/analysis/status',
    method: 'get',
    params
  })
}

// 获取当前翻译语言
export function getTranslateLanguage(sessionId) {
  return request({
    url: '/medical/literatureRead/translate/language',
    method: 'get',
    params: {
      sessionId
    }
  })
}
