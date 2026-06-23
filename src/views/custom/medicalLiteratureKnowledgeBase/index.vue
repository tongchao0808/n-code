

<template>
  <div class="knowledge-container">
    <div v-if="isMore || isSearch" class="pl-[24px] py-[6px]" style="border-bottom: 1px solid rgb(229, 230, 235);">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a @click="handleHomeClick">医学文献知识库</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="font-bold">{{ isMore?'更多':isSearch?'搜索结果':'' }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main w-[79%] max-w-[1240px]">
      <template v-if="!isMore">
        <h1 v-if="!isSearch" class="my-0 mx-auto font-bold text-center text-[36px]">医学文献知识库</h1>
        <div class="search-box flex mb-[8px]" :class="{'mt-[20px]':!isSearch}">
          <el-input v-model="params.keyword" placeholder="请输入搜索关键字" size="medium" clearable @keyup.enter.native="clickSearch" />
          <el-button type="primary" size="medium" class="font-bold" style="width:200px;"
            @click="clickSearch">搜索</el-button>
        </div>

        <Checkbox :is-search="isSearch" @change="checkChange">
          <div class="w-full h-full bg-white rounded-[8px] px-[12px] py-[10px] box-border flex flex-col">
            <div class="text-[10px] text-[#959BA1] leading-[13px] mb-[12px]">本搜索结果仅供查看，如需下载，请点击相关链接</div>

            <div class="flex flex-1 flex-col gap-[12px] overflow-auto">
              <div v-for="(item, index) in medicalList" :key="index" class="py-[8px] px-[12px] flex flex-col gap-[8px] hover:bg-[#F7F8FA] cursor-pointer" @click="getDetail(item)">
                <div class="text-[16px] text-[#1D2129] overflow-box" v-html="wordReplace(item.title)"></div>
                <div class="text-[12px] leading-[15px] flex justify-between">
                  <span class="text-[#5F646C] max-w-[80%] overflow-box">{{item.authors.map(x => x.name).join('，') }}</span>
                  <span class="text-[#959BA1]">发布日期：{{item.publicationDate }}</span>
                    </div>
                <div v-if="item.periodicalName" class="text-[#228E15] text-[14px] leading-[18px] overflow-box">{{ item.periodicalName }}-{{ item.periodicalVolume }}</div>
                <div class="text[14px] leading-[26px] text-[#5F646C] max-h-[52px] overflow-box">{{ item.abstractText }}</div>
              </div>
              <div v-if="medicalList.length === 0" class="text-[#999] flex flex-col items-center justify-center">
                <img src="@/assets/images/file-empty.png" class="w-[50%]">
                未搜索到相关结果
              </div>
            </div>

            <div class="float-right">
              <pagination v-show="total > 0" :total="total" :page.sync="params.pageNum"
                :limit.sync="params.pageSize" @pagination="clickSearch" />
            </div>
          </div>
        </Checkbox>
      </template>

      <!-- <template class="flex-1"> -->
      <div v-if="!isSearch" class="flex-1 flex justify-center gap-[20px] overflow-hidden" :class="{'upload-books':!isMore}">
        <div v-if="!isMore" class="upload flex-1 overflow-hidden">
          <div class="text-center text-white font-bold">本地上传</div>
          <div class="flex-1 overflow-hidden mt-[16px] mb-[8px]">
            <FileUpload v-model="fileList" :is-show-tip="false" :need-load-list="true"
              :class="['w-full','h-full','flex','flex-col', 'gap-[16px]',{isUpload:fileList.length}]" :is-del-confirm="true"
              :limit="20" :file-size="100" :file-type="['pdf','docx','doc','txt']"
              url='/attachment/knowledge/article/custom/upload' :data="{meta: meta}" del-confirm-text="将清除上传记录且彻底删除该文件"
              @loadListComplate="filesChange">
              <div class="w-full rounded-[8px] bg-white flex flex-col justify-center items-center"
                :style="`height: ${fileList.length?'100px':'100%'}`">
                <img src="@/assets/images/file-upload.png" class="w-[30px]">
                <span class="text-[14px] leading-[18px] mt-[8px] mb-[2px]">点击添加</span>
                <div v-if="!fileList.length" class="text-[#C9CDD4] px-[32px] text-[12px] leading-[18px]">
                  可上传pdf、docx、doc、txt文件,每个文件不超过100MB,每次上传数量不超过20个</div>
              </div>
            </FileUpload>
          </div>
        </div>

        <Book ref="book" :is-more="isMore" @checkMore="checkMore" />
      </div>
    </div>
    <MedicalDetail v-if="isMedicalDetail" :medicalId="medicalId" @close="isMedicalDetail=false" class="medical-detail" />
  </div>
</template>

<script>
import Checkbox from './checkbox.vue'
import Book from './book.vue'
import MedicalDetail from './medicalDetail.vue'
import { keyWordReplace } from '@/utils/generator/parseString.js'
import goPageHome from '@/components/mixins/goPageHome.js'
import {
  searchArticle,
} from '@/api/custom/medicalLiteratureKnowledgeBase.js'

export default {
  components: { Checkbox, Book, MedicalDetail },
  mixins: [goPageHome],
  data() {
      // 随机获取颜色值
    function getRandomColor() {
      const colorList =  [
        '#de97a0',
        '#91a9de',
        '#eccf83',
        '#9592d4',
        '#bcd19c',
        '#edc8b6'
      ]
      const randomIndex = Math.floor(Math.random() * colorList.length);
      return colorList[randomIndex];
    }
    return {
      meta: new Blob([JSON.stringify({knowledgeDatabaseId:6,pathId:0,bgColor:getRandomColor()})], {type: 'application/json'}),
      fileList: [],
      isMore: false,
      isSearch: false,
      medicalList: [],
      isMedicalDetail: false,
      total: 0,
      params: {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        conditions: []
      },
      medicalId: ''
    }
  },
  methods: {
    checkChange(val) {
      this.params.conditions = val
    },
    checkMore() {
      this.isMore = true
    },
    clickSearch() {
      if(!this.params.keyword) {
        this.$message.error('搜索关键词不能为空')
        return
      }
      this.isSearch = true
      searchArticle(this.params).then(data => {
        this.medicalList = data.records
        this.total = data.total
      })
    },
    handleSuccess(res) {
      console.log('------------', this.fileList);
      
      this.$modal.msgSuccess('上传成功')
    },
    wordReplace(str) {
      return keyWordReplace(str, this.params.keyword)
    },
    filesChange() {
        this.$refs.book.getList()
    },
    getDetail(item) {
      this.medicalId = item.id
      this.isMedicalDetail = true
    },
    handleHomeClick() {
      if (this.isMore) {
        this.$refs.book.returnHome();
        this.isMore = false;
      }
      this.isSearch = false
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(180deg, #EEF6FD, #fff);

  .main {
    height: 100%;
    flex: 1;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 20px 20px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .upload {
    // 背景颜色从上向下渐变
    background: linear-gradient(180deg, #90b0fb 0%, #e9edfe 100%);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    box-shadow: 0px 9px 28px 8px rgba(108, 118, 155, 0.05),
    0px 5px 7px 0px rgba(65, 114, 209, 0.08);

    ::v-deep {
      .upload-file-uploader {
        width: 100%;
        height: 100%;
        .el-upload {
          width: 100%;
          height: 100%;
        }
      }
    }

    .isUpload {
      ::v-deep {
        .upload-file-uploader {
          width: 100%;
          height: auto;
          .el-upload {
            width: 100%;
            height: auto;
          }
        }

        .upload-file-list {
          flex: 1;
          overflow-y: auto;
          background: #fff;
          border-radius: 8px;
          padding: 0 8px;

          .el-upload-list__item {
            padding: 8px;
            display: flex;

            .el-link--inner {
              word-break: break-all;

              .el-icon-document {
                display: block;
              }
            }
          }
        }
      }
    }
  }

  ::v-deep {
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #3662ff;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background: #3662ff;
      border-color: #3662ff;
    }
  }
}
.custom-grid-cols {
  grid-template-columns: 1fr 2fr;
}
.medical-detail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.upload-books {
  margin: 24px -20px -20px -20px;
  padding: 0 20px 20px 20px;
}

.search-box {
    ::v-deep {
        .el-input__inner {
            border-radius: 8px 0 0 8px;
        }

        .el-button--medium {
            border-radius: 0 8px 8px 0;
        }
    }
}
</style>
