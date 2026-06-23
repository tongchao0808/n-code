<script>
import _ from "lodash";

export default {
  name: "StructureViewer",
  props: {
    record: {type: Object, required: true},
  },
  methods: {
    objectToStr(obj) {
      console.log('obj', obj);
      const container = [];
      for (let key of Object.keys(obj)) {
        const value = obj[key];
        container.push(`${key}: ${value}`);
      }
      return container.join(",");
    },
    parseSecondLevel(obj, key) {
      if (_.isString(obj)) {
        return {key: key, value: obj};
      }
      if (_.isArray(obj)) {
        const v = obj.map((x) => this.objectToStr(x)).join(";")
        return {key: key, value: v};
      }
      if (_.isObject(obj)) {
        const v = this.objectToStr(obj);
        return {key: key, value: v};
      }
    },
    mergePairs(arr) {
      const result = [];
      for (let i = 0; i < arr.length; i += 2) {
        const first = arr[i];
        let second = undefined;
        if (i < arr.length - 1) {
          second = arr[i + 1];
        }
        result.push({
          key1: first.key,
          value1: first.value,
          key2: second === undefined ? undefined : second.key,
          value2: second === undefined ? undefined : second.value,
        });
      }
      return result;
    },
    vTableSpan({row, column, rowIndex, columnIndex}) {
      if (row.key2 === undefined || row.value2 === undefined) {
        return {
          rowspan: 0,
          colspan: 2,
        }
      }
    },
    vTableColumnClass({row, column, rowIndex, columnIndex}) {
      if (columnIndex % 2 === 0) {
        return "bg-[#F2F3F5]"
      }
      return '';
    }
  },
  computed: {
    tables() {
      const container = [];
      for(let firstKey of Object.keys(this.record)) {
        const firstValue = this.record[firstKey];
        if (_.isArray(firstValue)) {
          const columnNames = [];
          for (let k of Object.keys(firstValue[0])) {
            columnNames.push(k);
          }
          container.push({
            title: firstKey,
            type: 'hTable',
            rows: firstValue,
            columns: columnNames,
          });
        } else if (_.isObjectLike(firstValue)) {
          const rows = [];
          for (let secondKey of Object.keys(firstValue)) {
            const secondValue = firstValue[secondKey];
            rows.push(this.parseSecondLevel(secondValue, secondKey))
          }
          container.push({
            title: firstKey,
            type: 'vTable',
            rows: this.mergePairs(rows),
          });
        }
      }
      return container;
    }
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div v-for="(item, index) in tables" :key="index">
      <div class="text-[#1D2129] text-[13px] font-bold mb-2">{{ item.title }}</div>
      <el-table v-if="item.type === 'vTable'" :data="item.rows" :show-header="false"
                border :span-method="vTableSpan" :cell-class-name="vTableColumnClass">
        <el-table-column prop="key1" label="章节" width="180"/>
        <el-table-column prop="value1" label="内容"/>
        <el-table-column prop="key2" label="章节" width="180"/>
        <el-table-column prop="value2" label="内容"/>
      </el-table>
      <el-table v-if="item.type === 'hTable'" :data="item.rows" border>
        <el-table-column v-for="(columnName, colIndex) in item.columns" :key="colIndex" :prop="columnName" :label="columnName"/>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
