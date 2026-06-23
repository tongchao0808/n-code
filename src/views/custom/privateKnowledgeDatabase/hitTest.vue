<template>
  <div class="flex flex-col overflow-hidden h-full">
    <!-- 顶部导航栏 -->
    <div class="flex items-center px-4 py-2 border-b">
      <el-button
        icon="el-icon-arrow-left"
        type="text"
        class="mr-2 !text-[#959BA1]"
        @click="goBack"
      >返回文件列表</el-button>
    </div>
    <div class="flex flex-col flex-1 overflow-hidden p-[20px]">
      <div>
        <div class="text-[20px]">命中测试</div>
        <div class="text-[#959BA1] mt-[20px]">针对用户提问调试段落匹配情况，保障回答效果。</div>
      </div>
      <div v-loading="loading" class="flex-1 overflow-hidden">
        <hitTestList ref="hitTestList" @refresh="handleSearch" />
      </div>

      <div class="my-4 flex justify-center hitSearch">
        <div>
          <div>
            <el-button plain @click="dialogVisible = true">
              <svg-icon icon-class="setting" class="mr-[2px] w-[24px] h-[24px]" />参数设置
            </el-button>
          </div>
          <el-input v-model="form.text" class="!w-[50vw] mt-[20px]" placeholder="请输入内容">
            <template slot="append">
              <div
                class="bg-[#3662ff] w-[56px] h-[32px] rounded-[20px] flex items-center justify-center cursor-pointer"
                @click="handleSearch"
              >
                <svg-icon icon-class="send" class="mr-[2px] w-[40px] h-[40px] text-white" />
              </div>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 参数设置 -->
    <el-dialog title="检索模式" :visible.sync="dialogVisible" width="500px">
      <div class="flex flex-col gap-[20px]">
        <div v-for="item in radioOptions" :key="item.value" @click="searchMode = item.value">
          <el-card shadow="never" class="w-full cursor-pointer">
            <div class="font-bold">
              <el-radio v-model="form.searchMode" :label="item.value">{{ '' }}</el-radio>
              {{ item.label }}
            </div>
            <div class="text-[#959BA1] mt-[10px]">{{ item.subTitle }}</div>
          </el-card>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-[10px] mt-[20px]">
        <div>
          <div>相似度高于</div>
          <el-input-number
            v-model="form.similarity"
            controls-position="right"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="1"
          />
        </div>
        <div>
          <div>引用分段数Top</div>
          <el-input-number v-model="form.limit" controls-position="right" :min="100" :max="20000" />
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { hitTest } from '@/api/custom/customKnowledgeBase'
import hitTestList from './hitTestList.vue'
export default {
  components: {
    hitTestList
  },
  data() {
    return {
      form: {
        text: '',
        searchMode: 'embedding',
        similarity: 0,
        limit: 100
      },
      dialogVisible: false,
      radioOptions: [
        {
          label: '向量检索',
          subTitle:
            '向量检索是一种基于向量相似度的检索方式，适用于知识库中的大数据量场景。',
          value: 'embedding'
        },
        {
          label: '全文检索',
          subTitle:
            '全文检索是一种基于文本相似度的检索方式，适用于知识库中的小数据量场景。',
          value: 'fullText'
        },
        {
          label: '混合检索',
          subTitle:
            '混合检索是一种基于向量和文本相似度的检索方式，适用于知识库中的中等数据量场景。',
          value: 'hybrid'
        }
      ],
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSearch() {
      if (!this.form.text) {
        this.$message.warning('请输入内容')
        return
      } else {
        this.loading = true
        hitTest({ ...this.form, datasetId: this.$route.query.databaseId }).then(res => {
          this.$refs.hitTestList.setData(res.data)
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hitSearch{
  ::v-deep(.el-input) {
    border-color: #3662ff !important;
    border-width: 1px !important;
    border-radius: 20px !important;
    padding: 4px 0 !important;
    overflow: hidden;
  }

  ::v-deep(.el-input-group__append) {
    border: none !important;
    background: transparent !important;
  }
  ::v-deep(.el-input__inner) {
    border: none !important;
  }
}

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
