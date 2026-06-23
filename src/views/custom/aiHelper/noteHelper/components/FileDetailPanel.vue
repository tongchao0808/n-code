<template>
  <div class="file-detail-panel">

    <div class="panel-content">
      <div v-if="fileInfo" class="file-info">
        <div v-if="fileInfo.description" class="info-item full-width ">

        {{ fileInfo.description }}
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "FileDetailPanel",
  props: {
    fileInfo: {
      type: Object,
      default: null
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.file-detail-panel {

  height: 100%;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #B8CDFF;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;

    &:hover {
      background: #b0b0b0;
    }
  }
}

.file-info {
  .info-item {
    display: flex;
    margin-bottom: 16px;
    font-size: 14px;
    color:#5F646C;
    line-height: 24px;

    &.full-width {
      flex-direction: column;

      label {
        margin-bottom: 8px;
      }
    }


  }
}


</style>
