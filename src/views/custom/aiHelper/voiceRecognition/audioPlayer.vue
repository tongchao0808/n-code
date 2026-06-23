<template>
    <div class="audio-player">
        <!-- 音频元素 (隐藏的原生控件) -->
        <audio ref="audio" :src="audioSrc" @timeupdate="updateProgress" @loadedmetadata="initPlayer"
            @ended="handleEnded" @playing="isPlaying = true" @pause="isPlaying = false" :volume="volume"
            :playback-rate="playbackRate"></audio>

        <div class="w-full h-full flex flex-col justify-center">
            <!-- 进度条 -->
            <div class="progress-container" @click="setProgress">
                <div class="progress-bar">
                    <!-- 已播放进度 -->
                    <div class="progress-filled" :style="{ width: `${progressPercent}%` }"></div>
                    <!-- 进度滑块 -->
                    <div class="progress-thumb" :style="{ left: `${progressPercent}%` }"
                        @mousedown.prevent="startDragging"></div>
                </div>
            </div>
            <div class="player-container">
                <!-- 控制按钮区域 -->
                <div class="controls-section">
                    <!-- 后退15秒 -->
                    <button class="control-btn" @click="seek(-15)" aria-label="后退15秒">
                        <svg-icon icon-class="backward-15-seconds" class-name="!w-[20px] !h-[20px]" />
                    </button>

                    <!-- 播放/暂停按钮 -->
                    <svg-icon :icon-class="isPlaying ? 'pause-icon' : 'play-icon'"
                        class-name="!w-[28px] !h-[28px] cursor-pointer hover:scale-110" @click="togglePlay" />

                    <!-- 前进15秒 -->
                    <button class="control-btn" @click="seek(15)" aria-label="前进15秒">
                        <svg-icon icon-class="forward-15-seconds" class-name="!w-[20px] !h-[20px]" />
                    </button>

                    <!-- 音量控制 -->
                    <el-popover placement="top-end" trigger="hover" popper-class="min-w-0 p-0">
                        <div class="volume-slider">
                            <input type="range" min="0" max="1" step="0.05" v-model="volume" @input="handleVolumeChange"
                                class="volume-range" aria-label="调节音量">
                        </div>
                        <button slot="reference" class="control-btn volume-btn" @click="toggleMute" aria-label="切换静音">
                            <svg-icon :icon-class="isMuted ? 'horn-off' : 'horn'" class-name="!w-[20px] !h-[20px]" />
                        </button>
                    </el-popover>
                </div>


                <!-- 进度条区域 -->
                <div class="progress-section">
                    <!-- 已播放时间 -->
                    <span class="time-display current-time">{{ formatTime(currentTime) }}</span>
                    /
                    <!-- 总时长 -->
                    <span class="time-display total-time">{{ formatTime(duration) }}</span>
                </div>

                <!-- 倍速控制 -->
                    <el-popover placement="top-end" trigger="hover" width="80px" popper-class="min-w-0 p-0 float-right">
                        <div>
                            <div v-for="speed in speedOptions" :key="speed" class="speed-option"
                                :class="{ active: playbackRate === speed }" @click="setPlaybackRate(speed)">
                                {{ speed }}x
                            </div>
                        </div>
                        <button slot="reference" class="control-btn speed-btn" aria-label="调整播放速度">
                            <i class="fa fa-tachometer"></i>
                            <span class="control-label">{{ playbackRate }}x</span>
                        </button>
                    </el-popover>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AudioPlayer',
    props: {
        // 音频文件地址
        audioSrc: {
            type: String,
            required: true
        },
        // 默认音量 (0-1)
        defaultVolume: {
            type: Number,
            default: 0.7,
            validator: (value) => value >= 0 && value <= 1
        },
        // 默认播放速度
        defaultSpeed: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            // 音频状态
            isPlaying: false,
            isMuted: false,
            currentTime: 0,
            duration: 0,
            progressPercent: 0,
            volume: this.defaultVolume,
            lastVolume: this.defaultVolume, // 用于静音时保存之前的音量
            playbackRate: this.defaultSpeed,

            // 控制显示状态
            showVolumeSlider: false,
            showSpeedOptions: false,
            isDragging: false,

            // 可用的播放速度选项
            speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2]
        };
    },
    mounted() {
        // 监听鼠标事件，处理进度条拖拽
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDragging);
    },
    beforeDestroy() {
        // 移除事件监听
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDragging);
    },
    methods: {
        // 初始化播放器
        initPlayer() {
            this.duration = this.$refs.audio.duration || 0;
            // 初始化时设置默认播放速度
            if (this.$refs.audio) {
                this.$refs.audio.playbackRate = this.playbackRate;
            }
        },

        // 切换播放/暂停
        togglePlay() {
            if (this.isPlaying) {
                this.$refs.audio.pause();
            } else {
                this.$refs.audio.play();
            }
        },

        // 更新播放进度
        updateProgress() {
            if (!this.isDragging) {
                this.currentTime = this.$refs.audio.currentTime;
                this.progressPercent = (this.currentTime / this.duration) * 100 || 0;
            }
        },

        // 设置播放进度
        setProgress(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.currentTime = pos * this.duration;
            this.$refs.audio.currentTime = this.currentTime;
            this.progressPercent = pos * 100;
        },

        // 开始拖拽进度条
        startDragging() {
            this.isDragging = true;
        },

        // 拖拽进度条
        handleDrag(e) {
            if (this.isDragging) {
                const rect = this.$el.querySelector('.progress-container').getBoundingClientRect();
                let pos = (e.clientX - rect.left) / rect.width;

                // 限制在 0-100% 范围内
                pos = Math.max(0, Math.min(1, pos));

                this.progressPercent = pos * 100;
                this.currentTime = pos * this.duration;
            }
        },

        // 停止拖拽进度条
        stopDragging() {
            if (this.isDragging) {
                this.isDragging = false;
                this.$refs.audio.currentTime = this.currentTime;
            }
        },

        // 前进/后退指定秒数
        seek(seconds) {
            let newTime = this.currentTime + seconds;
            // 确保不超出范围
            newTime = Math.max(0, Math.min(newTime, this.duration));
            this.$refs.audio.currentTime = newTime;
            this.currentTime = newTime;
        },

        // 切换静音
        toggleMute() {
            this.isMuted = !this.isMuted;

            if (this.isMuted) {
                // 静音时保存当前音量
                this.lastVolume = this.volume;
                this.volume = 0;
            } else {
                // 取消静音时恢复之前的音量
                this.volume = this.lastVolume;
            }
            // 直接设置audio元素的音量，确保静音状态变化能够生效
            if (this.$refs.audio) {
                this.$refs.audio.volume = this.volume;
            }
        },

        // 处理音量变化
        handleVolumeChange() {
            this.isMuted = this.volume === 0;
            if (!this.isMuted) {
                this.lastVolume = this.volume;
            }
            // 直接设置audio元素的音量，确保变化能够生效
            if (this.$refs.audio) {
                this.$refs.audio.volume = this.volume;
            }
        },

        // 设置播放速度
        setPlaybackRate(speed) {
            this.playbackRate = speed;
            this.showSpeedOptions = false;
            // 直接设置audio元素的播放速度，确保变化能够生效
            if (this.$refs.audio) {
                this.$refs.audio.playbackRate = speed;
            }
        },

        // 处理播放结束
        handleEnded() {
            this.isPlaying = false;
        },

        // 格式化时间 (秒 -> MM:SS)
        formatTime(seconds) {
            if (isNaN(seconds) || seconds === 0) return '00:00';

            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);

            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },
    }
};
</script>

<style scoped lang="scss">
.audio-player {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.player-container {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-top: 16px;
}


.play-btn:hover {
    transform: scale(1.05);
}

/* 进度条区域 */
.progress-section {
    flex: 1;
    display: flex;
    align-items: center;
}

.time-display {
    font-size: 12px;
    color: #666;
    min-width: 45px;
    text-align: center;
}

/* 进度条样式 */
.progress-container {
    width: 100%;
    height: 4px;
    background-color: #ddd;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
}

.progress-bar {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 3px;
}

.progress-filled {
    height: 100%;
    background-color: #3662FF;
    border-radius: 3px;
    transition: width 0.1s linear;
}

.progress-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-color: #3662FF;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.1s ease;
}

.progress-thumb:hover {
    transform: translate(-50%, -50%) scale(1.2);
}

/* 控制按钮区域 */
.controls-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.control-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
    font-size: 12px;
}

.control-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
}

.control-label {
    font-size: 12px;
}

/* 音量控制 */
.volume-control-wrapper {
    position: relative;
    display: inline-block;
}

.volume-control-btn {
    display: inline-block;
}

.volume-slider {
    padding: 8px;
    background-color: white;
    border-radius: 4px;
}

.volume-range {
    width: 100px;
    cursor: pointer;
}

/* 倍速控制 */
.speed-control {
    position: relative;
}

.speed-options {
    position: absolute;
    bottom: 90%;
    right: 0;
    margin-bottom: 5px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    overflow: hidden;
}

.speed-option {
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.speed-option:hover {
    background-color: #f0f0f0;
}

.speed-option.active {
    background-color: #3662FF;
    color: white;
}

/* 响应式调整 */
@media (max-width: 600px) {
    .player-container {
        flex-wrap: wrap;
        padding: 10px 15px;
    }

    .controls-section {
        width: 100%;
        justify-content: center;
        margin-top: 10px;
    }

    .control-label {
        display: none;
    }
}

::v-deep .el-popover {
    min-width: 0;
}
</style>
