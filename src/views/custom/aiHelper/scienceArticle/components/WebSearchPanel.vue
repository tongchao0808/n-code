<template>
  <div class="web-search-panel">
    <div class="panel-header">
      <h3 class="header-title">网页搜索</h3>
      <div class="close-btn" @click="$emit('close')">
        <svg-icon icon-class="close" class-name="!w-[16px] !h-[16px] text-[#9CA3AF]"/>
      </div>
    </div>

    <div class="search-results">
      <div
        v-for="(result, index) in list"
        :key="index"
        class="search-item"
        @click="handleItemClick(result)"
      >
        <div class="item-header">
          <h4 class="item-title">{{ result.title }}</h4>
        </div>
        <p class="item-preview">{{ result.preview }}</p>
        <div class="item-footer">
          <div class="url-info">
            <div class="url-icon"><i class="el-icon-share text-[#fff] text-[13px]"></i></div>
            <span class="url-text">{{ result.url }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WebSearchPanel",
  emits: ['close', 'selectResult'],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleItemClick(result) {
      const url = result.url;
      if(url) {
        window.open(url, '_blank');
      }
      this.$emit('selectResult', result);
    }
  }
}
</script>

<style scoped lang="scss">
.web-search-panel {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid #F3F4F6;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  flex-shrink: 0;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }

  .close-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
      background: #F3F4F6;
    }
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;

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
}

.search-item {
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #F9FAFB;

  &:hover {
    background: #F9FAFB;
  }

  &:last-child {
    border-bottom: none;
  }
}

.item-header {
  margin-bottom: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  line-height: 1.4;
}

.item-preview {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-footer {
  display: flex;
  align-items: center;
}

.url-info {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 70%;
  overflow: hidden;
}

.url-icon {
  width: 16px;
  height: 16px;
  background: #b7b8bb;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.url-text {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
