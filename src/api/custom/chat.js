import { randomString, randomValue, randomZhString } from "@/api/custom/fake";
import { getToken } from "@/utils/auth";
import request from "@/utils/request";
import { Message } from "element-ui";
import { EventSourcePolyfill } from "event-source-polyfill";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import CiteExtractor from "@/utils/generator/citesExtractor";

// /chat/ai/regenerate
export async function streamChatWithAI (params, message, cb) {
  const requestBody = params;
  const token = 'Bearer ' + getToken();
  const response = await fetch('/ytj-server/ytj/chat/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(requestBody),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      cb('end');
      break;
    }
    const chunkData = decoder.decode(value, { stream: true });
    const chunk = JSON.parse(chunkData);
    if (chunk.content === '[DONE]') {
      cb('end');
    } else {
      cb('chunk', chunk, message);
    }
  }
}

/**
 * 流式SSE请求
 * @param {*} params 请求参数
 * @param {*} message 消息对象
 * @param {*} type 请求类型: generate, regenerate
 * @param {*} cb 回调函数
 * @param {*} baseUrl 基础URL
 */
export async function sseChat (params, message, type, cb, baseUrl = '/chat/ai/') {
  const ctrl = new AbortController();
  const url = `${process.env.VUE_APP_BASE_API}${baseUrl}${type}`;
  const token = 'Bearer ' + getToken();
  const citesExtractor = new CiteExtractor()
  let referenceCache = ''
  fetchEventSource(url, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    withCredentials:true,
    body: JSON.stringify(params),
    signal: ctrl.signal,
    openWhenHidden: true,
    async onopen (response) {
      if (response.status !== 200) {
        throw response;
      }
    },
    onmessage (msg) {
       if (msg.event === 'close') {ctrl.abort();}

      const data = JSON.parse(msg.data);

      if (data.stop === true) {
        cb('end', data, message, citesExtractor);
      } else {
        // // 替换think样式
        // // 提取引用文献数据块
        // if(data.content.includes('[') || referenceCache.length > 0 && referenceCache.length < 32) {
        //   if(data.content.includes('[') && !['[', ')'].includes(data.content[0])) {
        //     // 如果content中包含‘[‘但'['不是第一个字符，则将'['之前的内容单独显示，'['及之后的内容放入缓存中
        //     let idx = data.content.indexOf('[')
        //     let newContent = data.content.slice(idx)
        //     data.content = data.content.slice(0, idx)
        //     cb('chunk', data, message);
        //     data.content = newContent
        //   }
        //   referenceCache = referenceCache + data.content
        //   if(referenceCache.length < 32) return;
        //   const endIndex = referenceCache.indexOf(')')
        //   if(endIndex > -1 && endIndex != (referenceCache.length - 1)) {
        //     // 用于处理连在一起的两个引用，前一个引用的)和后一个引用的[同时在一个模块中的情况
        //     data.content = referenceCache.slice(0, endIndex + 1)
        //     referenceCache = referenceCache.slice(endIndex + 1)
        //   }else{
        //     data.content = referenceCache
        //     referenceCache = ''
        //   }
        // }
        citesExtractor.resetNewLinkStatus()
        citesExtractor.processChunk(data.content)
        cb('chunk', data, message, citesExtractor);
      }
    },
    onclose () {
      ctrl.abort()
    },
    onerror (err) {
      cb('end');

        throw err; // rethrow to stop the operation

    }
  });

}

/**
 * 上传对话过程中的文件
 * @param {FormData} formData
 * @returns {Promise<Awaited<{id: string, name: string, size: number, url: string}>>}
 */
export async function uploadAIChatFile (formData) {
  return Promise.resolve({
    id: randomString(10),
    name: randomString(40),
    size: randomValue(10, 50),
    url: 'http://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024',
  });
}

/**
 * 移除对话过程中的文件
 * @param {string} id
 * @returns {Promise<Awaited<{result: string}>>}
 */
export async function removeAIChatFile (id) {
  return Promise.resolve({
    result: 'ok'
  });
}

/**
 * 拷贝对话到剪切板
 */
export async function copyChat (chat) {
  if (chat === undefined || chat.content === undefined || chat.content.length <= 0) {
    return;
  }
  await navigator.clipboard.writeText(chat.content);
  this.$notify({
    title: '复制成功',
    message: '数据已经复制到剪切板中',
    type: 'success'
  });
}

/**
 * 下载对话的内容
 */
export async function downloadChat (chat) {

}

export async function removeChat (chat) {

}

export async function addToKnowledge (chat) {

}

// 获取会话消息 /chat/messages
export async function getChatMessages (sessionUniqueId) {
  console.log('获取历史消息列表', sessionUniqueId );
  const responseData = await request({
    url: "/chat/messages",
    method: 'get',
    params: {
      sessionUniqueId,
    }
  });
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return responseData.data.messages.map(item => {
    return {
      ...item,
      content: {
        ...item,
        content: item.content || item.question,
        suggestions: item.nextQuestionRecommends ? (item.nextQuestionRecommends.map(item => item.question)) : undefined,
      },
    }
  });
}
// /chat/session/rename/auto 自动命名会话
export async function renameSession (sessionUniqueId) {
  console.log('自动命名会话', sessionUniqueId );
  const responseData = await request({
    url: "/chat/session/rename/auto",
    method: 'post',
    data: {
      sessionUniqueId,
    },
    // body: JSON.stringify({sessionUniqueId}),
  });
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return responseData.data
}
// 获取引用消息数据块内容
export async function getReferenceData (referenceChunkId ) {
  const responseData = await request({
    url: "/chat/reference/chunk",
    method: 'get',
    params: {
      referenceChunkId,
    }
  });
  if (responseData.code !== 200) {
    return Promise.reject(responseData.msg);
  }
  return responseData
}

export async function removeChatMessage(messageUniqueId) {
  const responseData = await request({
    url: '/chat/message/remove',
    method: 'POST',
    data: {
      messageUniqueId,
    }
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
  return responseData
}
