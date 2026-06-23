<template>
  <div class="speech-gantt">

    <!-- 表头：时间刻度 -->
    <div class="gantt-header">
      <div class="gantt-header-speaker"></div>
      <div class="gantt-header-times">
        <div v-for="time in timeLabels" :key="time" class="gantt-header-time" :style="{ width: `${timeLabelWidth}%` }">
          {{ formatTime(time) }}
        </div>
      </div>
    </div>

    <!-- 主体：每个发言人的时间条 -->
    <div class="gantt-body">
      <div v-for="speaker in uniqueSpeakers" :key="speaker.id" class="gantt-speaker-row">
        <!-- 发言人ID -->
        <div class="gantt-speaker-name">
          <div
            class="h-[24px] w-[24px] rounded-full border-[1px] border-[#fff] flex items-center justify-center text-[12px] text-[#fff]"
            :style="{ backgroundColor: speaker.color }">{{ speaker.abbr }}</div>
          <div>{{ speaker.name }}</div>
        </div>


        <!-- 时间条容器 -->
        <div class="gantt-time-bars">
          <div v-for="(speech, idx) in speaker.speeches" :key="idx" class="gantt-time-bar" :style="{
            left: `${getBarLeft(speech.startTime)}%`,
            width: `${getBarWidth(speech.startTime, speech.endTime)}%`,
            backgroundColor: speaker.color
          }" @mouseover="activeSpeech = speech" @mouseout="activeSpeech = null"
            @click="handleSpeechClick(speech)">
            <!-- 悬停显示详情 -->
            <div class="gantt-bar-tooltip" v-show="activeSpeech === speech">
              <p>开始：{{ formatTime(speech.startTime) }}</p>
              <p>结束：{{ formatTime(speech.endTime) }}</p>
              <p>时长：{{ formatDuration(speech.endTime - speech.startTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpeechGanttChart',
  props: {
    speeches: {
      type: Array,
      required: true,
      default: () => []
    },
    labelCount: {
      type: Number,
      default: 6 // 时间刻度数量
    }
  },
  data() {
    return {
      activeSpeech: null,
      speakerColors: {},
      totalDuration: 0,
      minTime: 0,
      maxTime: 0
    };
  },
  computed: {
    // 按发言人分组
    uniqueSpeakers() {
      // 先计算总时间范围
      this.minTime = Math.min(...this.speeches.map(s => s.startTime));
      this.maxTime = Math.max(...this.speeches.map(s => s.endTime));
      this.totalDuration = this.maxTime - this.minTime;

      // 分组并分配颜色
      const grouped = {};
      this.speeches.forEach(speech => {
        if (!grouped[speech.speakerId]) {
          grouped[speech.speakerId] = {
            id: speech.speakerId,
            speeches: [],
            name: speech.speaker?.name || speech.speakerId,
            abbr: speech.speaker?.abbr || speech.speakerId.slice(0, 2),
            color: speech.speaker?.color || this.getSpeakerColor(speech.speakerId)
          };
        }
        grouped[speech.speakerId].speeches.push(speech);
      });
      return Object.values(grouped);
    },
    // 时间刻度列表
    timeLabels() {
      const labels = [];
      for (let i = 0; i <= this.labelCount; i++) {
        const time = this.minTime + (this.totalDuration / this.labelCount) * i;
        labels.push(Math.round(time));
      }
      return labels;
    },
    // 每个时间刻度的宽度（百分比）
    timeLabelWidth() {
      return 100 / this.labelCount;
    }
  },
  methods: {
    // 处理时间条点击事件，将选中的发言信息传递给父组件
    handleSpeechClick(speech) {
      this.$emit('speech-click', speech);
    },

    getSpeakerColor(id) {
      if (this.speakerColors[id]) return this.speakerColors[id];
      const hue = (id * 90) % 360; // 间隔更大，颜色区分更明显
      const color = `hsl(${hue}, 30%, 55%)`; // 低饱和、适中亮度
      this.speakerColors[id] = color;
      return color;
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    },
    formatDuration(seconds) {
      return seconds < 60 ? `${seconds.toFixed(2)}秒` : `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    },
    // 计算时间条的左侧偏移（百分比）
    getBarLeft(startTime) {
      return ((startTime - this.minTime) / this.totalDuration) * 100;
    },
    // 计算时间条的宽度（百分比）
    getBarWidth(startTime, endTime) {
      return ((endTime - startTime) / this.totalDuration) * 100;
    }
  }
};
</script>

<style scoped>
.speech-gantt {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.gantt-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

/* 表头 */
.gantt-header {
  display: flex;
  margin-bottom: 10px;
}

.gantt-header-speaker {
  width: 32px;
  font-weight: 500;
  color: #333;
}

.gantt-header-times {
  display: flex;
  flex: 1;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.gantt-header-time {
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* 主体 */
.gantt-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gantt-speaker-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.gantt-speaker-name {
  width: 100%;
  font-size: 12px;
  color: #959BA1;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  align-items: center;
}

.gantt-time-bars {
  position: relative;
  width: calc(100% - 32px);
  height: 4px;
  background: #f8f8f8;
  border-radius: 50%;
}

.gantt-time-bar {
  position: absolute;
  top: 0;
  height: 4px;
  /* border-radius: 50%; */
  cursor: pointer;
  transition: opacity 0.2s;
}

.gantt-time-bar:hover {
  opacity: 0.8;
}

/* 悬停 tooltip */
.gantt-bar-tooltip {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 120px;
  z-index: 10;
}
</style>
