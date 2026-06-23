<template>
  <div class="detail">
    <div class="detail-item">
      <div class="detail-title">节点名称</div>
      <div class="text-[#7B2DFF]">{{ formatDisplayName(cleanContent(detail.displayName)) }}</div>
    </div>

    <div class="detail-item">
      <div class="detail-title">节点类型</div>
      <div class="text-[#7B2DFF]">{{ cleanContent(detail.nodeTypeCnName || '无') }}</div>
    </div>

    <div v-for="property in Object.keys(detail.properties)" class="detail-item">
      <div class="detail-title">{{ DetailProperty[detail.nodeTypeEnName || 'term'][property] || DetailProperty.general[property] || '未定义属性' }}</div>
      <div class="detail-content">{{ cleanContent(detail.properties[property] || '无') }}</div>
    </div>

    <div v-if="detail.references.length" class="detail-item">
      <div class="detail-title">源文件</div>
      <div class="w-[100%] flex flex-col gap-[8px]">
        <a v-for="item in detail.references" :href="item.publicUrl" target="_blank"
          @click="(e) => handleDoc(e, item.publicUrl)"
          class="w-full flex items-center justify-between px-[8px] py-[4px] rounded-[4px] bg-[#F2F3F5] cursor-pointer">
          <span class="w-[90%] overflow-box">{{
            item.fileName }}</span>

          <svg-icon icon-class="right-arrow" class-name="!w-[16px] !h-[16px]"></svg-icon>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
import DetailProperty from './DetailProperty'
import { isExternal } from '@/utils/validate'
export default {
  name: 'Detail',
  props: {
    detail: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      DetailProperty
    }
  },
  methods: {
    handleDoc(event, url) {
      if (!isExternal(url)) {
        this.$message.error('文件未上传')
        event.preventDefault();
      }
    },
    formatDisplayName(name) {
      // 只显示中文
      // const chineseChars = name.match(/[\u4e00-\u9fa5]/g) || [];
      // name = chineseChars.join('');
      return name
    },
    cleanContent(text) {
      const keywords = ['上海', '复旦', '许蜜蝶', '王琦', '秦广琪', '丁斐', '柳蓓燕', '井薇玮', '顾燕子'];

      let result = text;
      keywords.forEach(word => {
        const reg = new RegExp(word, 'gi');
        result = result.replace(reg, '***');
      });

      return result;
    },
  }
}
</script>

<style scoped lang="scss">
.detail {
  width: 100%;
  height: auto;
  font-size: 14px;
  line-height: 24px;
  padding: 32px 0;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow-y: auto;
}

.detail-item {
  width: 50%;
  padding: 0 24px;
  margin-bottom: 24px;
}

.detail-title {
  margin-bottom: 8px;
  color: #1D2129;
}

.detail-content {
  color: #5F646C;
  max-height: 120px;
  overflow-y: auto;
}
</style>
