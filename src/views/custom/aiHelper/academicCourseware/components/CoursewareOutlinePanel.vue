<template>
  <div class="courseware-outline-panel">
    <div class="panel-header">
      <div class="header-actions">
        <a class="action-btn" :href="data.url" target="_blank" :download="data.name+'.pptx'">
          <svg-icon icon-class="download1" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
          <span class="action-btn-text">下载</span>
        </a>
        <div class="action-btn action-btn-delete" @click="$emit('close')">
          <svg-icon icon-class="close" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
        </div>
      </div>
    </div>

    <div class="outline-content">
      <vue-office-pptx :src="data.url" style="width:100%;height:100%;" />
    </div>
  </div>
</template>

<script>
import { download } from '@/utils/request';
import VueOfficePptx from '@vue-office/pptx'
export default {
  name: "CoursewareOutlinePanel",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    VueOfficePptx
  },
  emits: ['close', 'action'],
  methods: {
    download(url) {
      download(url, {
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-powerpoint' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = this.data.name
        link.click()
        URL.revokeObjectURL(link.href)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.courseware-outline-panel {
  width: 100%;
  height: 100%;
  background: #FAFCFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid #F2F3F5;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: auto;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 4px 12px 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid  rgba(232, 239, 255, 1);
  font-size: 12px;
  &:hover {
    background: #F9FAFB;
    border-color: #E5E7EB;
  }
  .action-btn-text{
    padding-left: 10px;
  }
  &.action-btn-delete{
    border:none;
    background: #fff;
    border-radius: 4px;
  }
}

.outline-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;

    &:hover {
      background: #b0b0b0;
    }
  }

  ::v-deep .pptx-preview-wrapper {
    height: 100% !important;
    overflow-x: hidden;
  }
}
</style>
