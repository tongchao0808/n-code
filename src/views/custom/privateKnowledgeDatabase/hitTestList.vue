<template>
  <div class="h-full py-[20px]">
    <div v-if="resData.list.length > 0" class="grid grid-cols-4 gap-[20px]">
      <div
        v-for="(item,index) in resData.list"
        :key="item.id"
        class="hit-card"
        @click="handleClick(item)"
      >
        <div class="flex justify-between">
          <div class="flex items-center">
            <div
              class="bg-[#3662ff] w-[32px] h-[32px] flex items-center justify-center rounded-full text-white"
            >{{ index+1 }}</div>
            <div class="ml-[8px]">{{ item.usTitle }}</div>
          </div>
          <div>{{ item.score.find(s=>s.type === modeMap[resData.searchMode])?.value.toFixed(2) }}</div>
        </div>

        <div class="my-[16px] ellipsis">
          {{ item.q }}
        </div>
        <div class="text-[#5F646C]">
          <i class="el-icon-document mr-[4px]" />
          {{ item.sourceName }}
        </div>
      </div>
    </div>
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center text-[#959BA1]">
        <svg-icon icon-class="hitList" class="!w-[120px] !h-[120px]" />
        <div class="mt-[20px]">命中段落显示在这里</div>
      </div>
    </div>

    <el-dialog
      v-loading="dialog.loading"
      :title="dialog.type === 'detail' ? '分段详情' : '编辑分段详情'"
      :visible.sync="dialog.visible"
      width="60vw"
    >
      <el-form
        ref="formRef"
        :model="dialog.form"
        :rules="rules"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="分段标题" prop="usTitle">
          <div v-if="dialog.type === 'detail'">{{ dialog.form.usTitle }}</div>
          <el-input v-else v-model="dialog.form.usTitle" />
        </el-form-item>

        <el-form-item label="分段内容" prop="q">
          <div v-if="dialog.type === 'detail'">{{ dialog.form.q }}</div>
          <editor v-else v-model="dialog.form.q" :min-height="200" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          v-if="dialog.type === 'detail'"
          type="primary"
          icon="el-icon-edit"
          @click="dialog.type = 'edit'"
        >编辑</el-button>
        <el-button v-else type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { updateSegmentation, getSegmentationDetail } from '@/api/custom/customKnowledgeBase'
export default {
  data() {
    return {
      resData: {
        list: []
      },
      dialog: {
        visible: false,
        type: 'detail',
        form: {},
        loading: false
      },
      modeMap: {
        embedding: 'embedding',
        fullText: 'reRank',
        hybrid: 'rrf'
      }
    }
  },
  computed: {
    rules() {
      return this.dialog.type === 'detail'
        ? {}
        : {
          q: [{ required: true, message: '请输入分段内容', trigger: 'blur' }]
        }
    }
  },
  methods: {
    setData(data) {
      this.resData = data
    },
    handleClick(item) {
      this.dialog.type = 'detail'
      this.dialog.visible = true
      this.dialog.loading = true
      getSegmentationDetail({ id: item.id }).then(res => {
        this.dialog.form = res.data
        this.dialog.loading = false
      })
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          updateSegmentation(this.dialog.form).then(res => {
            this.$message.success('保存成功')
            this.$emit('refresh')
            this.dialog.visible = false
          })
        } else {
          this.$message.error('请填写完整信息')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hit-card {
  background: linear-gradient(180deg, #e6f4ff 0%, #f7fbff 100%);
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  border: 2px solid #e4f1ff;
  cursor: pointer;

  &:hover {
    border-color: #3662ff;
  }
}
.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>
