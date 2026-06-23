import {
  randomDate,
  randomMarkdown,
  randomMarkdownEn,
  randomString,
  randomValue,
  randomZhString
} from "@/api/custom/fake";

export function getResearchFunctions () {
  const res = [
    {category: "分类1", title: "文献综述", desc: "用户自定义研究方向，AI辅助生成医学综述", icon: "func-abstract", path: "/commonChat"},
    {category: "分类2", title: "文献阅读", desc: "支持语音转文字，会议纪要生成等", icon: "func-read", path: "/commonChat"},
    {category: "分类1", title: "研究立项", desc: "项目申报书辅助书写", icon: "func-project", path: "/commonChat"},
    {category: "分类2", title: "论文润色", desc: "输入内容，生成结构化笔记", icon: "func-pen", path: "/commonChat"},
    {category: "分类三三", title: "论文降重", desc: "支持文本上传，AI自动生成全文翻译", icon: "func-search", path: "/commonChat"},
    {category: "分类三三", title: "续写工具", desc: "工作总结，链接知识库", icon: "func-write", path: "/commonChat"},
  ];
  res.forEach((item) => {
    item.icon = require(`@/assets/images/custom/${item.icon}.png`);
  });
  return Promise.resolve(res);
}





// export function generateProjectProposalResult(form) {
//   return Promise.resolve({
//     id: randomString(10),
//     title: randomString(10),
//     dateTime: randomDate(10, 10),
//     desc: randomString(10),
//     content: randomMarkdown(100),
//   })
// }

export function translateProjectProposalResult(language) {
  return Promise.resolve({
    id: randomString(10),
    title: randomString(10),
    content: language === 'en' ? randomMarkdownEn(10) : randomMarkdown(10),
  })
}

export function generateProjectProposalResultHistory() {
  const records = [];
  const size = 100;
  for (let i = 0; i < size; i++) {
    records.push({
      id: randomString(10),
      title: randomZhString(15),
      desc: randomZhString(200),
      dateTime: randomDate(30, 0),
      content: randomMarkdownEn(100),
    })
  }
  return Promise.resolve({
    rows: records,
    total: size * 100,
  });
}
export function getProjectProposalResultHistoryDetail(id) {}
export function cleanProjectProposalResultHistory() {}
export function removeProjectProposalResultHistory(id) {}
export function renameProjectProposalResultHistory(id, name) {}
export function addProjectProposalResultHistoryToKg(id) {}

