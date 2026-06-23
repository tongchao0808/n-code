<script>
import Sortable from 'sortablejs';

export default {
  name: "BasicTable",
  props: {
    loading: {type: Boolean, required: true,},
    dataList: {type: Array, required: true,},
    needSelect: {type: Boolean, required: false, default: false},
    headTextAlign: {type: String, required: false,},
    selectionChange: {type: Function, required: false,},
    sortChange: {type: Function, required: false,},
    fixHeader: {type: Boolean, required: false,},
    height: {type: [String, Number], required: false, default: "auto"},
    needDropSort: {type: Boolean, required: false, default: false},
    rowKey: {type: String, required: false, default: ""},
    onDropSorted: {type: Function, required: false, default: undefined},
    headerCellStyle: {type: Object, required: false, default: undefined},
  },
  methods: {
    handleSelectionChange(selection) {
      if (this.selectionChange) {
        this.selectionChange(selection);
      }
    },
    handleSortChange(x) {
      if (this.sortChange) {
        this.sortChange(x);
      }
    },
    rowDrop() {
      const el = this.$refs.dataTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        handle: '.draggable',
        ghostClass: 'custom-sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onChoose: evt => {
          evt.item.classList.add('custom-sortable-grabbing');
        },
        onUnchoose: evt => {
          evt.item.classList.remove('custom-sortable-grabbing');
        },
        onEnd: evt => {
          const targetRow = this.dataList.splice(evt.oldIndex, 1)[0];
          this.dataList.splice(evt.newIndex, 0, targetRow);
          if (this.onDropSorted) {
            this.onDropSorted(evt);
          }
        }
      });
    }
  },
  mounted() {
    if (this.needDropSort) {
      this.rowDrop();
    }
  }
}
</script>

<template>
  <el-table ref="dataTable"
            :row-key="rowKey"
            v-loading="loading" :data="dataList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            class="custom-table"
            :height="height"
            v-bind="$attrs"
            v-on="$listeners"
            :header-cell-style="headerCellStyle || {
              'background-color': '#EEEEEE',
              'color': '#333',
              'font-size': '14px',
              'font-weight': '700',
              'text-align': `${headTextAlign ? headTextAlign : 'center'}`
            }">
    <el-table-column v-if="needDropSort" width="55">
      <template>
        <svg-icon id="draggable" class="draggable" icon-class="question-drag" />
      </template>
    </el-table-column>
    <el-table-column v-if="needSelect" type="selection" width="48"/>
    <slot/>
    <div slot="empty" class="w-full">
      <slot name="empty"/>
    </div>
  </el-table>
</template>

<style scoped lang="scss">
::v-deep .el-checkbox__inner {
  border-color: #3662FF !important;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #3662FF !important;
}

::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #3662FF !important;
}

.draggable {
  cursor: grab;
}
</style>
