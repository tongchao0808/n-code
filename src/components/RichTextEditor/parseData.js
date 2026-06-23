// 将表头内容合并到tbody中并加粗
export function mergeHeaderIntoTbody(htmlString) {
    // 创建临时容器解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // 处理所有表格
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
        // 获取表头行和tbody
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody') || document.createElement('tbody');

        if (thead) {
            // 获取所有表头单元格
            const thElements = thead.querySelectorAll('th');

            // 为表头文字添加strong标签并收集内容
            const headerContents = Array.from(thElements).map(th => {
                // 保存th的属性
                const attributes = Array.from(th.attributes).map(attr =>
                    `${attr.name}="${attr.value}"`
                ).join(' ');

                // 为内容添加strong标签（修正为strong）
                const contentWithTag = `<strong>${th.innerHTML}</strong>`;

                return `<td ${attributes}>${contentWithTag}</td>`;
            });

            // 创建包含表头内容的行
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = headerContents.join('');

            // 将表头行添加到tbody的最前面
            if (tbody.firstChild) {
                tbody.insertBefore(headerRow, tbody.firstChild);
            } else {
                tbody.appendChild(headerRow);
            }

            // 如果原本没有tbody，添加到表格
            if (!table.querySelector('tbody')) {
                table.appendChild(tbody);
            }

            // 移除原来的thead
            table.removeChild(thead);
        }
    });

    return tempDiv.innerHTML;
}