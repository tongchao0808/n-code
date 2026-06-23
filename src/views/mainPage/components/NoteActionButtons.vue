<template>
  <div class="note-actions">
    <el-tooltip content="开启后，会对当前问题进行深度思考" placement="bottom">
      <div class="action-button" :class="{'active': activeTabs.includes('deepThink')}" @click="handleAction('deepThink')">
      <svg-icon icon-class="brain" class-name="!w-[16px] !h-[16px] icon-text"/>
      <span class="button-text">深度思考</span>
    </div>
    </el-tooltip>

    <el-tooltip content="开启后，会联网搜索相关资料" placement="bottom">
    <div class="action-button" :class="{'active': activeTabs.includes('searchMaterial')}" @click="handleAction('searchMaterial')">
      <svg-icon icon-class="note-search" class-name="!w-[16px] !h-[16px] icon-text"/>
      <span class="button-text">搜索资料</span>
    </div>
    </el-tooltip>

    <!-- <div class="action-button" @click="handleAction('documentEditor')">
      <svg-icon icon-class="note-edit" class-name="!w-[16px] !h-[16px] text-[#6B7280]"/>
      <span class="button-text">文档编辑器</span>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "NoteActionButtons",
  props: {
    onAction: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeTabs: []
    }
  },
  methods: {
    initActiveTabs(activeTabs) {
      this.activeTabs = activeTabs;
      this.onAction(this.activeTabs);
    },
    handleAction(type) {
      if (this.activeTabs.includes(type)) {
        this.activeTabs = this.activeTabs.filter(item => item !== type);
      } else {
        this.activeTabs.push(type);
      }
      this.onAction(this.activeTabs);
    }
  }
}
</script>

<style scoped lang="scss">
.note-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  // background: #F8F9FA;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: #E9ECEF;
    border-color: #DEE2E6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .button-text {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    line-height: 1;
  }

  .icon-text {
    color: #6B7280;
  }

    &.active {
      background: #EFF6FF;
      border-color: #DBEAFE;
  
      &:hover {
        background: #DBEAFE;
        border-color: #BFDBFE;
      }
  
      .button-text {
        color: #3B82F6;
      }
  
      .icon-text {
        color: #3B82F6;
      }
    }
}
</style>
