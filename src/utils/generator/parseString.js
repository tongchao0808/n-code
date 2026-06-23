/**
 * 从字符串中提取指定类型的标签内容
 * @param {string} str - 包含标签的原始字符串
 * @param {string} tag - 要提取的标签类型（例如："Title"、"Content"等）
 * @returns {Array} - 包含所有匹配标签内容的数组
 */
export function extractContent(str, tag) {
    // 正则表达式匹配<Content>和</Content>之间的内容
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, 'g');
    const results = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        results.push(match[1]);
    }
    return results;
}

/**
 * 解析字符串中的标签内容，返回一个对象
 * @param {string} str - 包含标签的原始字符串
 * @returns {Object} - 标签名作为键，标签内容作为值的对象
 */
export function parseTagsToObject(str) {
    // 正则表达式：匹配 <标签>内容</标签> 格式
    // 标签名：\w+ 匹配字母、数字、下划线（可根据实际标签规则调整）
    const regex = /<(\w+)>(.*?)<\/\1>/g;
    const result = {};
    let match;

    // 循环匹配所有标签
    while ((match = regex.exec(str)) !== null) {
        const tag = match[1]; // 标签名（第一个捕获组）
        const content = match[2]; // 标签内容（第二个捕获组）
        result[tag] = content;
    }

    return result;
}

/**
 * 替换字符串中指定类型的标签内容
 * @param {string} str - 包含标签的原始字符串
 * @param {string} tag - 要替换的标签类型（例如："Title"、"Content"等）
 * @param {string} replacement - 替换的内容
 * @returns {string} - 替换后的字符串
 */
export function replaceContentTag(str, tag, replacement) {
    // 正则匹配 <tag>...</tag>（包含标签本身和内部所有内容）
    // 说明：
    // <tag> 匹配开始标签
    // (.*?) 非贪婪匹配内部所有内容（避免跨标签匹配）
    // <\/tag> 匹配结束标签
    // g 修饰符表示全局匹配（若有多个<tag>标签）
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
    return str.replace(regex, replacement);
}

/**
 * 删除字符串中指定类型的标签内容
 * @param {string} str - 包含标签的原始字符串
 * @param {string} startTag - 要删除的开始标签类型（例如："Title"、"Content"等）
 * @param {string} endTag - 要删除的结束标签类型（例如："Title"、"Content"等）
 * @returns {string} - 删除后的字符串
 */
export function deleteTagContent(str, tag) {
    const startTag = `<${tag}>`;
    const endTag = `</${tag}>`;
  // 注意：如果两个标签相同（都是「」），需要明确逻辑（比如匹配第一个和最后一个），这里按不同标签处理
  const hasBothTags = str.includes(startTag) && str.includes(endTag);
  
  if (hasBothTags) {
    // 同时存在时，删除开始标签、结束标签及中间内容（非贪婪匹配）
    return str.replace(new RegExp(`${startTag}.*?${endTag}`, 'g'), '');
  } else if (str.includes(startTag)) {
    // 只存在开始标签时，删除开始标签及后面所有内容
    return str.replace(new RegExp(`${startTag}.*`, 'g'), '');
  }
  
  // 都不存在时返回原字符串
  return str;
}

export function keyWordReplace(str, keyword) {
  if (!keyword) return str;
  // 创建不区分大小写且全局匹配的正则表达式
  const regex = new RegExp(escapeRegExp(keyword), 'gi');
  // 使用回调函数保持原始匹配文本的大小写
  return str.replace(regex, (match) => `<span class="text-[#FF5656]">${match}</span>`);
}

// 辅助函数：转义正则表达式中的特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}