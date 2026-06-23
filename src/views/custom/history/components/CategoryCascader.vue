<script>
export default {
  name: "CategoryCascader",
  props: {
    value: {type: Array, required: true},
  },
  data() {
    return {
      options: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '辅助办公',
          label: '辅助办公',
          children: [
            {
              value: '日程管理', label: '日程管理', children: [
                {value: '智能日程管理', label: '智能日程管理'}
              ]
            },
            {value: '语音识别', label: '语音识别'},
            {value: '文档阅读', label: '文档阅读'},
            {value: '翻译', label: '翻译'},
          ]
        },
        {
          value: '医学研究',
          label: '医学研究',
          children: [
            {value: '科研辅助', label: '科研辅助'},
            {value: '医疗数据治理', label: '医疗数据治理'},
            {value: '智能随访', label: '智能随访'},
          ]
        },
        {
          value: '医技应用',
          label: '医技应用',
          children: [
            {value: '医学检验', label: '医学检验'},
            {value: '病理科', label: '病理科'}
          ]
        },
        {
          value: '临床应用',
          label: '临床应用',
          children: [
            {value: '专家辅助决策', label: '专家辅助决策'}
          ]
        }
      ],
    }
  },
  methods: {
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(nValue) {
        this.$emit('input', nValue);
      }
    }
  }
}
</script>

<template>
  <el-cascader v-model="bindValue" :options="options"
               :props="{ checkStrictly: true, expandTrigger: 'hover'  }"
               popper-class="custom-cascader"/>
</template>

<style lang="scss">
.custom-cascader {
  border-radius: 8px;
  margin-top: 4px !important;

  .popper__arrow {
    display: none;
  }

  .el-scrollbar__bar {
    display: none;
  }

  .el-cascader-menu__wrap {
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin: 0 !important;
  }

  .el-cascader-menu__list {
    padding: 8px !important;
  }

  .el-cascader-node {
    padding: 6px 16px !important;
    border-radius: 8px;

    .el-cascader-node__label {
      color: #1D2129;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .el-cascader-node:hover {
    background-color: #E8EFFF;
    font-weight: 400;
  }

  .el-cascader-panel .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 10px;
    right: -10px;
  }

  .el-cascader-panel .el-radio__input {
    visibility: hidden;
  }

  .el-cascader-panel .el-cascader-node__postfix {
    top: 10px;
  }
}
</style>
