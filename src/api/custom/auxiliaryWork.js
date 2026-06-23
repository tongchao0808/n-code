export function getAuxiliaryWorkFunctions() {
  const res = [
    {title: "语音识别", desc: "支持语音转文字，会议纪要生成等", icon: "func-mic", path: "voiceRecognition"},
    {title: "工作报告", desc: "工作总结，链接知识库", icon: "func-report2", path: "workReport"},
    {title: "通用翻译", desc: "支持文本上传，AI自动生成全文翻译", icon: "func-translate2", path: "generalTranslation"},
    {title: "笔记助手", desc: "输入内容，生成结构化笔记", icon: "func-note", path: "noteHelper"},
    {title: "科普文章", desc: "用户自定研究方向，AI辅助生成医学综述", icon: "func-book", path: "scienceArticle"},
    {title: "学术课件", desc: "支持学术报告，教学课件等生成", icon: "func-scholar", path: "academicCourseware"},
  ];
  res.forEach((item) => {
    item.icon = require(`@/assets/images/custom/${item.icon}.png`);
  });
  return Promise.resolve(res);

}

export function getScienceResearchFunctions() {
  const res = [
    {title: "文献阅读", desc: "支持深度阅读，文献翻译等", icon: "doc-reader", path: "docReader"}, 
    {title: "项目申报辅助编写", desc: "支持分步骤完成项目申报材料编写", icon: "project-application", path: "projectApplication"},
    {title: "医学综述AI辅助生成", desc: "支持根据关键字智能生成医学综述", icon: "medical-review", path: "medicalReviewAi"},
    {title: "AI辅助写作", desc: "支持学术论文创作、润色、扩写、降重等", icon: "ai-write", path: "aiWrite"},
  ];
  res.forEach((item) => {
    item.icon = require(`@/assets/images/custom/${item.icon}.png`);
  });
  return Promise.resolve(res);

}
