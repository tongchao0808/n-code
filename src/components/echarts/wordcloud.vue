
<template>
  <div ref="chartRef" class="w-full h-full" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const colors = [
  '#5E239D',
  '#2196F3',
  '#4CAF50',
  '#FFC107',
  '#FF5722',
  '#E91E63'
]

// 图表
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: ''
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.chart.setOption(this.handlerChartData())
      },
      deep: true
    }
  },

  mounted() {
    this.initChart()
  },
  methods: {
    handlerChartData() {
      const data = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        series: [
          {
            type: 'wordCloud',
            drawOutOfBound: true, // 允许超出范围绘制
            layoutAnimation: false,
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            shape: 'circle', // 形状，可选 circle、cardioid、diamond、triangle 等
            sizeRange: [20, 40], // 字体大小范围
            rotationRange: [0, 0], // 旋转范围
            textStyle: {
              color: () => colors[Math.floor(Math.random() * colors.length)] // 随机颜色
            },
            data: this.data
          }
        ]
      }
      return data
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartRef)
      this.chart.setOption(this.handlerChartData())
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
      this.chart.on('click', (params) => {
        this.$emit('clickSeries', params)
      })
    }
  }
}
</script>
