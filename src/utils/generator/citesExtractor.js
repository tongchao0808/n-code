/**
 * CITE 链接提取工具类
 * 用于从流式分片字符串中提取 [内容](CITE) 格式的链接
 * 存储结构：Map<string, string>（key=完整链接字符串，value=中括号内内容）
 * 支持：跨分片拼接、自动去重、连续链接提取
 */
class CiteExtractor {
  /**
   * 构造函数：初始化缓存和存储容器
   */
  constructor() {
    this.cache = ''; // 缓存未完成的链接片段（处理跨分片截断）
    this.resultMap = new Map(); // 核心存储容器
    this.hasUpdates = false; // 更新状态标志
    this.hasLink = false; // 排查到链接文本，即使是已经存在的id也会更新状态
    // 正则表达式：匹配 [任意非 ] 字符](CITE)（全局匹配）
    this.citeRegex = /\[([^\]]*)\]\(CITE\)/g;
  }

  /**
   * 处理单个流式分片
   * @param {string} chunk - 流式返回的单个分片字符串（必填）
   * @throws {TypeError} 若 chunk 非字符串则抛出错误
   */
  processChunk(chunk) {
    // 参数校验
    if (typeof chunk !== 'string') {
      throw new TypeError('分片内容必须是字符串类型');
    }

    // 记录处理前的结果数量，用于判断是否有更新
    const previousSize = this.resultMap.size;
    
    // 拼接缓存，处理跨分片截断场景
    this.cache += chunk;

    // 循环提取所有完整的 [内容](CITE) 格式
    const matchResult = this.citeRegex.exec(this.cache);
    let hasNewLinks = false;
    if (matchResult !== null) {
      this.hasLink = true;

      const fullLink = matchResult[0]; // 完整链接字符串（如 "[引用1](CITE)"）
      const bracketContent = matchResult[1]; // 中括号内内容（如 "引用1"）

      // 检查是否为新链接或内容已变更的重复链接
      if (!this.resultMap.has(fullLink) || this.resultMap.get(fullLink) !== bracketContent) {
        hasNewLinks = true;
        this.resultMap.set(fullLink, bracketContent); // Map 自动去重
      }
    }

    // 如果有新链接或重复链接内容变更，更新状态标志
    if (hasNewLinks || this.resultMap.size !== previousSize) {
      this.hasUpdates = true;
    }

    // 清理缓存：仅保留最后一个未闭合 "[" 之后的内容（避免重复匹配）
    this._cleanCache(matchResult);
  }

  /**
   * 私有方法：清理缓存（仅保留可能未完成的链接片段）
   */
  _cleanCache(matchResult) {
    const lastUnclosedBracketIndex = this.cache.lastIndexOf('[');
    if (lastUnclosedBracketIndex !== -1) {
      this.cache = this.cache.slice(lastUnclosedBracketIndex);
    } else {
      this.cache = ''; // 无未闭合括号时清空缓存
    }

    if(lastUnclosedBracketIndex == 0 && matchResult != null) {
      this.cache = ''
    }
  }

  /**
   * 获取提取结果（Map 格式，支持原生 Map 方法）
   * @returns {Map<string, string>} key=完整链接字符串，value=中括号内内容
   */
  getResultMap() {
    // 返回 Map 副本，避免外部直接修改内部状态
    return new Map(this.resultMap);
  }

  /**
   * 获取提取结果（数组格式，便于序列化/展示）
   * @returns {Array<{ fullLink: string; bracketContent: string }>}
   */
  getResultArray() {
    return Array.from(this.resultMap.entries()).map(([fullLink, bracketContent]) => ({
      fullLink,
      bracketContent
    }));
  }

  /**
   * 清空所有状态（缓存 + 结果 + 更新状态），用于重新提取
   */
  clear() {
    this.cache = '';
    this.resultMap.clear();
    this.hasUpdates = false;
    this.hasLink = false;
  }

  /**
   * 获取已提取的链接总数
   * @returns {number} 去重后的链接数量
   */
  getCount() {
    return this.resultMap.size;
  }
  
  /**
   * 查询是否有更新（新链接添加或重复链接内容变更）
   * @returns {boolean} 如有更新返回true，否则返回false
   */
  hasUpdate() {
    return this.hasUpdates;
  }
  
  /**
   * 重置更新状态标志
   * 调用此方法后，hasUpdates() 将返回 false，直到再次添加新链接或出现重复链接
   */
  resetUpdateStatus() {
    this.hasUpdates = false;
  }

  /**
   * 查询是否有新链接添加
   * @returns {boolean} 如有新链接返回true，否则返回false
   */
  getHasNewLink() {
    return this.hasLink;
  }

  /**
   * 重置新链接状态标志
   * 调用此方法后，hasNewLink() 将返回 false，直到再次添加新链接
   */
  resetNewLinkStatus() {
    this.hasLink = false;
  }
}

// 导出工具类（ES Module 格式）
export default CiteExtractor;