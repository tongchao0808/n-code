import store from '@/store'

let scene = store.state.history.scene;

// common ----ai问答
// sop-agent ----质量管理智能体
// common-translation ---- 通用翻译
// assistant-note  ---- 笔记助手
// work-report      ---- 工作报告
// generate-slide  ---- 学术课件
// popular-science-article --- 科普文章
// project-application ---- 项目申报



// 写作模式编辑框点击保存时的URL
const saveUrlMap = {
  'work-report': '/auxiliary/work/report/content/update',
  'assistant-note': '/auxiliary/note/content/update',
  'project-application': '/medical/projectApplication/content/update',
  'ai-assisted-writing': '/medical/assistedWriting/content/update',
}

// 写作模式点击历史记录时，查询该会话生成的文章是否被编辑过（project-application这个页面没有设计历史记录功能，当前仅可保存，没有查询接口）
const checkUrlMap = {
  'work-report': '/auxiliary/work/report/content/changed',
  'assistant-note': '/auxiliary/note/content/changed',
  'ai-assisted-writing': '/medical/assistedWriting/content/changed',
}

// 必须上传附件的场景
const mustUploadAttachScenes = ['assistant-note'];

// 属于写作模式的场景
const writeModeScenes = ['work-report', 'assistant-note', 'generate-slide', 'project-application', 'review-generate', 'ai-assisted-writing'];

// 不是写作模式，但也需要深度思考选项的场景
const deepThinkModeScenes = ['popular-science-article'].concat(writeModeScenes);

// 不显示引用列表和猜你想问模块的场景
const noRefrenceSugesstionScene = ['literature-read-deep'].concat(writeModeScenes);

// 需要保存上传文件场景的场景（文献阅读的本地上传）
const saveUploadScene = ['literature-read-deep', 'literature-read-translate'];

// 初始空对话框上方的标题
const titleMap = {
  'common': '欢迎使用生物样本库知识库管理系统',
  'sop-agent': '生物样本知识库',
  'assistant-note': '帮我做笔记',
  'popular-science-article': "科普文章",
  'generate-slide': '帮我做学术课件',
  'work-report': '帮我做工作报告',
  'ai-assisted-writing': '欢迎使用AI辅助写作',
}

// 初始空对话框上方的副标题
const descMap = {
  'assistant-note': '请输入原文，一键生成大纲，快速帮你提炼重点',
  'popular-science-article': '医疗专业数据库，最近资讯，整合搜索，让你在5分钟内熟悉一个专业',
  'generate-slide': '请输入尽量多的信息和要求',
  'work-report': '请输入尽量多的工作信息和要求'
}

const llmInputPlaceholderMap = {
  'common': '发消息或输入问题',
  'sop-agent': '输入问题，与研小样对话……',
  'common-translation': '输入需要翻译的文本',
  'work-report': '输入报告详细要求',
  'assistant-note': '上传文件并输入笔记要求',
  'generate-slide': '输入课件要求',
  'popular-science-article': '输入需要查询的专业知识',
  'project-application': '输入项目申报要求',
  'ai-assisted-writing': '输入写作要求',
}

// 每个场景对应的对话BaseUrl，ai问答时后面会附加generate或regenerate
const generateMap = {
  'common': '/chat/ai/',
  'sop-agent': '/chat/ai/langgraph/',
  'common-translation': '/auxiliary/commonTranslation/translation/common/',
  'work-report': '/auxiliary/work/report/chat/ai/',
  'assistant-note': '/auxiliary/note/chat/ai/',
  'generate-slide': '/auxiliary/slide/chat/ai/',
  'popular-science-article': '/auxiliary/popularScience/article/',
  'project-application': '/medical/projectApplication/chat/ai/',
  'review-generate': '/medical/review/',
  'literature-read-deep': '/medical/literatureRead/deep/chat/',
  'ai-assisted-writing': '/medical/assistedWriting/chat/ai/',
}

// 执行方法前的前置操作
function refreshScene () {
  scene = store.state.history.scene;
}

// 获取写作模式下的保存URL
function getSaveUrlEvent () {
  return saveUrlMap[scene];
}

// 获取写作模式下的查询是否被编辑过URL
function getCheckUrlEvent () {
  return checkUrlMap[scene];
}

// 是否属于写作模式
function isWriteModeEvent () {
  return writeModeScenes.includes(scene);
}

// 是否不显示引用列表和猜你想问模块
function isNoRefrenceSugesstionEvent () {
  return noRefrenceSugesstionScene.includes(scene);
}

// 获取初始空对话框上方的标题
function getTitleEvent () {
  return titleMap[scene] || '';
}

// 获取初始空对话框上方的副标题
function getDescEvent () {
  return descMap[scene] || '';
}

// 获取不同场景下的对话BaseUrl
function getGenerateUrlEvent () {
  return generateMap[scene] || generateMap['common'];
}

// 是否需要深度思考模式
function isDeepThinkModeEvent () {
  return deepThinkModeScenes.includes(scene);
}

// 是否必须上传附件
function isMustUploadAttachEvent () {
  return mustUploadAttachScenes.includes(scene);
}

// 获取LLM输入框的占位符
function getLLMInputPlaceholderEvent () {
  return llmInputPlaceholderMap[scene] || llmInputPlaceholderMap['common'];
}

// 是否需要保存上传文件场景的场景（文献阅读的本地上传）
function isSaveUploadSceneEvent () {
  return saveUploadScene.includes(scene);
}

// 包装方法，确保在执行前先刷新场景值
function warpMethod (fn) {
  return function (...args) {
    refreshScene(); // 先执行前置方法
    return fn.apply(this, args); // 再执行原方法（保持this指向和参数正确）
  };
}

export const getSaveUrl = warpMethod(getSaveUrlEvent);
export const getCheckUrl = warpMethod(getCheckUrlEvent);
export const isWriteMode = warpMethod(isWriteModeEvent);
export const getEmptyChatTitle = warpMethod(getTitleEvent);
export const getEmptyChatDesc = warpMethod(getDescEvent);
export const getGenerateUrl = warpMethod(getGenerateUrlEvent);
export const isDeepThinkMode = warpMethod(isDeepThinkModeEvent);
export const isMustUploadAttach = warpMethod(isMustUploadAttachEvent);
export const getLLMInputPlaceholder = warpMethod(getLLMInputPlaceholderEvent);
export const isNoRefrenceSugesstion = warpMethod(isNoRefrenceSugesstionEvent);
export const isSaveUploadScene = warpMethod(isSaveUploadSceneEvent);
