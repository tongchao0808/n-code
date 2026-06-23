/**
 * 生成低饱和度的RGB颜色（柔和色调）
 * @param {number} maxSaturation 最大饱和度 (0-100)，默认30（较低饱和度）
 * @param {number} minLightness 最小亮度 (0-100)，默认30
 * @param {number} maxLightness 最大亮度 (0-100)，默认70
 * @returns {string} RGB颜色字符串
 */
function getLowSaturationRgbColor(
    maxSaturation = 80,
    minLightness = 40,
    maxLightness = 90
) {
    // 限制参数范围
    maxSaturation = Math.max(0, Math.min(100, maxSaturation));
    minLightness = Math.max(0, Math.min(100, minLightness));
    maxLightness = Math.max(minLightness, Math.min(100, maxLightness));

    // 生成随机色相 (0-360)
    const hue = Math.floor(Math.random() * 360);
    
    // 生成低饱和度 (0到maxSaturation之间)
    const saturation = Math.floor(Math.random() * (maxSaturation + 1));
    
    // 生成适中亮度
    const lightness = minLightness + Math.floor(Math.random() * (maxLightness - minLightness + 1));

    // 转换HSL到RGB
    const { r, g, b } = hslToRgb(hue, saturation, lightness);
    
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * HSL转RGB颜色
 * @param {number} h 色相 (0-360)
 * @param {number} s 饱和度 (0-100)
 * @param {number} l 亮度 (0-100)
 * @returns {Object} 包含r, g, b属性的对象
 */
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // 完全灰色
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1/3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export default getLowSaturationRgbColor