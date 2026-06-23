import {randomDate, randomMarkdown, randomString, randomZhString} from "@/api/custom/fake";
import request, {download, downloadGet,downloadPost} from "@/utils/request";
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'

/**
 * @returns {Promise<Awaited<{rows: History[], total: number}>>}
 */
export async function getHistorySampleList() {
  const records = [];
  const size = 20;
  for (let i = 0; i < size; i++) {
    records.push({
      id: randomString(10),
      title: randomZhString(50),
      desc: randomZhString(500),
      dateTime: randomDate(30, 0),
    })
  }
  return Promise.resolve({
    rows: records,
    total: size * 100,
  });
}

export async function getHistoryList(keyword, categories, pageIndex, pageSize) {
  const records = [];
  const size = pageSize;
  if (pageIndex > 3) {
    return Promise.resolve({});
  }
  for (let i = 0; i < size; i++) {
    records.push({
      id: randomString(10),
      title: randomZhString(150),
      desc: randomZhString(500),
      dateTime: randomDate(30, 0),
    })
  }
  return Promise.resolve({
    rows: records,
    total: size * 100,
  });
}

/**
 *
 * @param {string} id
 * @returns {Promise<Awaited<{result: string}>>}
 */
export async function addHistoryToKg(id) {
  return Promise.resolve({
    result: 'ok'
  });
}

/**
 *
 * @param {string} id
 * @returns {Promise<Awaited<{result: string}>>}
 */
export async function removeHistory(id) {
  return Promise.resolve({
    result: 'ok'
  });
}

/**
 *
 * @param {string} id
 * @param {string} name
 * @returns {Promise<Awaited<{result: string}>>}
 */
export async function saveHistoryTitle(id, name) {
  return Promise.resolve({
    result: 'ok'
  });
}

/**
 * @param {string} id
 * @returns {Promise<Awaited<HistoryDetail>>}
 */
export async function getHistoryDetail(id) {
  return Promise.resolve({
    id: randomString(10),
    title: randomZhString(50),
    desc: randomZhString(500),
    dateTime: randomDate(30, 0),
    content: randomMarkdown(1),
  })
}

export async function downloadHistory(id) {
  return Promise.resolve({})
}


//////


export async function getUserChatSessionHistories() {
  console.log('获取当前用户历史记录')
  const responseData = await request({
    url: '/ytj/historicalRecords/getUserHistoryList',
    method: 'GET',
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
  return responseData.data.map(x => {
    return {
      title: x.title,
      records: x.records.map(y => {
        const kgIds = (y.kgIds === null || y.kgIds === undefined) ? "[]" : y.kgIds;
        const kgIdContents = kgIds.slice(1, -1).split(",");
        const kgIdArr= [];
        for (let i = 0; i < kgIdContents.length; i++) {
          kgIdArr.push(String(kgIdContents[i]).trim());
        }
        return {
          sessionId: y.sessionId,
          title: y.hisTitle,
          kgIds: kgIdArr,
        }
      })
    }
  });
}

export async function renameUserChatSessionHistory(sessionId, title) {
  console.log('历史会话重命名', sessionId, title);
  const responseData = await request({
    url: '/ytj/historicalRecords/sessionRename',
    method: 'POST',
    data: {
      'sessionId': sessionId,
      'hisTitle': title,
    }
  });
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
}

export async function addUserChatSessionHistoryToKg(sessionUniqueId, knowledgeDatabaseIds, title) {
  console.log('历史会话session加入到知识库内', sessionUniqueId, knowledgeDatabaseIds, title);
  if(Array.isArray(knowledgeDatabaseIds)) {
    knowledgeDatabaseIds = knowledgeDatabaseIds.map(id => {
      return {
        knowledgeDatabaseId: id,
        "pathId": 0
      }
    })
  }
  const responseData = await request({
    url: '/chat/session/append/knowledge',
    method: 'POST',
    data: {
      sessionUniqueId,
      knowledgeDatabases: knowledgeDatabaseIds,
      title,
    }
  });
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
  return responseData;
}

export async function addUserChatMessageHistoryToKg(aiMessageUniqueId, knowledgeDatabaseIds, title) {
  console.log('对话消息加入到知识库内', aiMessageUniqueId, knowledgeDatabaseIds, title);
  if(Array.isArray(knowledgeDatabaseIds)) {
    knowledgeDatabaseIds = knowledgeDatabaseIds.map(id => {
      return {
        knowledgeDatabaseId: id,
        "pathId": 0
      }
    })
  }

  return await request({
    url: '/chat/message/append/knowledge',
    method: 'POST',
    data: {
      aiMessageUniqueId,
      knowledgeDatabases: knowledgeDatabaseIds,
      title,
    }
  });
}

export async function removeUserChatSessionHistory(sessionId) {
  console.log('删除历史会话', sessionId);
  const responseData = await request({
    url: '/ytj/historicalRecords/sessionRemove',
    method: 'POST',
    data: {
      'sessionId': sessionId,
    }
  });
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
}

export async function removeUserChatMessage(messageId) {
  console.log('删除历史会话的某一条消息', messageId);
  const responseData = request({
    url: `/ytj/historicalRecords/${messageId}`,
    method: "delete"
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
}

export async function downloadUserChatSessionHistory(sessionUniqueId) {
  console.log('下载session对话', sessionUniqueId);
  await downloadPost(`/chat/session/append/freeze`,{sessionUniqueId}, "对话内容.pdf",{})
}

// 获取当前场景下的会话 /chat/sessions
export async function getCurrentChatSession() {
  const scene = store.state.history.scene;
  const responseData = await request({
    url: '/chat/sessions',
    method: 'GET',
    params: {
      scene,
    }
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
  return responseData.data.groupedSessions||[];
}
// 删除会话 /chat/session/remove
export async function removeChatSession(sessionUniqueId) {
  console.log('删除会话', sessionUniqueId);
  const responseData = await request({
    url: '/chat/session/remove',
    method: 'POST',
    data: {
      sessionUniqueId,
    }
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
}
// 重命名会话名称 /chat/session/rename
export async function renameChatSession(sessionUniqueId, title) {
  console.log('重命名会话名称', sessionUniqueId, title);
  const responseData = await request({
    url: '/chat/session/rename',
    method: 'POST',
    data: {
      sessionUniqueId,
      title,
    }
  })
  if (responseData.code !== 200) {
    Message.error("后端接口出现错误");
    return Promise.reject(responseData.msg);
  }
}

