<template>
  <div
    class="popover-wrap"
    @click.stop="popoverVisible = !popoverVisible"
    :class="{ visible: popoverVisible }"
  >
    <div
      v-if="selectedLeafNodes.length === 0"
      class="text-[12px] text-[#1D2129]"
    >
      选择知识库
    </div>
    <div class="w-full grid grid-cols-5 gap-[8px] pr-[20px]" v-else>
      <el-tag
        v-for="item in selectedLeafNodes"
        :key="item.id"
        closable
        type="info"
        @close="removeTag(item)"
        color="rgba(242, 243, 245, 1)"
        class="flex items-center h-[24px] "
      >
        <el-tooltip
          effect="dark"
          :content="item.name"
          placement="top-start"
          class="inline-block w-4/5 "
        >
          <span
            class="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ item.name }}</span
          >
        </el-tooltip>
      </el-tag>
    </div>
    <el-popover
      placement="bottom"
      trigger="manual"
      v-model="popoverVisible"
      @show="handlePopoverShow"
      @hide="handlePopoverHide"
      ref="popover"
      :popper-class="`left-0 right-0 overflow-y-auto max-h-[400px] ${$store.state.mainPageChat.mode === 'newChat' ? 'top-[32px]' : 'bottom-[32px]'}`"
    >
      <el-tree
        ref="tree"
        :data="processedTreeData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
        @check-change="handleCheckChange"
        :check-strictly="false"
        class="w-full custom-tree"
        icon-class="el-icon-arrow-right"
      >
        <span
          class="flex justify-between w-full custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span
            class="text-[#1D2129] text-[14px]"
            :class="{ 'is-pro': data.ownership == 'PRO' }"
            >{{ node.label }}</span
          >
          <span class="mr-[20px] flex items-center" v-if="data.isPro">
            <svg-icon icon-class="pro" class-name="!w-[44px] !h-[24px]" />
          </span>
        </span>
      </el-tree>
    </el-popover>
  </div>
</template>

<script>
import _ from "lodash";


export default {
  data() {
    return {
      popoverVisible: false,
      selectedLeafNodes: [],
      maxSelectable: 5,

      defaultProps: {
        children: "knowledgeDatabases",
        label: "name",
        disabled: "disabled",
      },
      cacheSelect: [],
      processedTreeData: [],
    };
  },
  props: {
    treeData: {
      type: Array,
      required: true,
      default: () => [],
    },
    selectedLeafIds: { type: Array, default: () => [] },
  },

  watch: {
    treeData: {
      immediate: true,
      handler(newVal) {
        this.$nextTick(() => {
          this.processTreeData(newVal);
        });
      },
    },
    selectedLeafIds: {
      immediate: true,
      handler(newVal) {
        this.cacheSelect = newVal;
        this.$nextTick(() => {
          this.processTreeData(this.treeData);
          setTimeout(() => {
            this.handleCheckChange();
          }, 100);
        });
      },
    },
  },
  mounted() {
    this.processTreeData(this.treeData);
  },
  beforeDestroy() {
    // 组件销毁前确保移除事件监听
    document.removeEventListener("click", this.handleDocumentClick);
  },
  methods: {
    closePopover() {
      this.popoverVisible = false;
    },
    handlePopoverShow() {
      // Popover 显示时添加全局点击监听
      this.$nextTick(() => {
        document.addEventListener("click", this.handleDocumentClick);
      });
    },

    handlePopoverHide() {
      // Popover 隐藏时移除全局点击监听
      document.removeEventListener("click", this.handleDocumentClick);
      // 选择关闭
      // console.log("选择关闭", this.cacheSelect);
      this.$emit("selectComplete", this.cacheSelect);
    },

    handleDocumentClick(event) {
      try {
        // 确保所有引用都存在
        const popoverEl = this.$refs.popover ? this.$refs.popover.$el : "";
        const triggerEl = this.$refs.trigger ? this.$refs.trigger.$el : "";

        if (!popoverEl || !triggerEl) {
          this.closePopover();
          return;
        }

        // 检查点击位置
        const isClickInside =
          popoverEl.contains(event.target) || triggerEl.contains(event.target);

        if (!isClickInside) {
          this.closePopover();
        }
      } catch (error) {
        console.error("Error handling document click:", error);
        document.removeEventListener("click", this.handleDocumentClick);
      }
    },
    isLeaf(node) {
      return !node.knowledgeDatabases || node.knowledgeDatabases.length === 0;
    },
    processTreeData(nodes) {
      this.processedTreeData = _.cloneDeep(nodes).map((node) => {
        return this.processNode(node);
      });
      this.$refs.tree.setCheckedKeys(this.cacheSelect.map((v) => v.id));
    },
    processNode(node) {
      const newNode = { ...node };
      const tree = this.$refs.tree;
      let allCheckedNodes = tree.getCheckedNodes(false, true);
      // 叶子节点
      const isSelected = allCheckedNodes.some((item) => item.id === newNode.id);
      // 如果已经达到最大选择数量且当前节点未被选中，则禁用
      newNode.disabled =
        this.cacheSelect.length >= this.maxSelectable && !isSelected;

      // 处理子节点
      if (!this.isLeaf(newNode) && newNode.knowledgeDatabases) {
        newNode.knowledgeDatabases = newNode.knowledgeDatabases.map((child) =>
          this.processNode(child)
        );
      }

      return newNode;
    },

    handleCheckChange(data, checkedNodes, checkedKeys) {
      // 获取所有选中的叶子节点
      const tree = this.$refs.tree;
      const cacheSelect = this.cacheSelect;
      let allCheckedNodes = tree.getCheckedNodes(false, true);
      const leafNodes = allCheckedNodes.filter(this.isLeaf);
      if (leafNodes.length > this.maxSelectable) {
        // 当选择数将大于限制数时，从cacheSelect中获取元素，然后添加不超出部分
        let trimmed = _.cloneDeep(cacheSelect);
        const cacheSelectIds = cacheSelect.map((v) => {
          return v.id;
        });
        const others = leafNodes.filter((v) => {
          return !cacheSelectIds.includes(v.id);
        });
        trimmed = trimmed.concat(
          others.slice(0, this.maxSelectable - cacheSelectIds.length)
        );
        const trimmedKeys = trimmed.map((n) => n.id);
        tree.setCheckedKeys(trimmedKeys);
        this.selectedLeafNodes = trimmed;
        this.cacheSelect = _.cloneDeep(trimmed);
      } else {
        this.selectedLeafNodes = leafNodes;
        // 保存不足最大个数的数据
        this.cacheSelect = _.cloneDeep(leafNodes);
      }
      // 每次触发去判断是否disabled
      this.processTreeData(this.treeData);
    },

    removeTag(node) {
      const tree = this.$refs.tree;
      tree.setChecked(node.id, false, true);
      const res = this.selectedLeafNodes.filter((n) => n.id !== node.id);
      this.selectedLeafNodes = res;
      this.cacheSelect = _.cloneDeep(res);
      if (res.length === 0) {
        this.$emit("selectComplete", []);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.popover-wrap {
  border-radius: 8px;
  background: #f7f8fa;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  position: relative;
  &::after {
    content: "";
    top: 50%;
    right: 8px;
    transform: translateY(-6px);
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: #5f646c;
    transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  }
  &.visible::after {
    transform: rotate(90deg);
  }
}
.custom-tree {
  .is-pro {
    background: linear-gradient(135deg, #3397FFFF, #5F9CFFFF, #AB5CFFFF);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      &::after {
        content: 'PRO';
        font-size: 10px;
        line-height: 12px;
        width: 28px;
        height: 15px;
        margin-left: 4px;
        border-radius: 8px 2px 8px 2px;
        padding: 2px 4px;
        background-clip: border-box;
        -webkit-text-fill-color: #fff;
        background: linear-gradient(135deg, #9BCCFF, #D1A6FF, #9799FF);
      }
  }
  ::v-deep .el-checkbox__inner {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  ::v-deep .el-tree-node__content {
    position: relative;
    height: 38px;
    line-height: 38px;
    // padding: 0 8px;
    &:hover {
      border-radius: 8px;
      background: #f7f8fa;
    }
    .el-tree-node__expand-icon {
      position: absolute;
      font-size: 22px;
      color: #5f646c;
      right: 8px;
      // top: 50%;
      // transform: translateY(-50%);
      // margin-top: -50%;
      transform: rotate(0);
      transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
      // transform-origin: top;
      &.expanded {
        transform: rotate(90deg);
      }
      &.is-leaf {
        font-size: 0;
      }
    }
  }
}
</style>
