/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  content: [],
  theme: {
    extend: {
      lineClamp: {
        2: '2',
        3: '3',
        4: '4',
        5: '5',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        // 基类：.overflow-box
        '.overflow-box': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
        // 多行类：继承基类 + 动态行数
        '.overflow-box-multi': {
          '@apply overflow-box': {},
          'white-space': 'normal',
          'display': '-webkit-box',
          '-webkit-line-clamp': theme('lineClamp.3'), // 默认 3 行（从主题读取）
          '-webkit-box-orient': 'vertical',
        },
      }, { variants: ['responsive'] });

      // 3. 为多行类添加动态行数 modifier（正确格式）
      addUtilities(
        Object.fromEntries(
          // 从 theme.lineClamp 中读取所有行数，生成对应的工具类
          Object.entries(theme('lineClamp')).map(([key, value]) => [
            `.overflow-box-multi-${key}`,
            {
              '@apply overflow-box-multi': {},
              'white-space': 'normal',
              '-webkit-line-clamp': value,
            },
          ])
        ),
        { variants: ['responsive'] } // 支持响应式前缀
      );
    },
  ],
  corePlugins: {
    preflight: false
  }
}

