<script>
import Markdown from "@/components/custom/md/Markdown.vue";
export default {
  name: "ReferenceInfoDialog",
  components: { Markdown },
  props: {
    show: {type: Boolean, default: false},
    file: {type: Object, default: () => {}},
    message: {type: Object, default: () => {}},
  },
  data() {
    return {
        documentAndReferenceMap: '',
        referenceChunks: '',
        number: 0,
        list: []
    }
  },
    watch: {
        show: {
            handler(newVal) {
                if (newVal) {
                    this.refresh();
                }
            },
            immediate: true
        }
    },
  methods: {
      refresh() {
          this.documentAndReferenceMap = this.message.documentAndReferenceMap || new Map()
          this.referenceChunks = this.message.referenceChunks || new Map()
          this.list = this.documentAndReferenceMap.get(this.file.id) || []
          this.number = this.list.length
      },
    onCancel() {
      this.$emit('onCancel')
    },
    handleSrc(nameExt) {
      try {
        return require(`@/assets/images/${nameExt}.svg`);
      } catch (error) {
          return require(`@/assets/images/file-blue.svg`);
      }
    },
    parseName({name, extension}) {
      if(extension && extension != '未知' && !name.endsWith(`.${extension}`)) {
        name = name+`.${extension}`
      }
      return name
    }
  }
}
</script>

<template>
    <el-dialog class="custom-dialog" :visible="show" :show-close="false" width="800px" :modal-append-to-body="true">
        <div slot="title" class="flex justify-between items-center px-[32px] pt-[32px]">
            <span class="text-[#1D2129] text-[16px] font-bold">引用详情</span>
            <div class="cursor-pointer" @click.stop="onCancel">
                <svg-icon icon-class="close" class-name="!w-[24px] !h-[24px] text-[#808080]" />
            </div>
        </div>
        <div class="px-[32px] pb-[32px] pt-[24px] max-h-[90vh] overflow-auto">
            <div
                class="header-box flex flex-col items-start w-[736px] h-[109px] p-[16px] gap-[6px] bg-[#F2F3F5] rounded-[8px] mb-[24px]">
                <div class="text-[14px] text-[#1D2129] leading-[18px]">知识库引用数量（{{ number }}条）</div>
                <div class="text-[12px] text-[#959BA1] leading-[16px]">此处仅显示实际引用内容，若数据有更新，此处不会实时更新</div>
                <div class="w-full flex items-center gap-[4px] px-[8px] py-[4px] mt-[2px] bg-[#fff] rounded-[4px]">
                    <img class="w-[20px] h-[20px] m-[4px]" :src="handleSrc(file.extension)">
                    <span class="flex-1 text-[12px] text-[#5F646C] leading-[15px] overflow-box">{{ parseName(file) }}</span>
                </div>
            </div>
            <div class="content-box flex flex-col gap-[16px]">
                <div name="title" class="text-[20px] text-[#1D2129] leading-[26px] font-bold">{{ file?.name?.split('.')[0]
                }}</div>
                <div v-for="(item, index) in list" :key="index" class="flex gap-[8px]">
                    <span class="flex items-center justify-center w-[14px] h-[14px] bg-[#F5F8FF] text-[#3662FF]">{{
                        index + 1 }}</span>
                    <div>
                        <Markdown :content="item" />
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped lang="scss">
.custom-dialog {
  padding: 0;

  ::v-deep .el-dialog {
    border-radius: 8px;
  }

  ::v-deep .el-dialog__header {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }
}
</style>
