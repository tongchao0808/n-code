/**
 * Markdown文本分割工具
 * 将Markdown文本按其语法关键词分割成多个部分
 * 支持的语法：标题、加粗、斜体、链接、代码块、列表等
 */
export class MarkdownSplitter {
  constructor() {
    // 定义Markdown语法模式（按优先级排序）
    this.patterns = [
      // 代码块（```开头和结尾）
      { type: 'code_block', regex: /^```([\s\S]*?)```/ },
      // 标题（#开头）
      { type: 'heading', regex: /^(#{1,6})\s+(.*?)(?:\n|$)/ },
      // 列表项
      { type: 'list_item', regex: /^[*-]\s+(.*?)(?:\n|$)/ },
      // 链接（[文本](url)）
      { type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/ },
      // 加粗（**内容**）
      { type: 'bold', regex: /\*\*(.*?)\*\*/ },
      // 斜体（*内容*）
      { type: 'italic', regex: /\*(.*?)\*/ },
      // 图片（![alt](url)）
      { type: 'image', regex: /!\[([^\]]*)\]\(([^)]+)\)/ },
      // 代码（`内容`）
      { type: 'code', regex: /`(.*?)`/ },
      // 换行
      { type: 'line_break', regex: /\n/ },
    ];
  }

  /**
   * 将Markdown文本分割成多个部分
   * @param {string} markdown - 原始Markdown文本
   * @returns {Array} 分割后的部分数组，每个部分包含type和content
   */
  split(markdown) {
    const parts = [];
    let remaining = markdown;
    
    while (remaining.length > 0) {
      let matched = false;
      
      // 尝试匹配每种语法模式
      for (const pattern of this.patterns) {
        const match = remaining.match(pattern.regex);
        
        if (match && match.index === 0) {
          // 找到匹配项
          let content = match[0];
          let details = {};
          
          // 提取特定类型的详细信息
          switch (pattern.type) {
            case 'heading':
              details.level = match[1].length;
              details.text = match[2];
              break;
            case 'link':
              details.text = match[1];
              details.url = match[2];
              break;
            case 'image':
              details.alt = match[1];
              details.url = match[2];
              break;
            case 'bold':
            case 'italic':
            case 'code':
              details.text = match[1];
              break;
          }
          
          // 添加到结果数组
          parts.push({
            type: pattern.type,
            content: content,
            details: details
          });
          
          // 更新剩余文本
          remaining = remaining.slice(content.length);
          matched = true;
          break;
        }
      }
      
      // 如果没有匹配到任何模式，取单个字符作为普通文本
      if (!matched) {
        // 尝试获取最长的普通文本序列
        let plainTextEnd = remaining.length;
        
        // 查找下一个可能的语法开始位置
        for (const pattern of this.patterns) {
          const match = remaining.match(pattern.regex);
          if (match && match.index > 0 && match.index < plainTextEnd) {
            plainTextEnd = match.index;
          }
        }
        
        const plainText = remaining.slice(0, plainTextEnd);
        parts.push({
          type: 'text',
          content: plainText,
          details: {}
        });
        
        remaining = remaining.slice(plainTextEnd);
      }
    }
    
    return parts;
  }
}