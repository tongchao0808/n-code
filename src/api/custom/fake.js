import dayjs from "dayjs";
import LoremZh from "lorem-zh";

export function randomValue(maxValue, minValue) {
  maxValue = maxValue ? maxValue : 1000;
  minValue = minValue ? minValue : 10;
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

export function randomString(size) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function randomMarkdown(size) {
  const content = `
## 测试标题

# H1
## H2
### H3
#### H4
##### H5
###### H6

## 测试文本

这是一段普通文本

这是一段 **加粗** 的文本

这是一段 *斜体的* 文本

~~这是删除线的文本~~

下标文本：X<sub>2</sub>

上标文本：O<sup>2</sup>

> 这是一段引用的文本

这是一个 \`强调\` 的文本

## 测试表格

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

## 测试代码

这是一段代码

\`\`\`javascript
console.log('hello world')
\`\`\`

## 测试列表

### 无序列表
+ 列表一
+ 列表二
  + 列表二-1
  + 列表二-2
  + 列表二-3
+ 列表三
  * 列表一
  * 列表二
  * 列表三

### 有序列表

1. 第一行
2. 第二行
3. 第三行

### 任务表单

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
  - [ ] GFM task list 3-1
  - [ ] GFM task list 3-2
  - [ ] GFM task list 3-3
- [ ] GFM task list 4
  - [ ] GFM task list 4-1
  - [ ] GFM task list 4-2

## 测试数学公式

行内公式示例：$E = mc^2$

块级公式：

泰勒展开
$$ e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} $$

高斯积分
$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$

傅里叶变换
$$ F(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i\\omega x} dx $$


## 测试图片和超链接

[这是一个百度官网的超链接](https://www.baidu.com)

这是一个第三方的图片
![百度的图片](http://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024)

  `;
  const container = [];
  for (let i = 0; i < size; i++) {
    container.push(content);
  }
  return container.join("\n\n");
}

export function randomMarkdownEn(size) {
  const content = `
## Test Title

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Test Text

This is a normal paragraph.

This is a **bold** text.

This is an *italic* text.

~~This is a strikethrough text.~~

Subscript text: X<sub>2</sub>

Superscript text: O<sup>2</sup>

> This is a blockquote.

This is an \`emphasized\` text.

## Test Table

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

## Test Code

This is a code snippet:

\`\`\`javascript
console.log('hello world')
\`\`\`

## Test Lists

### Unordered List
+ Item One
+ Item Two
  + Sub-item 2-1
  + Sub-item 2-2
  + Sub-item 2-3
+ Item Three
  * Sub-item 3-1
  * Sub-item 3-2
  * Sub-item 3-3

### Ordered List

1. First item
2. Second item
3. Third item

### Task List

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
  - [ ] GFM task list 3-1
  - [ ] GFM task list 3-2
  - [ ] GFM task list 3-3
- [ ] GFM task list 4
  - [ ] GFM task list 4-1
  - [ ] GFM task list 4-2

## Test Math Formulas

Inline formula example: $E = mc^2$

Block-level formulas:

Taylor Series Expansion
$$ e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} $$

Gaussian Integral
$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$

Fourier Transform
$$ F(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i\\omega x} dx $$

## Test Images and Links

[This is a link to Baidu's official website](https://www.baidu.com)

This is a third-party image:
![Baidu Image](http://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024)

  `;
  const container = [];
  for (let i = 0; i < size; i++) {
    container.push(content);
  }
  return container.join("\n\n");
}

export function randomZhString(size) {
  const g = new LoremZh()
  return g.sentence(size);
}

export function randomEnum(dataList) {
  if (!Array.isArray(dataList) || dataList.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * dataList.length);
  return dataList[randomIndex];
}

export function randomDate(beforeDays, afterDays) {
  beforeDays = beforeDays ? beforeDays : 7;
  afterDays = afterDays ? afterDays : 7;

  const startTime = dayjs().subtract(beforeDays, 'day');
  const endTime = dayjs().add(afterDays, 'day');

  const diffTime = endTime.diff(startTime);
  const randomTime = Math.floor(Math.random() * diffTime);

  return startTime.add(randomTime, 'millisecond').format('YYYY-MM-DD HH:mm:ss');
}
