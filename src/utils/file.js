import Router from '@/router/index.js';

// 校验是否支持预览
export function checkPreviewSupport(url) {
    const fileExt = url.split('.').pop().toLowerCase();
    return ['docx', 'doc', 'xlsx', 'xls', 'pdf'].includes(fileExt);
}
// 打开docx、doc、xlsx、xls、pdf文件
export function openFilePreview(url) {
    const fileExt = url.split('.').pop().toLowerCase();
    // 校验是否支持预览
    if (!['docx', 'doc', 'xlsx', 'xls', 'pdf'].includes(fileExt)) {
        handleJump(url);
        return;
    }
    const targetRoute = {
        path: `/filePreview/${encodeURIComponent(url)}`, // 路由的name（推荐，需与路由配置一致）
    }
    const routeInfo = Router.resolve(targetRoute)
    window.open(routeInfo.href, '_blank');
}

// 通过a标签跳转url
export function handleJump(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function getIconName(url) {
    const arr = url.split('.');
    if (arr.length < 2 || !['pdf', 'docx', 'txt', 'jpg', 'png'].includes(arr[arr.length - 1])) {
        return 'file-blue';
    } else {
        return arr[arr.length - 1] + '-blue';
    }
}