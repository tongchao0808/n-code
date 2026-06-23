import {randomString, randomZhString} from "@/api/custom/fake";
import request from "@/utils/request";
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'

export async function getModelList() {
  const responseData = await request({
    url: "/chat/models",
    method: 'get'
  });
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return Promise.resolve(responseData.data.chatModels);
}

export function getFunctionList() {
  const res = [
    {path: "", title: "智能日程管理", desc: "自动同步会议、邮件、任务，AI预判优先级并生成待办清单", icon: "func-schedule"},
    {path: "", title: "思维导图", desc: "用户输入总结性文字内容，一键生成思维导图", icon: "func-brain"},
    {path: "", title: "通用翻译", desc: "支持文本上传，AI自动生成全文翻译", icon: "func-translate"},
    {path: "", title: "通用翻译", desc: "支持文本上传，AI自动生成全文翻译", icon: "func-translate"},
    {path: "", title: "文献综述", desc: "用户自定研究方向，AI辅助生成医学综述", icon: "func-abstract"},
    {path: "", title: "论文降重", desc: "AI对论文进行降重改写", icon: "func-paper"},
    {path: "", title: "工作报告", desc: "工作总结，链接知识库", icon: "func-report"},
    {path: "", title: "工作报告", desc: "工作总结，链接知识库", icon: "func-report"}
  ];
  res.forEach(item => {item.icon = require(`@/assets/images/custom/${item.icon}.png`)});
  return Promise.resolve(res);
}

export function getSimilarQuestions() {
  const res = [
    {text: "白血病有哪些主要的症状？"},
    {text: "白血病怎么治疗？"},
    {text: "这是一个比较长长厂长长厂长长长长长长长长长长长长长长长长长长长长的问题"},
  ];
  return Promise.resolve(res);
}

export function getChatHistory() {
  const res = generateChatData(5);
  return Promise.resolve(res);
}

function generateChatData(numPairs = 5) {
  // 用户问题及关联建议
  const questions = [
    {
      content: "如何用JavaScript实现数组去重？",
      suggestions: ["还有其他去重方法吗？", "ES6 Set的其他用途？", "对象数组如何去重？"]
    },
    {
      content: "Python的装饰器有什么作用？",
      suggestions: ["带参数的装饰器怎么写？", "装饰器影响性能吗？", "类装饰器是什么？"]
    },
    {
      content: "如何用CSS实现垂直居中？",
      suggestions: ["水平垂直居中怎么实现？", "Flex和Grid区别？", "position属性有哪些用法？"]
    }
  ];

  // 回答模板及关联建议
  const answerTemplates = [
    {
      generate: (q) => `# 大标题\n\n **JavaScript数组去重**方法：\n\`\`\`javascript\n[...new Set([1,2,2,3])]\n\`\`\`\n适用场景：\n- 基础类型去重\n- 简单数组结构`,
      suggestions: ["去重方法性能比较", "对象数组去重方案", "数组操作最佳实践"]
    },
    {
      generate: (q) => `**CSS垂直居中**方案：\n\`\`\`css\n.parent {\n  display: grid;\n  place-items: center;\n}\n\`\`\``,
      suggestions: ["Grid布局详解", "Flex布局兼容性", "居中方案对比"]
    },
    {
      generate: (q) => `**Python装饰器**功能：\n1. 代码复用\n2. 权限验证\n3. 日志记录\n\n示例：\n\`\`\`python\n@cache\ndef fib(n):...\n\`\`\``,
      suggestions: ["装饰器原理剖析", "类装饰器使用", "装饰器调试技巧"]
    }
  ];

  const chatLog = [];
  let timestamp = Date.now() - Math.floor(Math.random() * 3600000);

  for (let i = 0; i < numPairs; i++) {
    // 随机选择用户问题
    const question = questions[Math.floor(Math.random() * questions.length)];

    // 用户消息
    chatLog.push({
      role: "user",
      content: {
        content: question.content,
        suggestions: question.suggestions
      },
      created: timestamp
    });

    timestamp += 1000 + Math.random() * 2000;

    // 匹配对应的回答模板
    const template = answerTemplates.find(t =>
      t.generate.toString().includes(question.content.substring(0,5))
    ) || answerTemplates[0];

    // 助手消息
    chatLog.push({
      role: "ai",
      content: {
        content: template.generate(question.content),
        suggestions: template.suggestions
      },
      created: timestamp
    });

    timestamp += 1000 + Math.random() * 2000;
  }

  return chatLog;
}
//////////


export async function createSseConnection() {
  console.log('创建session');
  const responseData = await request({
    url: '/ytj/chat/createNewChat',
    method: 'POST',
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return Promise.resolve({
    sessionId: responseData.data,
  })
}

export async function fetchSimilarQuestions(sessionId) {
  console.log('获取会话级别的相似问题');
  const responseData = await request({
    url: "/ytj/historicalRecords/similarIssuesRecommend",
    method: 'get',
    params: {
      sessionId: sessionId
    }
  });
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return responseData.data;
}

export async function getMessageSuggestions(messageId) {
  console.log('获取消息的推荐', messageId);
  const responseData = await request({
    url: "/ytj/chat/similarIssuesRecommend",
    method: 'get',
    params: {
      messageId: messageId,
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return responseData.data;
}

export async function getMessageReferences(messageId) {
  console.log('获取消息的参考资料', messageId);
  // return Promise.resolve([])
  // return Promise.resolve([
  //   {title: '等待后端接口1', desc: '测试', websiteName: 'baidu', image: '', url: 'https://baidu.com'},
  //   {title: '等待后端接口2', desc: '测试', websiteName: 'baidu', image: '', url: 'https://baidu.com'},
  //   {title: '等待后端接口3', desc: '测试', websiteName: 'baidu', image: '', url: 'https://baidu.com'},
  // ])
  const responseData = await request({
    url: "/chat/reference/document",
    method: 'get',
    params: {
      messageUniqueId: messageId,
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return responseData.data;
}

// 创建新的会话 /chat/session/create
export async function createNewChatSession() {
  const scene = store.state.history.scene;
  const responseData = await request({
    url: '/chat/session/create',
    method: 'POST',
    data: {
      scene
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return Promise.resolve({
    sessionUniqueId: responseData.data.sessionUniqueId,
  })
}
// 获取消息id /chat/message/fetch/id/ai
export async function fetchMessageId(requestUniqueId) {
  const responseData = await request({
    url: '/chat/message/fetch/id/ai',
    method: 'get',
    params: {
      requestUniqueId
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return Promise.resolve({
    messageUniqueId: responseData.data,
  })
}
// 根据上下文获取推荐消息 /chat/message/recommend/next
export async function fetchRecommendMessage(messageUniqueId) {
  const responseData = await request({
    url: '/chat/message/recommend/next',
    method: 'get',
    params: {
      messageUniqueId
    }
  })
  if (responseData.code !== 200) {
    Message.error(`后端接口出现错误`);
    return Promise.reject(responseData.msg);
  }
  return Promise.resolve({
    data: responseData.data,
  })
}
