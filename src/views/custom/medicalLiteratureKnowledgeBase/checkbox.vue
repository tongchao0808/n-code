<template>
  <div :class="`${isSearch?'flex-1 overflow-hidden flex flex-col gap-[8px]':'bg-white p-[20px] rounded-[12px]'}`">
    <div :class="`${checkListMap.length > 0?'h-[42px]':'h-0 !border-0'}`" class="overflow-hidden flex items-center justify-between transition-height duration-300" :style="`${isSearch?'padding: 0 24px;':'border-bottom: 1px solid rgb(229, 230, 235)'}`">
      <div class="mr-[20px]" style="color:#3662FF">已选条件</div>
      <div class="flex flex-1 overflow-x-auto overflow-y-hidden pl-[12px] pr-[8px]">
        <el-tag
          v-for="tag in checkListMap"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{ tag }}</el-tag>
      </div>

      <div>
        <el-button type="text" class="ml-[8px]" @click="emptyAll">清除全部</el-button>
      </div>
    </div>

    <div :class="`${isSearch?'flex-1 overflow-hidden flex gap-[20px]':''}`">
      <div :class="`${isSearch?'w-[200px] h-full bg-white rounded-[8px] px-[8px]':''}`">

        <el-collapse v-if="isSearch" v-model="activeName" style="height:100%;overflow-y:auto">
          <el-collapse-item v-for="(item,index) in checkboxOptions" :key="index" :title="item.label" :name="index">
            <el-checkbox
              v-model="item.checkAll"
              :indeterminate="item.isIndeterminate"
              style="margin-right:30px"
              @change="val=>handleCheckAllChange(val,item)"
            >{{ item.checkAllText }}</el-checkbox>
            <el-checkbox-group
              v-model="item.checkList"
              @change="val=>handleCheckedCitiesChange(val,item)"
            >
              <div v-for="city in item.checkOptions" :key="city">
                <el-checkbox :label="city">{{ city }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>

        <template v-else>
          <div v-for="(item,index) in checkboxOptions" :key="index" class="flex mt-[12px]">
            <div class="mr-[32px] min-w-[64px]" style="text-align-last: justify;">{{ item.label }}</div>
            <el-checkbox
              v-model="item.checkAll"
              :indeterminate="item.isIndeterminate"
              style="margin-right:30px"
              @change="val=>handleCheckAllChange(val,item)"
            >{{ item.checkAllText }}</el-checkbox>
            <el-checkbox-group
              v-model="item.checkList"
              @change="val=>handleCheckedCitiesChange(val,item)"
            >
              <el-checkbox v-for="city in item.checkOptions" :key="city" :label="city">{{ city }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
      </div>

      <div v-if="isSearch" class="flex-1 overflow-auto">
        <slot />
      </div>

    </div>

  </div>
</template>

<script>
import {
  getKnowledgeOptions
} from '@/api/custom/medicalLiteratureKnowledgeBase.js'
export default {
  props: {
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allOptionMap: new Map(),
      checkboxOptions: [],
      checkListMap: [],
      activeName: [0, 1, 2]
    }
  },
  created() {
    this.initCheckBoxOptions()
  },
  watch: {
    checkboxOptions: {
      handler(val) {
        let checkValueList = []
        this.checkListMap = []
        val.forEach(item => {
          if(!item.checkList || !item.checkList.length) return
          if (item.checkList.length === item.checkOptions.length) {
            this.checkListMap = [...this.checkListMap, item.checkAllText]
          } else {
            this.checkListMap = [...this.checkListMap, ...item.checkList]
          }
          checkValueList = [...checkValueList, {conditionId: item.conditionId, selectedOptions: item.checkList.map(i => this.allOptionMap.get(i))}]
        })
        this.$emit('change', checkValueList)
      },
      deep: true
    },
    // checkListMap: {
    //   handler(val) {
    //     this.$emit('change', val)
    //   },
    //   deep: true
    // }
  },
  methods: {
    initCheckBoxOptions() {
      getKnowledgeOptions().then(res => {
        if(res.code == 200 && res.data && res.data.length) {
          this.checkboxOptions = []
          res.data.forEach(item => {
            item.options.forEach(item => {
              this.allOptionMap.set(item.name, item.value)
            })
            const obj = {
              conditionId: item. conditionId,
              label: item.name,
              checkAll: false,
              checkAllText: '全部' + item.name,
              checkList: [],
              checkOptions: item.options.map(i => i.name),
              isIndeterminate: false
            }
            this.checkboxOptions.push(obj)
          })
          
        }
      })
    },
    handleCheckAllChange(val, item) {
      item.checkList = val ? item.checkOptions : []
      item.isIndeterminate = false
    },
    handleCheckedCitiesChange(value, item) {
      const checkedCount = value.length
      item.checkAll = checkedCount === item.checkOptions.length
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.checkOptions.length
    },
    handleClose(tag) {
      const checkAllItem = this.checkboxOptions.find(
        item => item.checkAllText === tag
      )
      if (checkAllItem) {
        checkAllItem.checkAll = false
        this.handleCheckAllChange(false, checkAllItem)
      } else {
        const item = this.checkboxOptions.find(item =>
          item.checkOptions.some(it => it === tag)
        )
        item.checkList = item.checkList.filter(it => it !== tag)
        this.handleCheckedCitiesChange(item.checkList, item)
      }
    },
    emptyAll() {
      this.checkboxOptions.forEach(item => {
        item.checkAll = false
        item.checkList = []
        item.isIndeterminate = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-tag {
    background: transparent;
    color: #3662ff;
    border-color: #3662ff;
    padding: 0 8px;
    border-radius: 8px;

    // .el-tag__close {
    //   color: 3662ff;
    //   &::before {
    //     border-color: #3662ff;
    //   }
    // }
  }

  .el-tag--medium {
    font-size: 14px;
    height: 26px;
  }

  .el-collapse,.el-collapse-item__header,.el-collapse-item__wrap{
    border: none;
  }
}
</style>
