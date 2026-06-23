<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-1 overflow-hidden">
      <div class="w-[40%] p-[16px] text-[14px] border-r h-full">
        <div class="font-bold">设置设置分段规则</div>
        <div class="my-[16px]" @click="form.chunkMethod = 'auto'">
          <el-card shadow="never" class="w-full cursor-pointer">
            <div class="font-bold">
              <el-radio v-model="form.chunkMethod" label="auto">{{ '' }}</el-radio>智能分段（推荐）
            </div>
            <div class="text-[#959BA1] ml-[16px] mt-[10px]">不了解如何设置分段规则推荐使用智能分段</div>
          </el-card>
        </div>
        <div @click="form.chunkMethod = 'custom'">
          <el-card shadow="never" class="w-full cursor-pointer">
            <div class="font-bold">
              <el-radio v-model="form.chunkMethod" label="custom">{{ '' }}</el-radio>高级分段
            </div>
            <div class="text-[#959BA1] ml-[16px] my-[10px]">用户可根据文档规范自行设置分段标识符、分段长度一级清洗规则</div>

            <div class="bg-[#f2f3f5] p-[16px] rounded-[8px] ml-[16px]">
              <el-form ref="formRef" :model="form" label-position="top">
                <el-form-item label="分段标识">
                  <el-select v-model="form.chunkSplitMode" placeholder="请选择">
                    <el-option label="段落" value="paragraph" />
                    <el-option label="长度" value="size" />
                    <el-option label="分隔符" value="char" />
                  </el-select>
                </el-form-item>
                <el-form-item label="分段长度">
                  <el-slider v-model="form.chunkSize" show-input />
                </el-form-item>
                <el-form-item label="自动清洗">
                  <el-switch v-model="form.hasAutomatically" active-value="1" inactive-value="0" />
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
        <div class="mt-[10px]">
          <el-checkbox v-model="form.addTitle" label="导入时添加分段标题为关联问题（适用于标题为问题的问答时）" />
        </div>
        <div class="flex justify-end">
          <el-button size="small" round @click="handlePreview">生成预览</el-button>
        </div>
      </div>
      <div v-if="JSON.stringify(divisionData) !== '{}'" class="w-[60%] p-[16px] flex flex-col h-full">
        <div class="flex gap-[16px]">
          <div
            v-for="item in fileList"
            :key="item.response.data.taskId"
            :class="`p-[10px] rounded-[8px] cursor-pointer ${item.response.data.taskId === activeDocumentId? 'bg-[#e8efff]': 'bg-[#f7f8fa]'} `"
            @click="activeDocumentId = item.response.data.taskId"
          >{{ item.name }}</div>
        </div>
        <div v-loading="loading" class="flex-1 overflow-hidden mt-[10px] flex flex-col">
          <div class="flex justify-between items-center">
            <div class="text-sm text-textLight text-[#959BA1]">
              <span class="text-[#3662FF]">{{ divisionData.total }}</span>个段落
            </div>

            <!-- <el-button size="small" type="primary" @click=" dialog.form = {}; dialog.visible = true;"> + 添加分段</el-button> -->
          </div>
          <div class="flex-1 overflow-y-auto mt-[10px] flex flex-col gap-[16px]">
            <div
              v-for="(item,index) in divisionData.chunks"
              :id="`section-${index}`"
              :key="index"
              class="p-4 rounded bg-[#f5f8ff]"
            >
              <h3 class="font-bold mb-2">{{ item.usTitle || '标题' + (index + 1) }}</h3>
              <p class="text-textLight text-sm leading-relaxed" v-html="item.q" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-[60%] flex justify-center items-center">
        <div class="text-[28px] text-[#959BA1]">请先生成预览</div>
      </div>
    </div>
    <div class="flex justify-end">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" @click="handlePrev">上一步</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </div>

    <el-dialog
      v-loading="dialog.loading"
      title="添加分段"
      :visible.sync="dialog.visible"
      width="60vw"
    >
      <el-form
        ref="formRef"
        :model="dialog.form"
        :rules="dialog.rules"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="分段标题" prop="usTitle">
          <el-input v-model="dialog.form.usTitle" />
        </el-form-item>

        <el-form-item label="分段内容" prop="q">
          <el-input v-model="dialog.form.q" type="textarea" rows="4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="divisionData.chunks.push(dialog.form); dialog.visible = false;">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDocumentId, autoSegmentation } from '@/api/custom/customKnowledgeBase'
export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        chunkMethod: 'auto'
      },
      activeDocumentId: '',
      loading: false,
      divisionData: {},
      dialog: {
        loading: false,
        visible: false,
        form: {
          usTitle: '',
          q: ''
        },
        rules: {
          q: [{ required: true, message: '请输入分段内容', trigger: 'blur' }]
        }
      }
    }
  },
  watch: {
    activeDocumentId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.handlePreview()
        }
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('close')
    },
    handlePrev() {
      this.$emit('prev', false)
    },
    handleSubmit() {
      this.$emit('submit')
    },
    handlePreview() {
      this.activeDocumentId = this.fileList[0].response.data.taskId
      this.divisionData = {
        total: 0,
        chunks: []
      }
      this.loading = true
      getDocumentId({ taskId: this.activeDocumentId }).then(res => {
        this.form.documentId = res.data
        autoSegmentation({
          documentId: this.form.documentId,
          ...this.form
        }).then(res => {
          this.divisionData = res.data
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-radio__inner) {
  width: 15px;
  height: 15px;
}

::v-deep .el-radio__input.is-checked .el-radio__inner::after {
  content: '';
  width: 8px;
  height: 5px;
  border: 2px solid white;
  border-top: transparent;
  border-right: transparent;
  text-align: center;
  display: block;
  position: absolute;
  top: 3px;
  left: 3px;
  transform: rotate(-45deg);
  border-radius: 0px;
  background: none;
}
</style>
